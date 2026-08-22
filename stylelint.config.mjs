const config = {
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss", "stylelint-config-tailwindcss"],
  ignoreFiles: ["**/.next/**", "**/build/**", "**/dist/**", "**/node_modules/**"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["config", "custom-variant", "layer", "plugin", "source", "tailwind", "theme", "utility", "variant"]
      }
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["config", "custom-variant", "layer", "plugin", "source", "tailwind", "theme", "utility", "variant"]
      }
    ]
  }
};

export default config;

