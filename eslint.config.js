// ESLint flat config (ESLint 9+).
//
// Layers, in order: base JS rules -> TypeScript rules -> disable any rules that
// would fight Prettier (formatting is Prettier's job, not the linter's).
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Never lint build output or deps.
  { ignores: ["dist/**", "node_modules/**"] },

  // Recommended JavaScript + TypeScript rule sets.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Library source runs in the browser: declare those globals so no-undef and
  // friends don't flag window/document/fetch/etc.
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  // Test + tooling files run under Bun/Node.
  {
    files: ["test/**/*.ts", "*.config.js", "scripts/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Must come last so it can turn off stylistic rules that overlap with Prettier.
  prettier
);
