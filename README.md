# 🚀 从零开始创建你的第一个 ESLint 规则

🛠️ 最终实现：

- 按需组合配置，单个配置文件控制单种文件类型。最后导出的工厂函数支持传入配置项。
- 用 typegen 提升 DX，自定义配置的时候有类型提示。
- 学会用 eslint-config-inspector 调试，可以查看 eslint 的配置。
- tsdown 打包，bumpp 发布，简化发布流程。

## 🐛 首先记录一下两个小坑

### ⚠️ 1. 每种文件需要设置格式化的工具

即使 `settings.json` 设置了 `"editor.defaultFormatter": "esbenp.prettier-vscode"`，但这只是告诉编辑器：**没有别的格式化工具时才使用 Prettier**。

并不代表配置了 Prettier，所有文件就一定用它来格式化。

🔧 举例：

- Vue 文件：默认使用 Vue-official 格式化
- JSON 文件：默认使用「JSON 语言功能」格式化

我在这里浪费了一点时间，因为现象是：**保存文件时页面闪动一下，但内容并没改变**， 所以我总以为是 Prettier 和 ESLint 冲突，其实并不是。

其实是更高级的格式化工具覆盖了你配置的 Prettier。
"罪魁祸首"：VSCode 的默认格式化工具。

✅ 解决方案：**为每种文件配置默认格式化工具**

例如：

```json
"[vue]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 🚫 2. Prettier 要启用

在 settings.json 中设置 "prettier.enable": true。

否则：

功能虽然生效了，但右下角提示 Prettier 无法格式化

右键菜单中的「使用...格式化文档」也没有 Prettier 选项

## 📚 第一部分：前置知识 - ESLint 与 Prettier 的爱恨情仇

在开始之前，我们必须先厘清两个工具的职责：

- 🕵️‍♂️ ESLint：负责监督
- 🧹 Prettier：负责执行格式化

**所以我们项目中 ESLint 和 Prettier 必不可少，而这里发布的 ESLint 配置库，虽然也有 Prettier 的之类的配置，但并不能格式化文件，只是为了在 ESLint 中使用 Prettier 的规则进行提示。**

原本 ESLint 有格式化功能（既当裁判又当运动员），但 v9 开始取消了这个特性。
（当然仍可通过如 antfu/eslint-config 继续使用这种风格，我之前就是）

由于 ESLint 和 prettier 属于不同部门。那他们有各自的一套标准，有相同的，有不同的。

所以我们要求同存异，使用插件`eslint-plugin-prettier`将 prettier 的规则嵌入到 eslint 中，毕竟话语权在"监督"的人手里，负责执行操作的总归还是低一级。
**`eslint-plugin-prettier` 就可以读取本地的 `prettierrc` 设置，将这个规则利用 eslint 提示出来，这是两者相同的点。**

两者不同的点，既然存在了矛盾，就看如何取舍了。我们这里自然更相信负责干活的人，"监督"的观点，对不对的不一定，但是干活的人更了解实际情况。
那我们这里就是不听 eslint 的了，让 prettier 继续执行他的。所以需要 `eslint-config-prettier`这个规则包将有两者有冲突的 eslint 规则都屏蔽掉，不要提示了。
使用 prettier 一路狂奔。

💡 合理做法：

使用 eslint-plugin-prettier 👉 将 Prettier 的规则嵌入 ESLint 中，让 ESLint 来报告格式问题
使用 eslint-config-prettier 👉 屏蔽与 Prettier 冲突的 ESLint 规则，让 Prettier 保持话语权

🎯 我们的策略是：执行由 Prettier 主导，监督由 ESLint 提供提示，专注格式化本身。

## ✨ 第二部分：创建你的第一个 ESLint 规则

参考 [ESLint 官方文档](https://eslint.org/docs/latest/use/getting-started)

Flat Config 比旧版好用很多，多个配置项放数组里，后面的覆盖前面的。

🔧 示例：

```js
// eslint.config.js
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    rules: {
      semi: 'error',
      'prefer-const': 'error',
    },
  },
])
```

🔧 支持 .ts 配置，但需额外依赖：

[官网 eslint.config.ts 说明](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)

```bash
pnpm add --save-dev jiti
```

## 🧠 直接站在巨人的肩膀上

🧰 推荐参考：

[sxzz 的 eslint config](https://github.com/sxzz/eslint-config)

[我的 eslint 规则项目](https://github.com/pinky-pig/eslint-config)

下面是基于我 Fork 的项目，进行分析。

分析这个项目：

- 使用的 eslint-config-inspector 插件开发调试，这个插件可以查看 eslint 的配置，非常方便。
- 使用 tsdown 打包， bumpp 发布。
- 有一个 typegen 脚本，可以生成类型，这个类型是使用插件根据 eslint 的配置生成的，在自己写 eslint.config.ts 的时候，可以有类型提示。
- `package.json`: 项目中安装的依赖都在 `pnpm-workspace.yaml` 中定义了版本。
- `index.ts` : 核心文件，导出了一个函数，这个函数返回就是 eslint 的某个 FlatConfigComposer 对象，可以直接生效的。FlatConfigComposer 的原型上有个 append 方法，可以往数组中添加配置。
- 📁 `configs/` (目录): **原子化配置模块**。这是所有具体规则的"仓库"。目录下的每一个 `.ts` 文件都代表一个独立的、原子化的功能模块，例如：
  - `javascript.ts`: 配置 JavaScript 的基础规则。
  - `typescript.ts`: 配置 TypeScript 的相关规则。
  - `vue.ts`: 配置 Vue 相关的规则。
  - `prettier.ts`: 整合 Prettier 的规则。
  - ...等等。
    每个文件都导出一个函数，该函数返回一个标准的 ESLint flat config 配置数组。这种设计使得每一项配置(如 Vue 支持、Prettier 支持)都是可插拔的，极大地提高了可维护性和扩展性。
- `plugins.ts`: **插件中心**。这个文件将项目中用到的所有 ESLint 插件、第三方配置、解析器等都统一导入，然后再导出。`configs/` 目录中的所有模块都从这里引入插件。这样做的好处是让依赖关系一目了然，管理起来非常方便。
- `env.ts`: **环境探测器**。提供 `hasVue`、`hasUnocss` 等工具函数，通过 `local-pkg` 包检查用户项目中是否安装了某个依赖(如 `vue`)，从而实现配置的自动启用。
- `globs.ts`: **全局文件匹配模式**。统一定义了项目中需要用到的文件匹配模式(Globs)，例如 `GLOBS_JS`、`GLOBS_VUE` 等，方便在 `configs/` 的不同模块中复用，保持一致性。
- `types.ts` 和 `typegen.ts`: **类型定义文件**。`typegen.ts` 是通过脚本根据项目配置自动生成的，它包含了所有规则的类型信息。`types.ts` 则引用它并导出，这样当用户在自己的 `eslint.config.ts` 中使用这个包时，就能获得完美的类型提示和自动补全，提升开发体验。

## 📦 第三部分：打包与发布

🏗️ 打包工具 - tsdown
在 package.json 中配置：

```json
"scripts": {
  "build": "pnpm run build:typegen && tsdown",
  "build:typegen": "tsx scripts/typegen.ts"
}
```

先生成类型（typegen）

再使用 tsdown 打包成 dist + 生成 .d.ts

🚀 发布工具 - bumpp

```json
"scripts": {
  "release": "bumpp && pnpm publish",
  "prepublishOnly": "pnpm run build"
}
```

自动 commit + tag + push

pnpm publish: 发布

🎉 至此，就简简单单创建了一个自己的 ESLint 配置库！
