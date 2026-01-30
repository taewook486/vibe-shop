$exclude = @('node_modules', '.next', 'dist', 'build', '.turbo', 'coverage', '.nuxt', 'out', '.tsbuildinfo')
$source = 'C:\Users\taewo\Downloads\vibeShop-source'
$target = 'c:\project\vibeShop-source'

Function Get-FilesFiltered {
    param($Path)
    Get-ChildItem -Path $Path -Recurse -File -EA SilentlyContinue |
        Where-Object {
            $relative = $_.FullName.Replace($Path + '\', '')
            $firstDir = ($relative -split '\\|/')[0]
            $firstDir -notin $exclude -and $relative -notmatch '\.tsbuildinfo$'
        } |
        ForEach-Object { $_.FullName.Replace($Path + '\', '') }
}

$sourceFiles = Get-FilesFiltered $source
$targetFiles = Get-FilesFiltered $target

$added = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '=>' } | Select-Object -ExpandProperty InputObject
$removed = Compare-Object $sourceFiles $targetFiles | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -ExpandProperty InputObject

Write-Host '=== SUMMARY ===' -ForegroundColor Cyan
Write-Host "Source Files (Downloads): $($sourceFiles.Count)" -ForegroundColor Yellow
Write-Host "Target Files (Project): $($targetFiles.Count)" -ForegroundColor Green
Write-Host "Added (only in Project): $($added.Count)" -ForegroundColor Green
Write-Host "Removed (only in Downloads): $($removed.Count)" -ForegroundColor Red

Write-Host "`n=== KEY ADDED FILES (.ts, .tsx, .md, .json) ===" -ForegroundColor Green
$added | Where-Object { $_ -match '\.(ts|tsx|js|jsx|md|json|yml|yaml)$' } | Sort-Object | Select-Object -First 40 | ForEach-Object { Write-Host $_ }

Write-Host "`n=== KEY REMOVED FILES (.ts, .tsx, .md, .json) ===" -ForegroundColor Red
$removed | Where-Object { $_ -match '\.(ts|tsx|js|jsx|md|json|yml|yaml)$' } | Sort-Object | Select-Object -First 40 | ForEach-Object { Write-Host $_ }
