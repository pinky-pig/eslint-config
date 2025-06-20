import { GLOB_EXCLUDE } from '../globs'
import { pluginIgnore } from '../plugins'
import type { Config } from '../types'

export const ignores = (): Config[] => [
  {
    ignores: GLOB_EXCLUDE,
    name: 'arvinn/global-ignores',
  },
  {
    ...pluginIgnore({ strict: false }),
    name: 'arvinn/gitignore',
  },
]
