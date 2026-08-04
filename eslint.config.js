const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],

    rules: {
      // Firebase listeners reset local state when the user or lesson changes
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
