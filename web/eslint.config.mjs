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
      // Pre-existing debt (mostly in src/ai/flows) — visible as warnings so
      // `next lint` still passes; tighten to "error" as they're paid down.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "react-hooks/static-components": "warn",
      // The SSR-safe mounted guard (`useEffect(() => setMounted(true), [])`)
      // deliberately sets state once on mount — that's the documented pattern.
      "react-hooks/set-state-in-effect": "off",

      // Match #rgb / #rrggbb / #rrggbbaa but NOT #rgba (4 hex) — that alt
      // catches SVG id refs like url(#fade). Only flags things that read as
      // real colour literals.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?|[0-9a-fA-F]{3})(?![0-9a-fA-F])/]",
          message:
            "Raw colour literal — use a design-token utility (bg-*, text-*, border-*) or var(--token). Palette lives in src/app/globals.css.",
        },
        {
          selector:
            "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?|[0-9a-fA-F]{3})(?![0-9a-fA-F])/]",
          message:
            "Raw colour literal in a template string — use a design-token utility or var(--token).",
        },
      ],
    },
  },
]);

export default eslintConfig;
