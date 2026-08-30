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
  ]),
  {
    // Design-system guard: colour must come from a token utility
    // (bg-cta / text-muted-foreground / border-border …), never a raw literal.
    // globals.css owns every hex; components reference tokens only.
    files: ["src/**/*.tsx", "src/**/*.ts"],
    ignores: ["src/components/ui/**"], // vendored shadcn primitives
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b/]",
          message:
            "Raw colour literal — use a design-token utility (bg-*, text-*, border-*) or var(--token). Palette lives in src/app/globals.css.",
        },
        {
          selector:
            "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b/]",
          message:
            "Raw colour literal in a template string — use a design-token utility or var(--token).",
        },
      ],
    },
  },
]);

export default eslintConfig;
