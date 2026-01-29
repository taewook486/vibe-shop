# Request Processing Pipeline

Detailed reference for Alfred's request processing workflow.

## Phase 1: Analyze

Analyze user request to determine routing:

**Assessment:**
- Complexity and scope of the request
- Technology keywords for agent matching (framework names, domain terms)
- Clarification needed before delegation

**Clarification Rules:**
- Only Alfred uses AskUserQuestion (subagents cannot use it)
- When user intent is unclear, use AskUserQuestion to clarify before proceeding
- Collect all necessary user preferences before delegating
- Maximum 4 options per question, no emoji in question text

## Phase 2: Route

Route request based on command type:

**Type A - Workflow Commands:**
- Commands: `/moai:0-project`, `/moai:1-plan`, `/moai:2-run`, `/moai:3-sync`
- Allowed Tools: Full access (Task, AskUserQuestion, TodoWrite, Bash, Read, Write, Edit, Glob, Grep)
- Agent delegation recommended for complex tasks
- Direct tool usage permitted for simpler operations

**Type B - Utility Commands:**
- Commands: `/moai:alfred`, `/moai:fix`, `/moai:loop`
- Allowed Tools: Task, AskUserQuestion, TodoWrite, Bash, Read, Write, Edit, Glob, Grep
- Direct tool access permitted for efficiency
- Agent delegation optional but recommended for complex operations

**Type C - Feedback Commands:**
- Commands: `/moai:9-feedback`
- Purpose: User feedback for improvements and bug reports
- Allowed Tools: Full access (all tools)

**Direct Agent Requests:**
- Immediate delegation when user explicitly requests an agent

## Phase 3: Execute

### Execution Patterns

**Sequential Chaining:**
First use expert-debug to identify issues, then use expert-refactoring to implement fixes, finally use expert-testing to validate

**Parallel Execution:**
Use expert-backend to develop the API while simultaneously using expert-frontend to create the UI

### Task Decomposition (Auto-Parallel)

When receiving complex tasks, Alfred automatically decomposes and parallelizes.

**Trigger Conditions:**
- Task involves 2+ distinct domains (backend, frontend, testing, docs)
- Task description contains multiple deliverables
- Keywords: "implement", "create", "build" with compound requirements

**Decomposition Process:**
1. **Analyze**: Identify independent subtasks by domain
2. **Map**: Assign each subtask to optimal agent
3. **Execute**: Launch agents in parallel (single message, multiple Task calls)
4. **Integrate**: Consolidate results into unified response

**Example:**

```
User: "Implement authentication system"

Alfred Decomposition:
├─ expert-backend  → JWT token, login/logout API (parallel)
├─ expert-backend  → User model, database schema  (parallel)
├─ expert-frontend → Login form, auth context     (parallel)
└─ expert-testing  → Auth test cases              (after impl)

Execution: 3 agents parallel → 1 agent sequential
```

**Parallel Execution Rules:**
- Independent domains: Always parallel
- Same domain, no dependency: Parallel
- Sequential dependency: Chain with "after X completes"
- Max parallel agents: Up to 10 agents for better throughput

**Context Optimization:**
- Pass comprehensive context to agents (spec_id, key requirements, detailed architecture)
- Include background information, reasoning process, and relevant details
- Each agent gets independent 200K token session with sufficient context

## Phase 4: Report

Integrate and report results:
- Consolidate agent execution results
- Format response in user's conversation_language
- Use Markdown for all user-facing communication
- Never display XML tags in user-facing responses (reserved for agent-to-agent data transfer)
