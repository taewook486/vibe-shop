# RAG Research Automation System

Automated research workflow for Retrieval Augmented Generation papers.

## Quick Start

### Manual Execution

```bash
# Research last 7 days (default)
/research-rag

# Research last 30 days
/research-rag 30

# Research last 24 hours
/research-rag 1
```

### Scheduled Execution

#### Option 1: GitHub Actions (Recommended)

1. Set `ANTHROPIC_API_KEY` in GitHub repository secrets
2. Push `.github/workflows/research-rag.yml` to repository
3. Workflow runs every Monday at 9:00 AM KST

Manual trigger:
```bash
gh workflow run research-rag.yml -f days=30
```

#### Option 2: Cron Job (Unix/Linux)

```bash
# Make script executable
chmod +x scripts/research-rag-scheduler.sh

# Add to crontab (crontab -e)
# Every Monday at 9:00 AM
0 9 * * 1 /path/to/project/scripts/research-rag-scheduler.sh 7 >> /var/log/rag-research.log 2>&1

# Daily at 9:00 AM
0 9 * * * /path/to/project/scripts/research-rag-scheduler.sh 1 >> /var/log/rag-research.log 2>&1
```

#### Option 3: Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Weekly (Monday at 9:00 AM)
4. Action: Start a program
   - Program: `PowerShell.exe`
   - Arguments: `-ExecutionPolicy Bypass -File "C:\path\to\project\scripts\research-rag-scheduler.ps1" -Days 7`

## Output Files

### Research Reports
- Location: `.moai/docs/research/rag-YYYY-MM-DD.md`
- Content: Paper summaries, key findings, verified equations

### Cache Files
- Location: `.moai/cache/arxiv-search-*.json`
- Content: Raw search results from arXiv

### Logs
- Location: `.moai/logs/research-rag-*.log`
- Retention: 30 days

## Memory Storage

Research findings are automatically stored in Memory MCP as:

- **Entities**: `rag_paper_{arxiv_id}`, `rag_concept_{name}`, `rag_dataset_{name}`
- **Relations**: `cites`, `builds_on`, `improves`, `uses_dataset`

Query stored research:
```bash
# Search memory for RAG papers
memory search "rag paper 2024"

# Get specific paper
memory open "rag_paper_2024.xxxxx"

# Find related papers
memory search "cites rag_paper_2024.xxxxx"
```

## Environment Variables

Required:
```bash
export ANTHROPIC_API_KEY='your-api-key'
```

Optional:
```bash
export GIT_COMMIT=true  # Auto-commit to git (default: true)
```

## Customization

### Change Search Frequency

Edit `.github/workflows/research-rag.yml`:
```yaml
schedule:
  # Every day at 9:00 AM
  - cron: '0 9 * * *'

  # Every Monday and Thursday
  - cron: '0 9 * * 1,4'

  # Every 1st of the month
  - cron: '0 9 1 * *'
```

### Extend Workflow

1. Edit `.claude/skills/research-rag-workflow/SKILL.md`
2. Add custom analysis steps
3. Modify memory schema as needed

## Troubleshooting

### No papers found
- Increase `DAYS` parameter
- Check arXiv connectivity
- Verify search keywords

### Memory storage errors
- Check MCP server connection
- Verify `ANTHROPIC_API_KEY` is set
- Check memory entity permissions

### Cron job not running
- Check crontab with `crontab -l`
- Verify script permissions: `ls -l scripts/research-rag-scheduler.sh`
- Check system logs: `grep CRON /var/log/syslog`

### Task Scheduler not working (Windows)
- Run manually first to test: `.\scripts\research-rag-scheduler.ps1 -Days 1`
- Check PowerShell execution policy: `Get-ExecutionPolicy`
- View Task Scheduler history for errors

## Integration with MoAI

This workflow integrates with:
- `moai-foundation-memory`: Persistent storage
- `moai-workflow-research`: Research methodology
- `moai-docs-generation`: Report generation

## Examples

### Example 1: Daily Research Update

```bash
# Add to crontab
0 9 * * * /path/to/scripts/research-rag-scheduler.sh 1

# Output
# .moai/docs/research/rag-2024-01-30.md
# .moai/logs/research-rag-20240130-090000.log
```

### Example 2: Monthly Deep Dive

```bash
# Run manually
./scripts/research-rag-scheduler.sh 30

# Or trigger GitHub Actions
gh workflow run research-rag.yml -f days=30
```

### Example 3: Custom Analysis

```bash
# Modify the research prompt
export CUSTOM_KEYWORDS="retrieval augmented generation, RAG, vector database"
export CATEGORIES="cs.CL,cs.AI,cs.LG,cs.IR"
./scripts/research-rag-scheduler.sh 7
```

## Support

For issues or questions:
- Check logs in `.moai/logs/`
- Verify configuration in `.claude/`
- Test with `/research-rag 1` first
