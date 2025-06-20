// @ts-check

/**
 * @type {import('prettier').Config}
 */
module.exports = {
  // 是否在语句末尾添加分号
  semi: false,

  // 使用单引号替代双引号
  singleQuote: true,

  // 在多行逗号分隔的结构中尾部加逗号，比如数组或对象最后一个元素后面也加逗号
  trailingComma: 'all',

  // 针对不同文件做单独的配置覆盖
  overrides: [
    {
      // 这些文件或目录下的文件会启用 requirePragma，即只有包含特定注释的文件才会格式化
      files: [
        '**/node_modules/**',
        '**/dist/**',
        '**/output/**',
        '**/coverage/**',
        '**/temp/**',
        '**/.vitepress/cache/**',
        '**/.nuxt/**',
        '**/.vercel/**',
        '**/.changeset/**',
        '**/.idea/**',
        '**/.output/**',
        '**/.vite-inspect/**',

        '**/CHANGELOG*.md',
        '**/*.min.*',
        '**/LICENSE*',
        '**/__snapshots__',
        '**/auto-import?(s).d.ts',
        '**/components.d.ts',
        '**/typed-router.d.ts',
        '**/pnpm-lock.yaml',
      ],
      options: {
        // 只有带有格式化指令的文件才会被 prettier 格式化，比如：
        // // @prettier
        // 或者
        // /**
        //  * @format
        //  */
        requirePragma: true,
      },
    },
    {
      // 针对 jsr.json 文件，使用 json-stringify 解析器进行格式化
      files: ['**/jsr.json'],
      options: {
        parser: 'json-stringify',
      },
    },
    {
      files: ['**/*.vue'],
      options: {
        singleAttributePerLine: true,
      },
    },
  ],
}
