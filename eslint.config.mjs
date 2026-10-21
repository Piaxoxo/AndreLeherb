import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // Plain <img> on purpose: small, already-optimised assets, no image loader needed.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // react-three-fiber animates by mutating three.js objects inside useFrame;
    // the React Compiler's immutability heuristics do not apply there.
    files: ["src/components/scene/**/*.tsx", "src/components/game/**/*.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
]);

export default eslintConfig;
