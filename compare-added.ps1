$source = 'C:\Users\taewo\Downloads\vibeShop-source'
$target = 'c:\project\vibeShop-source'

$sourceFiles = Get-ChildItem -Path $source -Recurse -File -EA SilentlyContinue | ForEach-Object { $_.FullName.Replace($source + '\', '') }
$targetFiles = Get-ChildItem -Path $target -Recurse -File -EA SilentlyContinue | ForEach-Object { $_.FullName.Replace($target + '\', '') }

$added = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '=>' } | Select-Object -ExpandProperty InputObject
$removed = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -ExpandProperty InputObject

Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total Files in Downloads: $($sourceFiles.Count)" -ForegroundColor Yellow
Write-Host "Total Files in Project: $($targetFiles.Count)" -ForegroundColor Green
Write-Host "Added (only in Project): $($added.Count)" -ForegroundColor Green
Write-Host "Removed (only in Downloads): $($removed.Count)" -ForegroundColor Red

Write-Host "`n=== ADDED FILES (only in project) ===" -ForegroundColor Green
$added | Sort-Object | ForEach-Object { Write-Host $_ }

Write-Host "`n=== REMOVED FILES (only in downloads) ===" -ForegroundColor Red
$removed | Sort-Object | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
if ($removed.Count -gt 50) {
    Write-Host "... and $($removed.Count - 50) more files" -ForegroundColor DarkRed
}
