import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Git worktree directories:
    "worktree/**",
  ]),
  {
    rules: {
      // Allow 'any' type for now - can be improved incrementally
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow require() in scripts for migration scripts
      '@typescript-eslint/no-require-imports': 'off',
      // Allow setState in effects when properly controlled
      '@typescript-eslint/no-loop-func': 'warn',
      // Allow missing display name for simple components
      'react/display-name': 'off',
      // Relax parsing errors for complex components
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
]);

export default eslintConfig;
