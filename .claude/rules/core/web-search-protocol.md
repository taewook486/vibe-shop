# Web Search Protocol

Guidelines for using WebSearch and WebFetch tools with anti-hallucination safeguards.

## Anti-Hallucination Policy

### HARD Rules

- [HARD] URL Verification: All URLs must be verified via WebFetch before inclusion
- [HARD] Uncertainty Disclosure: Unverified information must be marked as uncertain
- [HARD] Source Attribution: All web search results must include actual search sources

## Execution Steps

### Step 1: Initial Search

Use WebSearch tool with specific, targeted queries.

**Best Practices:**
- Use specific, targeted queries rather than broad searches
- Include relevant technical terms and frameworks
- Use quotes for exact phrases
- Combine multiple concepts with AND operator

**Examples:**
- Good: `"React 19" server components best practices 2025`
- Bad: `React components`

### Step 2: URL Validation

Use WebFetch tool to verify each URL before inclusion in responses.

**Validation Checklist:**
- [ ] URL is accessible (returns 200 status)
- [ ] Content matches the claimed topic
- [ ] Information is current (check date if available)
- [ ] Source is credible (official docs, reputable sites)

### Step 3: Response Construction

Only include verified URLs with actual search sources.

**Response Format:**
```markdown
[Answer content based on verified sources]

**Sources:**
- [Source Title](URL)
- [Source Title 2](URL2)
```

## Prohibited Practices

- **Never** generate URLs not found in WebSearch results
- **Never** present information as fact when uncertain or speculative
- **Never** omit "Sources:" section when WebSearch was used
- **Never** include broken or inaccessible URLs
- **Never** claim information from a source without actually fetching and verifying it

## Uncertainty Disclosure

When information cannot be verified or is uncertain:

```
[Information] This appears to be the case based on available sources, but I cannot fully verify it from official documentation.

**Sources:**
- [Verified Source](URL)
```

## Source Attribution

Always include a "Sources:" section when WebSearch was used, even if only a few sources are relevant.

**Format:**
```
**Sources:**
- [Title of Source 1](URL1)
- [Title of Source 2](URL2)
```

## Best Practices

1. **Search First**: Always use WebSearch before making claims about external information
2. **Verify URLs**: Use WebFetch to verify URLs before including them
3. **Cite Sources**: Always provide source attribution
4. **Be Precise**: Use specific search queries to get relevant results
5. **Check Dates**: Prefer recent sources for technical information
6. **Official Sources**: Prioritize official documentation over third-party sites

## Error Handling

If WebSearch returns no results:
- Reformulate the query with different terms
- Break complex queries into simpler ones
- Try alternative technical terms
- Acknowledge if information cannot be found

If WebFetch fails to access a URL:
- Mark the source as potentially unavailable
- Do not include information from that source
- Search for alternative sources
- Inform user if critical information cannot be verified
