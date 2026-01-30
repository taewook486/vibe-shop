#!/bin/bash

###############################################################################
# Research RAG Scheduler
#
# Description: Automated script to run RAG research workflow periodically
# Usage: ./scripts/research-rag-scheduler.sh [days]
#
# Cron Setup:
#   # Weekly - Every Monday at 9:00 AM
#   0 9 * * 1 /path/to/project/scripts/research-rag-scheduler.sh 7 >> /var/log/rag-research.log 2>&1
#
#   # Daily at 9:00 AM
#   0 9 * * * /path/to/project/scripts/research-rag-scheduler.sh 1 >> /var/log/rag-research.log 2>&1
#
###############################################################################

set -euo pipefail

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${PROJECT_ROOT}/.moai/logs"
LOG_FILE="${LOG_DIR}/research-rag-$(date +%Y%m%d-%H%M%S).log"
DAYS="${1:-7}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "${LOG_FILE}"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "${LOG_FILE}"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $*" | tee -a "${LOG_FILE}"
}

# Create log directory
mkdir -p "${LOG_DIR}"
mkdir -p "${PROJECT_ROOT}/.moai/docs/research"
mkdir -p "${PROJECT_ROOT}/.moai/cache"

log_info "Starting RAG research workflow (last ${DAYS} days)"

# Check dependencies
if ! command -v claude &> /dev/null; then
    log_error "Claude Code CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
fi

# Check ANTHROPIC_API_KEY
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    log_error "ANTHROPIC_API_KEY environment variable not set"
    log_info "Set it with: export ANTHROPIC_API_KEY='your-key-here'"
    exit 1
fi

# Create research prompt
RESEARCH_PROMPT="${PROJECT_ROOT}/.moai/cache/research-prompt.txt"
cat > "${RESEARCH_PROMPT}" << EOF
Execute the /research-rag command with the following parameters:
- Days to look back: ${DAYS}
- Output directory: .moai/docs/research
- Memory storage: enabled

Please:
1. Search arXiv for recent RAG papers (keywords: "Retrieval Augmented Generation", "RAG")
2. Analyze and summarize findings
3. Extract and verify key equations with WolframAlpha
4. Store results in Memory MCP
5. Generate summary report in .moai/docs/research/rag-$(date +%Y-%m-%d).md
EOF

log_info "Research prompt created"

# Execute research workflow
log_info "Invoking Claude Code research workflow..."

if claude --prompt-file "${RESEARCH_PROMPT}" 2>&1 | tee -a "${LOG_FILE}"; then
    log_info "Research workflow completed successfully"
else
    log_error "Research workflow failed"
    exit 1
fi

# Git commit (optional)
if [[ "${GIT_COMMIT:-true}" == "true" ]]; then
    log_info "Committing research findings to git..."

    cd "${PROJECT_ROOT}"
    git config user.email "research-bot@localhost"
    git config user.name "Research Bot"

    git add .moai/docs/research/ || true
    git add .moai/cache/arxiv-*.json 2>/dev/null || true

    if git diff --staged --quiet; then
        log_warn "No changes to commit"
    else
        git commit -m "docs: RAG research update ($(date +%Y-%m-%d), last ${DAYS} days)"
        log_info "Changes committed successfully"
    fi
fi

# Cleanup old logs (keep last 30 days)
find "${LOG_DIR}" -name "research-rag-*.log" -mtime +30 -delete 2>/dev/null || true

log_info "Research workflow completed"
log_info "Log file: ${LOG_FILE}"

# Output summary
echo ""
log_info "=== Research Summary ==="
echo "Files generated:"
ls -lh "${PROJECT_ROOT}/.moai/docs/research/" | tail -n +2 || echo "  No reports found"
echo ""
echo "Cache files:"
ls -lh "${PROJECT_ROOT}/.moai/cache/arxiv-"*.json 2>/dev/null | tail -n +2 || echo "  No cache files"
echo ""

exit 0
