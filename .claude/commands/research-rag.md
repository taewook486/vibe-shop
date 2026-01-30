---
name: research-rag
description: Search arXiv for recent RAG (Retrieval Augmented Generation) papers, summarize them, verify key equations with WolframAlpha, and save to research memory
version: 1.0.0
author: Alfred
category: research
tags: [research, rag, arxiv, academic, automation]
allowed-tools: [WebSearch, WebFetch, Skill, mcp__memory__create_entities, mcp__memory__add_observations, TodoWrite, Write, Read]
user-invocable: true
---

# Research RAG Papers

Search arXiv for recent Retrieval Augmented Generation papers, analyze, verify equations, and store findings.

## Usage

```bash
/research-rag [days?]
```

### Parameters

- `days` (optional): Number of days to look back (default: 7)

### Examples

```bash
# Last 7 days (default)
/research-rag

# Last 30 days
/research-rag 30

# Last 24 hours
/research-rag 1
```

## Workflow

1. **Search**: Query arXiv for recent RAG papers
2. **Analyze**: Extract key findings and equations
3. **Verify**: Validate equations with WolframAlpha
4. **Store**: Save to Memory MCP for future reference

## Output

- Summary of papers in `.moai/docs/research/rag-{date}.md`
- Memory entities created for each paper
- Equations verified and documented

## Memory Storage

Papers are stored as:
- Entity: `rag_paper_{arxiv_id}`
- Observations: Title, authors, abstract, key equations, findings
- Relations: `cites`, `builds_on`, `improves`
