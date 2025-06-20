import { arvinn } from './src/index'

export default arvinn({
  vue: true,
  pnpm: true,
  unocss: false,
}).append(
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['**/*.md/*'],
    rules: {
      // 'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
    },
  },
)
