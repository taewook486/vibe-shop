# Error Handling

Comprehensive error recovery and troubleshooting protocols.

## Error Recovery

### Agent Execution Errors

**Symptom**: Subagent fails or returns errors

**Recovery**:
1. Use the **expert-debug** subagent to troubleshoot issues
2. Analyze error messages and stack traces
3. Identify root cause (missing dependencies, incorrect configuration, etc.)
4. Implement fix and retry operation
5. If persistent, escalate to appropriate expert agent

### Token Limit Errors

**Symptom**: Context window exceeded

**Recovery**:
1. Execute `/clear` to refresh context
2. Guide user to resume work from last checkpoint
3. Use progressive disclosure to reduce context load
4. Break task into smaller phases

### Permission Errors

**Symptom**: File access denied or permission denied

**Recovery**:
1. Review settings.json and file permissions manually
2. Check file system permissions
3. Verify agent tool permissions in configuration
4. Ensure proper authentication for external services

### Integration Errors

**Symptom**: MCP servers, external APIs, or integrations fail

**Recovery**:
1. Use the **expert-devops** subagent to resolve issues
2. Check MCP server configuration
3. Verify external service availability
4. Review API keys and authentication tokens
5. Check network connectivity

### MoAI-ADK Errors

**Symptom**: Workflow failures, agent issues, command problems

**Recovery**:
1. Suggest user to run `/moai:9-feedback` to report the issue
2. Document error conditions for troubleshooting
3. Check for known issues in documentation
4. Attempt workaround if available

## Resumable Agents

Resume interrupted agent work using agentId:

**Usage Examples:**
- "Resume agent abc123 and continue the security analysis"
- "Continue with the frontend development using the existing context"

**Implementation:**
- Each sub-agent execution gets a unique agentId
- State stored in `agent-{agentId}.jsonl` format
- Context preserved across interruptions
- Supports checkpoint/resume workflow

## Error Prevention

### Pre-Execution Checks

Before executing operations:
- [ ] Verify all required tools are available
- [ ] Check file permissions for read/write operations
- [ ] Ensure sufficient disk space
- [ ] Validate configuration files
- [ ] Confirm external service availability

### Retry Logic

**Maximum Retries**: Limit operations to 3 attempts per operation

**Failure Pattern Detection**:
- Detect repeated failures on same file or operation
- Identify common error patterns
- Implement fallback strategies

**Fallback Chain**:
1. Use Edit tool first (cross-platform compatible)
2. Try platform-specific alternatives if needed
3. Use Bash commands as last resort
4. Request user guidance after 3 failed attempts

### Loop Prevention

**Problem**: Agents may enter infinite retry loops when repeatedly failing at the same operation (e.g., git checkout → failed edit → retry)

**Solution**: Implement retry limits and failure pattern detection

**Anti-Pattern to Avoid**: Retry loops that restore state and attempt the same operation without changing the approach

## Platform Compatibility

### macOS vs Linux Command Differences

Platform differences exist between GNU tools (Linux) and BSD tools (macOS).

**Example**: sed inline editing
- Linux: `sed -i`
- macOS: `sed -i ''`

**Best Practice**: Always prefer Edit tool over sed/awk for file modifications. The Edit tool is cross-platform and avoids platform-specific syntax issues.

**When Bash Commands are Unavoidable**:
1. Detect the platform
2. Use appropriate syntax for each operating system
3. Provide platform-specific alternatives
4. Document platform-specific requirements

## Error Logging

### What to Log

- Error messages and stack traces
- Agent IDs and execution context
- Tool invocations and parameters
- Timestamp and sequence of events
- User actions and responses

### Log Locations

- Agent execution: `.omc/logs/agent-{agentId}.jsonl`
- System errors: `.omc/logs/system-errors.log`
- Workflow errors: `.omc/logs/workflow-errors.log`

### Log Analysis

Regular review of error logs to:
- Identify recurring issues
- Improve error handling
- Enhance documentation
- Fix underlying problems

## User Communication

### Error Message Format

```
**Error**: [Clear, concise error description]

**What happened**: [Explanation of the error]
**Impact**: [How this affects the current task]
**Next steps**: [Recommended action]

**Technical details**: [Error type, stack trace, etc.]
```

### When to Escalate

- After 3 failed recovery attempts
- When error requires user intervention
- When error affects system stability
- When error requires external service changes
- When root cause cannot be determined
