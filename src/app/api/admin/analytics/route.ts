import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, subMonths, format } from 'date-fns';

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();

  // Check admin authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || 'week'; // day, week, month

  try {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let dateFormat: string;
    let dateGrouping: 'hour' | 'day' | 'week';

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        previousStartDate = subDays(startDate, 1);
        dateFormat = 'HH:mm';
        dateGrouping = 'hour';
        break;
      case 'week':
        startDate = startOfWeek(now);
        previousStartDate = subWeeks(startDate, 1);
        dateFormat = 'EEE';
        dateGrouping = 'day';
        break;
      case 'month':
        startDate = startOfMonth(now);
        previousStartDate = subMonths(startDate, 1);
        dateFormat = 'MM/dd';
        dateGrouping = 'day';
        break;
      default:
        startDate = startOfWeek(now);
        previousStartDate = subWeeks(startDate, 1);
        dateFormat = 'EEE';
        dateGrouping = 'day';
    }

    // Fetch all completed orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, status, total_amount')
      .eq('status', 'completed')
      .gte('created_at', previousStartDate.toISOString());

    if (ordersError) throw ordersError;

    // Fetch order items with product info
    const orderIds = orders?.map(o => o.id) || [];
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        order_id,
        quantity,
        products (
          id,
          name,
          price
        )
      `)
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    // Fetch all users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at, role');

    if (profilesError) throw profilesError;

    // Calculate sales data
    const salesData = generateTimeSeriesData(
      orders || [],
      startDate,
      now,
      dateGrouping,
      dateFormat
    );

    // Calculate order status distribution
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('status')
      .gte('created_at', startDate.toISOString());

    if (allOrdersError) throw allOrdersError;

    const ordersByStatus = {
      pending: allOrders?.filter(o => o.status === 'pending').length || 0,
      completed: allOrders?.filter(o => o.status === 'completed').length || 0,
      cancelled: allOrders?.filter(o => o.status === 'cancelled').length || 0,
      refunded: allOrders?.filter(o => o.status === 'refunded').length || 0,
    };

    // Calculate top products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();

    orderItems?.forEach((item: any) => {
      if (item.products) {
        const productId = item.products.id;
        const productName = item.products.name;
        const quantity = item.quantity;
        const revenue = item.products.price * quantity;

        const existing = productSales.get(productId);
        if (existing) {
          existing.quantity += quantity;
          existing.revenue += revenue;
        } else {
          productSales.set(productId, { name: productName, quantity, revenue });
        }
      }
    });

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate user statistics
    const currentPeriodOrders = orders?.filter(
      o => new Date(o.created_at) >= startDate
    ) || [];

    const previousPeriodOrders = orders?.filter(
      o => new Date(o.created_at) >= previousStartDate && new Date(o.created_at) < startDate
    ) || [];

    const totalRevenue = currentPeriodOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const revenueChange = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const totalOrders = currentPeriodOrders.length;
    const previousOrders = previousPeriodOrders.length;
    const ordersChange = previousOrders > 0
      ? ((totalOrders - previousOrders) / previousOrders) * 100
      : 0;

    const newUsers = profiles?.filter(
      p => new Date(p.created_at) >= startDate
    ).length || 0;

    const previousNewUsers = profiles?.filter(
      p => new Date(p.created_at) >= previousStartDate && new Date(p.created_at) < startDate
    ).length || 0;

    const usersChange = previousNewUsers > 0
      ? ((newUsers - previousNewUsers) / previousNewUsers) * 100
      : 0;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const response = {
      period,
      summary: {
        totalRevenue,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        totalOrders,
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        avgOrderValue,
        newUsers,
        usersChange: parseFloat(usersChange.toFixed(1)),
      },
      salesData,
      ordersByStatus,
      topProducts,
      userStats: {
        total: profiles?.length || 0,
        newThisPeriod: newUsers,
        admins: profiles?.filter(p => p.role === 'admin').length || 0,
        customers: profiles?.filter(p => p.role === 'customer').length || 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateTimeSeriesData(
  orders: any[],
  startDate: Date,
  endDate: Date,
  grouping: 'hour' | 'day' | 'week',
  dateFormat: string
): Array<{ date: string; revenue: number; orders: number }> {
  const data: Array<{ date: string; revenue: number; orders: number }> = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const nextPeriod = new Date(current);

    switch (grouping) {
      case 'hour':
        nextPeriod.setHours(current.getHours() + 1);
        break;
      case 'day':
        nextPeriod.setDate(current.getDate() + 1);
        break;
      case 'week':
        nextPeriod.setDate(current.getDate() + 7);
        break;
    }

    const periodOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at);
      return orderDate >= current && orderDate < nextPeriod;
    });

    const revenue = periodOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    data.push({
      date: format(current, dateFormat),
      revenue,
      orders: periodOrders.length,
    });

    current.setTime(nextPeriod.getTime());
  }

  return data;
}
