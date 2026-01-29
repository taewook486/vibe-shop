# Agent Catalog

Complete reference for all available agents in the MoAI system.

## Manager Agents (7)

- **manager-spec**: SPEC document creation, EARS format, requirements analysis
- **manager-ddd**: Domain-driven development, ANALYZE-PRESERVE-IMPROVE cycle, behavior preservation
- **manager-docs**: Documentation generation, Nextra integration, markdown optimization
- **manager-quality**: Quality gates, TRUST 5 validation, code review
- **manager-project**: Project configuration, structure management, initialization
- **manager-strategy**: System design, architecture decisions, trade-off analysis
- **manager-git**: Git operations, branching strategy, merge management

## Expert Agents (9)

- **expert-backend**: API development, server-side logic, database integration
- **expert-frontend**: React components, UI implementation, client-side code
- **expert-stitch**: UI/UX design specialist using Google Stitch MCP for AI-powered design generation
- **expert-security**: Security analysis, vulnerability assessment, OWASP compliance
- **expert-devops**: CI/CD pipelines, infrastructure, deployment automation
- **expert-performance**: Performance optimization, profiling, bottleneck analysis
- **expert-debug**: Debugging, error analysis, troubleshooting
- **expert-testing**: Test creation, test strategy, coverage improvement
- **expert-refactoring**: Code refactoring, architecture improvement, cleanup

## Builder Agents (4)

- **builder-agent**: Create new agent definitions
- **builder-command**: Create new slash commands
- **builder-skill**: Create new skills
- **builder-plugin**: Create new plugins

## Agent Selection Decision Tree

1. Read-only codebase exploration? Use the **Explore** subagent
2. External documentation or API research needed? Use **WebSearch, WebFetch, Context7 MCP** tools
3. Domain expertise needed? Use the **expert-[domain]** subagent
4. Workflow coordination needed? Use the **manager-[workflow]** subagent
5. Complex multi-step tasks? Use the **manager-strategy** subagent

## Usage Patterns

### For SPEC Execution:

- **Phase 1**: Use the **manager-spec** subagent to understand requirements
- **Phase 2**: Use the **manager-strategy** subagent to create system design
- **Phase 3**: Use the **expert-backend** subagent to implement core features
- **Phase 4**: Use the **expert-frontend** subagent to create user interface
- **Phase 5**: Use the **manager-quality** subagent to ensure quality standards
- **Phase 6**: Use the **manager-docs** subagent to create documentation

### For DDD Development:

Use **manager-ddd** for:
- Creating new functionality with behavior preservation focus
- Refactoring and improving existing code structure
- Technical debt reduction with test validation
- Incremental feature development with characterization tests

### MoAI Command Flow:

- `/moai:1-plan "description"` → Use the **manager-spec** subagent
- `/moai:2-run SPEC-001` → Use the **manager-ddd** subagent (ANALYZE-PRESERVE-IMPROVE)
- `/moai:3-sync SPEC-001` → Use the **manager-docs** subagent
