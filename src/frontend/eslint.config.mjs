import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "test-arweave.js", // Plain JS test script, not part of TypeScript build
    ],
  },
  {
    rules: {
      // Suppress performance warnings for MVP - can optimize later
      "@next/next/no-img-element": "off",
      // Allow unused variables in destructuring (common pattern for ignoring values)
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_"
      }],
      // Downgrade 'any' type from error to warning for Epic 8/9 files
      // Epic 2 is clean - remaining 'any' usage is in Epic 8/9 (staking, loyalty)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
