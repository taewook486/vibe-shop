# Performance Optimization for Exploration Tools

Guidelines for efficient codebase exploration and analysis.

## Anti-Bottleneck Principles

When using Explore agent or direct exploration tools (Grep, Glob, Read), apply these optimizations to prevent performance bottlenecks.

### Principle 1: AST-Grep Priority

- Use structural search (ast-grep) before text-based search (Grep)
- AST-Grep understands code syntax and eliminates false positives
- Load moai-tool-ast-grep skill for complex pattern matching
- Example: `sg -p 'class $X extends Service' --lang python` is faster than `grep -r "class.*extends.*Service"`

### Principle 2: Search Scope Limitation

- Always use `path` parameter to limit search scope
- Avoid searching entire codebase unnecessarily
- Example: `Grep(pattern="async def", path="src/moai_adk/core/")` instead of `Grep(pattern="async def")`

### Principle 3: File Pattern Specificity

- Use specific Glob patterns instead of wildcards
- Example: `Glob(pattern="src/moai_adk/core/*.py")` instead of `Glob(pattern="src/**/*.py")`
- Reduces files scanned by 50-80%

### Principle 4: Parallel Processing

- Execute independent searches in parallel (single message, multiple tool calls)
- Example: Search for imports in Python files AND search for types in TypeScript files simultaneously
- Maximum 5 parallel searches to prevent context fragmentation

## Thoroughness-Based Tool Selection

When invoking Explore agent or using exploration tools directly:

### quick (target: 10 seconds)

- Use Glob for file discovery
- Use Grep with specific path parameter only
- Skip Read operations unless necessary
- Example: `Glob("src/moai_adk/core/*.py") + Grep("async def", path="src/moai_adk/core/")`

### medium (target: 30 seconds)

- Use Glob + Grep with path limitation
- Use Read selectively for key files only
- Load moai-tool-ast-grep for structural search if needed
- Example: `Glob("src/**/*.py") + Grep("class Service") + Read("src/moai_adk/core/service.py")`

### very thorough (target: 2 minutes)

- Use all tools including ast-grep
- Explore full codebase with structural analysis
- Use parallel searches across multiple domains
- Example: `Glob + Grep + ast-grep + parallel Read of key files`

## When to Delegate to Explore Agent

**Use the Explore agent when:**
- Read-only codebase exploration is needed
- Multiple search patterns need to be tested
- Code structure analysis is required
- Performance bottleneck analysis is needed

**Direct tool usage is acceptable when:**
- Single file needs to be read
- Specific pattern search in known location
- Quick verification task
