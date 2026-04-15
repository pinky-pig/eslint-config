import { pluginTailwindcss } from '../plugins'
import type { Config } from '../types'

export const tailwindcss = (): Config[] => {
  const recommended = pluginTailwindcss.configs[
    'flat/recommended'
  ] as unknown as Config[]

  return recommended.map((config, index) => {
    const rawName = String(config.name || `config-${index}`)
      .replace(/^tailwindcss[:/]/, '')
      .replaceAll(':', '/')

    return {
      ...config,
      name: `arvinn/tailwindcss/${rawName}`,
      rules: config.rules
        ? {
            ...config.rules,
            // Keep sorting owned by Prettier side (if consumer enables prettier-plugin-tailwindcss).
            'tailwindcss/classnames-order': 'off',
          }
        : config.rules,
    }
  })
}
