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
    "instituto-platform/**",
    "instituto-incentive-site/**",
    "materiais/**",
    ".tmp/**",
    "brand-manual-temp/**",
    "git-meta-test/**",
    "git-upload-meta/**",
  ]),
]);

export default eslintConfig;
