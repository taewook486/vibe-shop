# User Interaction Architecture

Guidelines for effective user interaction and agent communication.

## Critical Constraint

**Subagents invoked via Task() operate in isolated, stateless contexts and cannot interact with users directly.**

This is a fundamental architectural limitation that all agent implementations must respect.

## Correct Workflow Pattern

### Step 1: Collect User Preferences (Alfred)

Alfred uses `AskUserQuestion` to collect user preferences before delegation.

**Best Practices:**
- Ask all necessary questions upfront
- Maximum 4 options per question
- No emoji characters in question text, headers, or option labels
- Questions must be in user's conversation_language
- Provide clear descriptions for each option

### Step 2: Invoke Agent with Context (Alfred)

Alfred invokes `Task()` with user choices in the prompt.

**Prompt Requirements:**
- Include all user preferences
- Provide context about the task
- Specify any constraints or requirements
- Include relevant background information

### Step 3: Agent Execution (Subagent)

Subagent executes based on provided parameters without user interaction.

**Agent Constraints:**
- Cannot use AskUserQuestion tool
- Must work within provided parameters
- Should return structured response
- May include recommendations for follow-up actions

### Step 4: Return Results (Subagent)

Subagent returns structured response with results.

**Response Format:**
- Summary of work completed
- Key findings or outcomes
- Any issues encountered
- Recommendations for next steps

### Step 5: Follow-up Interaction (Alfred)

Alfred uses AskUserQuestion for next decision based on agent response.

**Decision Points:**
- Approval of changes
- Selection from alternatives
- Clarification of requirements
- Confirmation before critical actions

## AskUserQuestion Constraints

### Maximum Options

- **Maximum**: 4 options per question
- **Recommended**: 2-3 options for clarity
- **Minimum**: 2 options (unless yes/no question)

### No Emoji Characters

- **Prohibited**: Emoji in question text
- **Prohibited**: Emoji in headers
- **Prohibited**: Emoji in option labels
- **Allowed**: Plain text, numbers, symbols (-, /, etc.)

### Language Requirements

- **Question text**: Must be in user's conversation_language
- **Option labels**: Must be in user's conversation_language
- **Descriptions**: Must be in user's conversation_language
- **Technical terms**: May remain in English if appropriate

### Option Structure

Each option should include:
- **label**: Short, descriptive text (5-10 words)
- **description**: Detailed explanation (1-2 sentences)
- **metadata**: (optional) Additional context for decision-making

## Common Patterns

### Approval Workflow

```
Alfred: "I've completed the analysis. Should I proceed?"
User: [Selects option]
Alfred: [Delegates to agent with user's choice]
```

### Alternative Selection

```
Alfred: "Which approach would you prefer?"
Options:
- "Approach A" - Description of approach A
- "Approach B" - Description of approach B
- "Approach C" - Description of approach C
User: [Selects option]
Alfred: [Delegates to agent with selected approach]
```

### Clarification Workflow

```
Alfred: "I need clarification on this aspect. Which option matches your needs?"
User: [Selects option]
Alfred: [Now has clear requirements, delegates to agent]
```

## Agent Communication Patterns

### One-Way Communication

Alfred → Subagent: Task delegation with full context
Subagent → Alfred: Structured response with results

### No Direct User Contact

Subagents must NOT:
- Use AskUserQuestion tool
- Request user input directly
- Display interactive prompts
- Expect user responses during execution

### Structured Responses

Subagents should provide:
- **Summary**: Brief overview of work completed
- **Results**: Specific outcomes, findings, or changes
- **Issues**: Any problems encountered
- **Recommendations**: Suggestions for next steps

## Error Handling

### Agent Execution Failure

If subagent fails:
1. Alfred receives error details
2. Alfred informs user of failure
3. Alfred uses AskUserQuestion for next action
4. Alfred may retry with different agent or approach

### User Cancellation

If user cancels during agent execution:
1. Alfred stops the agent
2. Alfred reports partial progress
3. Alfred uses AskUserQuestion for next action

## Best Practices

### Before Delegation

- Verify all user preferences collected
- Confirm task requirements are clear
- Check agent has necessary tools
- Provide comprehensive context

### During Execution

- Monitor agent progress (if possible)
- Prepare for follow-up questions
- Anticipate user decisions
- Plan next steps

### After Execution

- Review agent results
- Synthesize information for user
- Prepare follow-up questions
- Document outcomes

## Examples

### Good: Complete Workflow

```
1. Alfred: "What type of authentication do you need?"
   User: [Selects "JWT with refresh tokens"]

2. Alfred: [Delegates to expert-backend with clear requirement]

3. expert-backend: [Implements JWT authentication]

4. Alfred: "Authentication is ready. What's the next step?"
   User: [Selects "Create login UI"]
```

### Bad: Violation of Constraints

```
1. Alfred: [Delegates to expert-backend]

2. expert-backend: "What type of authentication do you need?" ❌
   (Subagent cannot ask questions directly)

3. User: [Cannot respond - no direct communication]
```

## Output Format Rules

### User-Facing Communication

- **Format**: Markdown only
- **Style**: Clear, concise, professional
- **Language**: User's conversation_language
- **Structure**: Use headers, lists, code blocks appropriately

### Internal Agent Communication

- **Format**: Can include XML tags
- **Purpose**: Structured data transfer between agents
- **Usage**: Never displayed to users
- **Example**: `<agent_response>...</agent_response>`
