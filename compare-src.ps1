$source = 'C:\Users\taewo\Downloads\vibeShop-source'
$target = 'c:\project\vibeShop-source'

Function Get-SourceFiles {
    param($Path)
    $folders = @('src', 'app', 'components', 'lib', 'types', 'hooks', 'utils', 'config', 'public')
    Get-ChildItem -Path $Path -Recurse -File -EA SilentlyContinue |
        Where-Object {
            $relative = $_.FullName.Replace($Path + '\', '')
            $firstDir = ($relative -split '\\|/')[0]
            $firstDir -in $folders -and $relative -notmatch '\.tsbuildinfo$'
        } |
        ForEach-Object { $_.FullName.Replace($Path + '\', '') }
}

$sourceFiles = Get-SourceFiles $source
$targetFiles = Get-SourceFiles $target

Write-Host '=== SOURCE CODE COMPARISON ===' -ForegroundColor Cyan
Write-Host "Downloads: $($sourceFiles.Count) files" -ForegroundColor Yellow
Write-Host "Project: $($targetFiles.Count) files" -ForegroundColor Green

$added = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '=>' } | Select-Object -ExpandProperty InputObject
$removed = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -ExpandProperty InputObject
$common = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '==' } | Select-Object -ExpandProperty InputObject

Write-Host "Common files: $($common.Count)" -ForegroundColor Cyan
Write-Host "Added (only in Project): $($added.Count)" -ForegroundColor Green
Write-Host "Removed (only in Downloads): $($removed.Count)" -ForegroundColor Red

if ($added) {
    Write-Host "`n=== ADDED SOURCE FILES ===" -ForegroundColor Green
    $added | Sort-Object | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
}

if ($removed) {
    Write-Host "`n=== REMOVED SOURCE FILES ===" -ForegroundColor Red
    $removed | Sort-Object | Select-Object -First 50 | ForEach-Object { Write-Host $_ }
}
