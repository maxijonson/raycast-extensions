import { defineConfig } from "eslint/config";
import raycastConfig from "@raycast/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  ...raycastConfig,
  reactHooks.configs["recommended-latest"],
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": "warn",
    },
  },
]);
