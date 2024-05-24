// @ts-check
// import { arvinn } from './dist/index.js'

import { require } from 'tsx/cjs/api'
/** @type {typeof import('./src/index.ts')} */
const { arvinn } = require('./src/index.ts', import.meta.url)

export default arvinn(
  [
    {
      files: ['src/**/*.ts'],
      rules: {
        'perfectionist/sort-objects': 'error',
      },
    },
    {
      files: ['**/*.md/*'],
      rules: {
        'sort-imports': 'off',
      },
    },
  ],
  { vue: true },
)
