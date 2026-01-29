# Quality Gates

Comprehensive quality validation framework for MoAI development.

## HARD Rules Checklist

- [ ] All implementation tasks delegated to agents when specialized expertise is needed
- [ ] User responses in conversation_language
- [ ] Independent operations executed in parallel
- [ ] XML tags never shown to users
- [ ] URLs verified before inclusion (WebSearch)
- [ ] Source attribution when WebSearch used

## SOFT Rules Checklist

- [ ] Appropriate agent selected for task
- [ ] Minimal context passed to agents
- [ ] Results integrated coherently
- [ ] Agent delegation for complex operations (Type B commands)

## Violation Detection

The following actions constitute violations:

- Alfred responds to complex implementation requests without considering agent delegation
- Alfred skips quality validation for critical changes
- Alfred ignores user's conversation_language preference

**Enforcement**: When specialized expertise is needed, Alfred SHOULD invoke corresponding agent for optimal results.

## LSP Quality Gates

MoAI-ADK implements LSP-based quality gates for automated code quality validation.

### Phase-Specific Thresholds

**plan**:
- Capture LSP baseline at phase start

**run**:
- Zero errors, zero type errors, zero lint errors required
- Regression from baseline not allowed

**sync**:
- Zero errors, max 10 warnings, clean LSP required before sync/PR

### LSP State Tracking

- **Capture points**: phase_start, post_transformation, pre_sync
- **Baseline comparison**: phase_start as baseline
- **Regression threshold**: Any error increase is regression
- **Logging**: State changes, regression detection, completion markers tracked

### Configuration

```yaml
constitution:
  development_mode: ddd  # Domain-Driven Development

  # TRUST 5 quality framework
  enforce_quality: true
  test_coverage_target: 85  # 85% coverage target

  # DDD settings
  ddd_settings:
    require_existing_tests: true
    characterization_tests: true
    behavior_snapshots: true
    max_transformation_size: small

  # Test quality criteria
  test_quality:
    specification_based: true
    meaningful_assertions: true
    avoid_implementation_coupling: true
    mutation_testing_enabled: false

  # LSP quality gates
  lsp_quality_gates:
    enabled: true
    plan:
      require_baseline: true
    run:
      max_errors: 0
      max_type_errors: 0
      max_lint_errors: 0
      allow_regression: false
    sync:
      max_errors: 0
      max_warnings: 10
      require_clean_lsp: true
    cache_ttl_seconds: 5
    timeout_seconds: 3
```

### LSP Integration with TRUST 5

**Tested**:
- unit_tests_pass
- lsp_type_errors == 0
- lsp_errors == 0

**Readable**:
- naming_conventions_followed
- lsp_lint_errors == 0

**Understandable**:
- documentation_complete
- code_complexity_acceptable
- lsp_warnings < threshold

**Secured**:
- security_scan_pass
- lsp_security_warnings == 0

**Trackable**:
- logs_structured
- lsp_diagnostic_history_tracked

### Regression Detection

- **error_increase_threshold**: 0 (Any error increase is regression)
- **warning_increase_threshold**: 10 (Allow 10% warning increase)
- **type_error_increase_threshold**: 0 (Type error regressions not allowed)

## TRUST 5 Framework

**Tested**: 85%+ coverage, characterization tests for existing code

**Readable**: Clear naming, English comments

**Unified**: Consistent style, ruff/black formatting

**Secured**: OWASP compliance, input validation

**Trackable**: Conventional commits, issue references

## Implementation

Quality gate implementation: `.claude/hooks/moai/quality_gate_with_lsp.py` (289 lines, Ralph-style autonomous workflow)
