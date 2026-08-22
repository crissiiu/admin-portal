import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", "build/**", ".next/**", "node_modules/**"]
  }
];

