import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Next 16 removed `next lint`; this flat config is the ESLint-CLI setup the
// official docs prescribe (core-web-vitals + typescript). ESLint is pinned to
// 9.x and typescript to 5.9.x — eslint@10 / typescript@7 aren't yet supported
// by eslint-plugin-react / typescript-eslint (eslint-config-next's deps).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
    ignores: [
      "src/components/ui/**", // vendored shadcn primitives
      "src/app/global-error.tsx", // runs without the stylesheet — inline literals are correct
    ],
    rules: {
      // Static a11y linting. eslint-config-next already registers the
      // jsx-a11y plugin but enables none of its rules — turn on the
      // recommended set here (as warnings).
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([k, v]) => [
          k,
          Array.isArray(v) ? ["warn", ...v.slice(1)] : "warn",
        ]),
      ),
      // `label-has-for` is deprecated (nesting alone is valid a11y) — the
      // recommended set also ships `label-has-associated-control`, which is
      // the correct check and passes for our nested <label><input/></label>.
      "jsx-a11y/label-has-for": "off",
      // Command-palette / modal search inputs conventionally autofocus.
      "jsx-a11y/no-autofocus": "off",

      // Pre-existing debt (mostly in src/ai/flows) — warnings so lint passes;
      // tighten to "error" as they're paid down.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "react-hooks/static-components": "warn",
      // The SSR-safe mounted guard (`useEffect(() => setMounted(true), [])`)
      // deliberately sets state once on mount — that's the documented pattern.
      "react-hooks/set-state-in-effect": "off",

      // Design-system guard: colour must come from a token utility
      // (bg-cta / text-muted-foreground …), never a raw literal. globals.css
      // owns every hex. Matches #rgb / #rrggbb / #rrggbbaa but NOT #rgba —
      // that 4-hex alt catches SVG id refs like url(#fade).
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
