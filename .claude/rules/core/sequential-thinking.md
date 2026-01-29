# Sequential Thinking

Guidelines for using the Sequential Thinking MCP tool for complex reasoning.

## Activation Triggers

Use the Sequential Thinking MCP tool in the following situations:

- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out
- Architecture decisions affecting 3+ files
- Technology selection between multiple options
- Performance vs maintainability trade-offs
- Breaking changes under consideration
- Library or framework selection required
- Multiple approaches exist to solve the same problem
- Repetitive errors occur

## Tool Parameters

The sequential_thinking tool accepts the following parameters:

### Required Parameters

- **thought** (string): The current thinking step content
- **nextThoughtNeeded** (boolean): Whether another thought step is needed after this one
- **thoughtNumber** (integer): Current thought number (starts from 1)
- **totalThoughts** (integer): Estimated total thoughts needed for the analysis

### Optional Parameters

- **isRevision** (boolean): Whether this thought revises previous thinking (default: false)
- **revisesThought** (integer): Which thought number is being reconsidered (used with isRevision: true)
- **branchFromThought** (integer): Branching point thought number for alternative reasoning paths
- **branchId** (string): Identifier for the reasoning branch
- **needsMoreThoughts** (boolean): If more thoughts are needed beyond current estimate

## Sequential Thinking Process

The Sequential Thinking MCP tool provides structured reasoning with:

- Step-by-step breakdown of complex problems
- Context maintenance across multiple reasoning steps
- Ability to revise and adjust thinking based on new information
- Filtering of irrelevant information for focus on key issues
- Course correction during analysis when needed

## Usage Pattern

When encountering complex decisions that require deep analysis, use the Sequential Thinking MCP tool:

### Step 1: Initial Call

```
thought: "Analyzing the problem: [describe problem]"
nextThoughtNeeded: true
thoughtNumber: 1
totalThoughts: 5
```

### Step 2: Continue Analysis

```
thought: "Breaking down: [sub-problem 1]"
nextThoughtNeeded: true
thoughtNumber: 2
totalThoughts: 5
```

### Step 3: Revision (if needed)

```
thought: "Revising thought 2: [corrected analysis]"
isRevision: true
revisesThought: 2
thoughtNumber: 3
totalThoughts: 5
nextThoughtNeeded: true
```

### Step 4: Final Conclusion

```
thought: "Conclusion: [final answer based on analysis]"
thoughtNumber: 5
totalThoughts: 5
nextThoughtNeeded: false
```

## Best Practices

1. Start with a clear problem statement
2. Break down complex issues into manageable steps
3. Use isRevision when correcting or refining previous thoughts
4. Maintain thoughtNumber sequence for context tracking
5. Set nextThoughtNeeded to false when reaching conclusion
6. Update totalThoughts if analysis requires more steps than initially estimated

## Use Cases

Sequential Thinking enhances decision-making for:

- Complex multi-domain tasks
- Ambiguous requirements needing clarification
- Performance vs maintainability trade-offs
- Technology selection decisions
- Breaking changes under consideration
- Architecture decisions with wide impact
- Debugging complex interactions
- Refactoring with behavior preservation
