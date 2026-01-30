---
name: research-rag-workflow
description: Automated research workflow for Retrieval Augmented Generation papers - searches arXiv, analyzes papers, verifies equations with WolframAlpha, and stores findings in Memory MCP
version: 1.0.0
category: research
status: active
author: Alfred
tags: [research, rag, arxiv, academic, automation, memory]
triggers:
  keywords: ["research rag", "arxiv rag", "rag papers", "retrieval augmented generation"]
  phases: [plan, run, sync]
allowed-tools: [WebSearch, WebFetch, mcp__memory__create_entities, mcp__memory__add_observations, mcp__memory__create_relations, Write, Read, TodoWrite]
modularized: true
progressive_disclosure:
  level_1_tokens: 100
  level_2_tokens: 3000
  level_3_bundled: [reference.md, modules/*.md]
user-invocable: true
---

# Research RAG Workflow

Automated research system for Retrieval Augmented Generation papers.

## Overview

This skill automates the process of:
1. Searching arXiv for recent RAG papers
2. Analyzing and summarizing key findings
3. Extracting and verifying mathematical equations
4. Storing research insights in Memory MCP

## Quick Start

```bash
# Basic usage - search last 7 days
/research-rag

# Custom timeframe - last 30 days
/research-rag 30

# Last 24 hours
/research-rag 1
```

## Workflow Steps

### 1. Search Phase

Query arXiv with:
- Keywords: "Retrieval Augmented Generation", "RAG", "LLM retrieval"
- Date filter: Last N days
- Categories: cs.CL, cs.AI, cs.LG

### 2. Analysis Phase

For each paper:
- Extract title, authors, abstract
- Identify key contributions
- Extract mathematical equations
- Summarize methodology

### 3. Verification Phase

Use WolframAlpha to:
- Validate equation syntax
- Verify mathematical correctness
- Check variable definitions

### 4. Storage Phase

Create memory entities:
```javascript
{
  entityName: "rag_paper_{arxiv_id}",
  entityType: "research_paper",
  observations: [
    "Title: {title}",
    "Authors: {authors}",
    "Abstract: {abstract}",
    "Key Equations: {equations}",
    "Contributions: {contributions}"
  ]
}
```

## Memory Schema

### Entities

- `rag_paper_{arxiv_id}`: Individual paper
- `rag_concept_{name}`: Key concepts (e.g., "rag_architecture", "retrieval_metrics")
- `rag_dataset_{name}`: Datasets used

### Relations

- `cites`: Paper A cites Paper B
- `builds_on`: Paper builds on concept
- `improves`: Paper improves method
- `uses_dataset`: Paper uses dataset

## Output Files

- `.moai/docs/research/rag-{YYYY-MM-DD}.md`: Summary report
- `.moai/cache/arxiv-search-{timestamp}.json`: Raw search results

## Equations Format

Extract equations in LaTeX format:
```latex
$$
P(y|x, D) = \int P(y|x, z) P(z|D) dz
$$
```

## Best Practices

1. **Search Strategy**: Use specific date ranges to get relevant results
2. **Equation Extraction**: Focus on core architectural equations
3. **Verification**: Check equation consistency, not just syntax
4. **Memory Storage**: Create relations between related papers

## Examples

### Example 1: Weekly Research Update

```bash
/research-rag 7
```

Output:
```
Found 12 papers in last 7 days
- "Advanced RAG Techniques" (arXiv:2024.xxxxx)
- "Hierarchical Retrieval for LLMs" (arXiv:2024.yyyyy)
...
Stored 12 entities in memory
Created 8 relations between papers
```

### Example 2: Monthly Deep Dive

```bash
/research-rag 30
```

Output:
```
Found 45 papers in last 30 days
Top contributions:
- Improved retrieval accuracy by 15%
- New hybrid retrieval method
- Reduced latency by 40%
...
```

## Integration with MoAI

This skill integrates with:
- `moai-foundation-memory`: For persistent storage
- `moai-workflow-research`: For research methodology
- `moai-docs-generation`: For report generation

## Troubleshooting

**No papers found**: Increase date range or check search query
**WolframAlpha errors**: Some equations may not be verifiable automatically
**Memory storage errors**: Check MCP server connection

## Future Enhancements

- [ ] Automatic citation graph generation
- [ ] Trend analysis over time
- [ ] Integration with paper repositories
- [ ] Automated literature review reports
