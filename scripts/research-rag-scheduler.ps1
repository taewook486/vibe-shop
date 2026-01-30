###############################################################################
# Research RAG Scheduler (PowerShell)
#
# Description: Automated script to run RAG research workflow periodically
# Usage: .\scripts\research-rag-scheduler.ps1 -Days 7
#
# Task Scheduler Setup:
#   1. Open Task Scheduler
#   2. Create Basic Task
#   3. Trigger: Weekly (Monday at 9:00 AM)
#   4. Action: Start a program
#      - Program: PowerShell.exe
#      - Arguments: -ExecutionPolicy Bypass -File "C:\path\to\project\scripts\research-rag-scheduler.ps1" -Days 7
#
###############################################################################

[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [ValidateRange(1, 365)]
    [int]$Days = 7,

    [Parameter()]
    [switch]$SkipGitCommit = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$LogDir = Join-Path $ProjectRoot ".moai\logs"
$LogFile = Join-Path $LogDir "research-rag-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$OutputDir = Join-Path $ProjectRoot ".moai\docs\research"
$CacheDir = Join-Path $ProjectRoot ".moai\cache"

# Create directories
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null

# Logging functions
function Log-Info {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [INFO] $Message"
    Write-Host $logMessage -ForegroundColor Green
    Add-Content -Path $LogFile -Value $logMessage
}

function Log-Error {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [ERROR] $Message"
    Write-Host $logMessage -ForegroundColor Red
    Add-Content -Path $LogFile -Value $logMessage
}

function Log-Warn {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [WARN] $Message"
    Write-Host $logMessage -ForegroundColor Yellow
    Add-Content -Path $LogFile -Value $logMessage
}

# Start logging
Log-Info "Starting RAG research workflow (last $Days days)"
Log-Info "Project root: $ProjectRoot"
Log-Info "Log file: $LogFile"

# Check dependencies
try {
    $claudeVersion = & claude --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log-Info "Claude Code CLI found: $claudeVersion"
    } else {
        throw "Claude Code CLI not found"
    }
} catch {
    Log-Error "Claude Code CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
}

# Check ANTHROPIC_API_KEY
if (-not $env:ANTHROPIC_API_KEY) {
    Log-Error "ANTHROPIC_API_KEY environment variable not set"
    Log-Info "Set it with: `$env:ANTHROPIC_API_KEY='your-key-here'"
    exit 1
}

# Create research prompt
$researchPrompt = Join-Path $CacheDir "research-prompt.txt"
$reportDate = Get-Date -Format "yyyy-MM-dd"

@"
Execute the /research-rag command with the following parameters:
- Days to look back: $Days
- Output directory: .moai\docs\research
- Memory storage: enabled

Please:
1. Search arXiv for recent RAG papers (keywords: "Retrieval Augmented Generation", "RAG")
2. Analyze and summarize findings
3. Extract and verify key equations with WolframAlpha
4. Store results in Memory MCP
5. Generate summary report in .moai\docs\research\rag-$reportDate.md
"@ | Out-File -FilePath $researchPrompt -Encoding UTF8

Log-Info "Research prompt created at $researchPrompt"

# Execute research workflow
Log-Info "Invoking Claude Code research workflow..."

try {
    & claude --prompt-file $researchPrompt 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Log-Info "Research workflow completed successfully"
    } else {
        Log-Error "Research workflow failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Log-Error "Error executing research workflow: $_"
    exit 1
}

# Git commit (optional)
if (-not $SkipGitCommit) {
    Log-Info "Committing research findings to git..."

    try {
        Set-Location $ProjectRoot

        git config user.email "research-bot@localhost"
        git config user.name "Research Bot"

        git add ".moai\docs\research\" 2>&1 | Out-Null
        git add ".moai\cache\arxiv-*.json" 2>&1 | Out-Null

        $status = git status --porcelain
        if ($status) {
            git commit -m "docs: RAG research update ($reportDate, last $Days days)"
            Log-Info "Changes committed successfully"
        } else {
            Log-Warn "No changes to commit"
        }
    } catch {
        Log-Warn "Git commit failed: $_"
    }
}

# Cleanup old logs (keep last 30 days)
try {
    $cutoffDate = (Get-Date).AddDays(-30)
    Get-ChildItem -Path $LogDir -Filter "research-rag-*.log" |
        Where-Object { $_.LastWriteTime -lt $cutoffDate } |
        Remove-Item -Force -ErrorAction SilentlyContinue
} catch {
    Log-Warn "Failed to cleanup old logs: $_"
}

# Output summary
Log-Info "Research workflow completed"
Log-Info "Log file: $LogFile"

Write-Host ""
Log-Info "=== Research Summary ==="
Write-Host "Files generated:"

$reportFiles = Get-ChildItem -Path $OutputDir -File | Sort-Object LastWriteTime -Descending
if ($reportFiles) {
    $reportFiles | Format-Table Name, Length, LastWriteTime -AutoSize
} else {
    Write-Host "  No reports found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Cache files:"

$cacheFiles = Get-ChildItem -Path $CacheDir -Filter "arxiv-*.json" -ErrorAction SilentlyContinue
if ($cacheFiles) {
    $cacheFiles | Format-Table Name, Length, LastWriteTime -AutoSize
} else {
    Write-Host "  No cache files" -ForegroundColor Gray
}

Write-Host ""

exit 0
