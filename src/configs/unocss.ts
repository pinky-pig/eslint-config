import type { Config } from '../types'

export const unocss = async (): Promise<Config[]> => {
  try {
    const { default: unocss } = await import('@unocss/eslint-plugin')
    return [
      {
        ...(unocss.configs.flat as any as Config),
        name: 'arvinn/unocss',
      },
    ]
  } catch (error) {
    // 如果导入失败或没有找到配置文件，返回空数组
    console.warn(
      '[@arvinn/eslint-config] UnoCSS plugin failed to load, skipping',
    )
    return []
  }
}
