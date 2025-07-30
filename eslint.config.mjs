import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended'
  ),

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,

        },
      },
    },
    rules: {
      // Reglas estrictas personalizadas
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off', // Next.js no requiere React en scope
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'off',
      'prettier/prettier': 'warn',
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

       // Reglas de Nomenclatura
      '@typescript-eslint/naming-convention': [
        'warn',
        // Forzar que las variables, funciones y propiedades usen camelCase
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Forzar que las variables globales (como constantes) usen UPPER_CASE o camelCase
        {
          selector: 'variable',
          modifiers: ['global'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        // Forzar que los componentes de React usen PascalCase
        {
          selector: 'function',
          modifiers: ['exported'],
          format: ['PascalCase', 'camelCase'],
        },
        // Forzar que los tipos, interfaces y enums usen PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
    },
  },
];