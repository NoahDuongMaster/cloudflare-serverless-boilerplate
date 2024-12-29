import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import typescriptEslint, { parser } from 'typescript-eslint';

export default [
  ...typescriptEslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['!generated/*'],
    languageOptions: {
      parser: parser,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'error',
      'no-undef': 'off',
      'object-curly-spacing': 'off',
      'require-jsdoc': 'off',
      'max-len': 'off',
      indent: 'off',
      'no-useless-catch': 'off',
      camelcase: 'off',
      'new-cap': 'off',
      'operator-linebreak': 'off',
      quotes: 'off',
      'comma-spacing': 'off',
    },
  },
];
