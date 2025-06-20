import { pluginPrettier, pluginPrettierRecommended } from '../plugins'
import type { Config } from '../types'

const rules = { ...pluginPrettierRecommended.rules }
delete rules['vue/html-self-closing']

export const prettier = (): Config[] => [
  {
    name: 'arvinn/prettier',
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...rules,
      'prettier/prettier': 'error',
    },
  },
]
