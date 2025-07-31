import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Configuraciones base que queremos extender
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ),

  // 2. Reglas generales que se aplican a todos los archivos
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Desactivar la regla de comillas de ESLint para evitar conflictos con Prettier
      quotes: "off",
      // Reglas estrictas personalizadas
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/react-in-jsx-scope": "off", // Next.js no requiere React en scope
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/anchor-is-valid": "off",
      "prettier/prettier": "warn",
      "no-console": "warn",
      "no-unused-vars": "off", // Siempre desactivar la regla base para usar la de TypeScript
    },
  },

  // 3. Reglas específicas para TypeScript que ANULARÁN las anteriores si hay conflicto
  // Al estar al final, estas reglas tienen la máxima prioridad para los archivos .ts y .tsx
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "import", format: null },
        { selector: "variable", types: ["function"], format: ["PascalCase", "camelCase"] },
        { selector: "variable", modifiers: ["global"], format: ["camelCase", "UPPER_CASE"] },
        { selector: "function", modifiers: ["exported"], format: ["PascalCase", "camelCase"] },
        { selector: "typeLike", format: ["PascalCase"] },
      ],
    },
  },
];

export default eslintConfig;
