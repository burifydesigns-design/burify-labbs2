import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts}"],
    // Violations that already existed when linting was repaired. They stay visible as warnings so CI
    // can block any new kind of problem. Fix them gradually, then restore each rule to "error".
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    ignores: ["**/*.cjs", ".next/**", "node_modules/**", "next-env.d.ts", "burify-labbs/**", ".vercel/**", "scripts/**"],
  },
];

export default eslintConfig;
