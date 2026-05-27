import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier/flat";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "build/**",
      "out/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  prettierConfig,
  {
    rules: {
      "react-hooks/exhaustive-deps": 1,
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/use-memo": "off",
    },
  },
];

export default eslintConfig;
