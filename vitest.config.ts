import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.jest-dom.ts', './tests/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/worktree/**',
      '**/.{git,cache,output,temp}/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/server': path.resolve(__dirname, 'node_modules/next/server.js'),
    },
  },
});
