# Memory MCP Integration

Guidelines for using the Memory MCP Server for persistent storage across sessions.

## Overview

MoAI-ADK uses the Memory MCP Server for persistent storage across sessions. This enables user preference retention, project context preservation, and learned pattern storage.

## Memory Categories

### User Preferences (prefix: `user_`)

- `user_language`: Conversation language
- `user_coding_style`: Preferred coding conventions
- `user_naming_convention`: Variable naming style

### Project Context (prefix: `project_`)

- `project_tech_stack`: Technologies in use
- `project_architecture`: Architecture decisions
- `project_conventions`: Project-specific rules

### Learned Patterns (prefix: `pattern_`)

- `pattern_preferred_libraries`: Frequently used libraries
- `pattern_error_resolutions`: Common error fixes

### Session State (prefix: `session_`)

- `session_last_spec`: Last worked SPEC ID
- `session_pending_tasks`: Incomplete tasks

## Usage Protocol

### On Session Start

1. Retrieve `user_language` and apply to responses
2. Load `project_tech_stack` for context
3. Check `session_last_spec` for continuity

### During Interaction

1. Store explicit user preferences when stated
2. Learn from corrections and adjustments
3. Update project context when decisions are made

### When to Store

- User explicitly states a preference
- User corrects or adjusts Claude's output
- Important project decision is made
- New pattern is learned

## Memory Operations

Use `mcp__memory__*` tools:

- `mcp__memory__create_entities`: Create memory entities
- `mcp__memory__create_relations`: Create relationships between entities
- `mcp__memory__add_observations`: Add observations to entities
- `mcp__memory__delete_entities`: Remove entities
- `mcp__memory__delete_observations`: Remove observations
- `mcp__memory__delete_relations`: Remove relationships
- `mcp__memory__read_graph`: Read the memory graph
- `mcp__memory__search_nodes`: Search for nodes in the graph
- `mcp__memory__open_nodes`: Open specific nodes

## Best Practices

- Use descriptive, categorized key names
- Keep values concise (under 1000 characters)
- Never store sensitive credentials
- Store preferences, not personal data

## Agent-to-Agent Context Sharing

Memory MCP enables context sharing between agents during workflow execution.

### Handoff Key Schema

```
handoff_{from_agent}_{to_agent}_{spec_id}
context_{spec_id}_{category}
```

### Categories

`requirements`, `architecture`, `api`, `database`, `decisions`, `progress`

### Workflow Example

1. manager-spec stores: `context_SPEC-001_requirements`
2. manager-ddd retrieves: `context_SPEC-001_requirements`
3. expert-backend stores: `context_SPEC-001_api`
4. expert-frontend retrieves: `context_SPEC-001_api`
5. manager-docs retrieves all: `context_SPEC-001_*`

### Enabled Agents

- manager-spec, manager-ddd, manager-docs, manager-strategy
- expert-backend, expert-frontend

## Advanced Usage

For detailed patterns on Memory MCP usage, refer to:

```javascript
Skill("moai-foundation-memory")
```

This skill provides comprehensive patterns for:
- Preference storage and retrieval
- Context preservation across sessions
- Agent handoff protocols
- Learned pattern management
