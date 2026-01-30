$source = 'C:\Users\taewo\Downloads\vibeShop-source'
$target = 'c:\project\vibeShop-source'

# Get all files in source recursively
$sourceFiles = Get-ChildItem -Path $source -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName.Replace($source + '\', '') }

# Get all files in target recursively
$targetFiles = Get-ChildItem -Path $target -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName.Replace($target + '\', '') }

# Find files only in source (removed in target)
$removed = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -ExpandProperty InputObject

# Find files only in target (added in target)
$added = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '=>' } | Select-Object -ExpandProperty InputObject

Write-Host '=== FILES ONLY IN DOWNLOADS (REMOVED) ===' -ForegroundColor Yellow
$removed | ForEach-Object { Write-Host $_ -ForegroundColor Red }

Write-Host ''
Write-Host '=== FILES ONLY IN PROJECT (ADDED) ===' -ForegroundColor Green
$added | ForEach-Object { Write-Host $_ -ForegroundColor Green }

Write-Host ''
Write-Host "Total Removed: $($removed.Count)"
Write-Host "Total Added: $($added.Count)"
