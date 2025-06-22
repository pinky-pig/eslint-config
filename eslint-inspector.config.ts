import { arvinn } from './src/index.ts'

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
      'perfectionist/sort-named-imports': 'off',
    },
  },
)
