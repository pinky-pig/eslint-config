# 从零开始创建你的第一个 ESLint 规则

首先记录一下两个小坑

1. 每种文件需要设置格式化的工具
   即使 `settings.json`设置了`"editor.defaultFormatter": "esbenp.prettier-vscode"`，但这只是告诉编辑器没有别的格式化工具的时候，默认使用 prettier 进行格式化。
   并不是配置了 prettier ，文件就一定按照 prettier 来格式化了。
   比如 Vue 文件，默认使用了 Vue-official 格式化；JSON 文件默认使用「JSON 语言功能」格式化。
   我在这里浪费了一点时间，总以为是 prettier 和 eslint 的冲突，因为发生的现象是先被 prettier 格式化，又被另一种格式化，页面即使什么都没改，每次保存就是会闪动一下。
   其实就是更高级的格式化工具覆盖了自己配置的 prettier ，"罪魁祸首"就是这个 VSCode 配置的默认格式化工具。
   所以在每种类型文件，都需要「配置默认格式化工具」。
   比如：

```json
"[vue]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

2. prettier 要启用
   `settings.json`先设置启用`"prettier.enable": true` 。
   不然虽然功能生效了，prettierrc 中的属性但是右下角会提示 prettier 无法格式化。右键「使用...格式化文档」也没有 prettier 选项。

## 第一部分：前置知识 - ESLint 与 Prettier 的爱恨情仇

在开始之前，我们必须先厘清两个工具的职责：

- ESLint：负责监督
- Prettier：负责执行格式化

原来的 ESLint 是有更改的能力的，"既当运动员又当裁判"，但是现在v9版本抛弃了这一功能。(当然可以通过插件还继续使用，比如我之前就是一直使用 antfu 的eslint config。)
而 ESLint 和 prettier 属于不同部门。那他们有各自的一套标准，有相同的，有不同的。

所以我们要求同存异，使用插件`eslint-plugin-prettier`将 prettier 的规则嵌入到 eslint 中，毕竟话语权在"监督"的人手里，负责执行操作的总归还是低一级。
**`eslint-plugin-prettier` 就可以读取本地的 `prettierrc` 设置，将这个规则利用 eslint 提示出来，这是两者相同的点。**

两者不同的点，既然存在了矛盾，就看如何取舍了。我们这里自然更相信负责干活的人，"监督"的观点，对不对的不一定，但是干活的人更了解实际情况。
那我们这里就是不听 eslint 的了，让 prettier 继续执行他的。所以需要 `eslint-config-prettier`这个规则包将有两者有冲突的 eslint 规则都屏蔽掉，不要提示了。
使用 prettier 一路狂奔。

## 第二部分：创建第一个 ESLint 规则

[ESLint 官方文档](https://eslint.org/docs/latest/use/getting-started)

如何使用这里就不多说了，跟着官网文档或者网上资料走走就好了。
个人感觉就是，虽然 ESLint 是破坏性更新，但是 flat 的配置比之前好用多了，在同一个数组中，配置多个规则，后面的覆盖前面的，好用。
有什么自己的配置，直接往数组中添加就好了。

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

不过可以提的一点是，ESLint config 支持 .ts ，但是需要多一个包：
[官网 eslint.config.ts 说明](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)

```bash
# 需要多这个包，因为 node 现在还无法直接编译 ts ，之前我是使用 tsx 作为一个中介
pnpm add --save-dev jiti
```

### 直接站在别人的肩膀上

[sxzz 的 eslint config](https://github.com/sxzz/eslint-config)

这个项目就是很好的一个集成 ESLint 和 prettier 的配置，非常值得参考，我的 eslint 规则项目就是直接 fork 这个的。

[我的 eslint 规则项目](https://github.com/pinky-pig/eslint-config)

下面是基于我 Fork 的项目，进行分析。

分析这个项目：

- `package.json` 中安装的依赖都在 `pnpm-workspace.yaml` 中定义了版本。
- 核心文件是 `index.ts` ，导出了一个函数，这个函数返回就是 eslint 的某个 FlatConfigComposer 对象，可以直接生效的。FlatConfigComposer 的原型上有个 append 方法，可以往数组中添加配置。
- 使用的 eslint-config-inspector 插件开发调试，这个插件可以查看 eslint 的配置，非常方便。
- 有一个 typegen 脚本，可以生成类型，这个类型是使用插件根据 eslint 的配置生成的，在自己写 eslint.config.ts 的时候，可以有类型提示。
- 使用 tsdown 打包， bumpp 发布。

### 分析 src 核心代码实现

项目的核心逻辑全部位于 `src` 目录下，其结构设计清晰，职责分明。整个配置的调用链条是 `index.ts` -> `presets.ts` -> `configs/*.ts`。

- `index.ts`: **项目入口文件**。代码非常简洁，只做一件事：从 `presets.ts` 中导入核心的 `arvinn` 函数并将其导出。这是提供给用户的最顶层 API。

- `presets.ts`: **配置"编排"文件**。这是整个项目的"指挥官"。

  1.  它定义了多个预设(Presets)，如 `presetBasic`、`presetAll`，这些预设是不同规则集的组合，方便用户根据需求一键启用。
  2.  它实现了最核心的 `arvinn` 函数。这个函数接收用户的 `options` 参数，结合 `env.ts` 的环境自动检测结果(如 `hasVue`)，动态地、按需地将不同的配置模块组合起来。
  3.  它使用 `eslint-flat-config-utils` 包中的 `FlatConfigComposer` 来组装配置，这使得用户可以在预设的基础上，非常方便地追加或覆盖自己的规则。

- `configs/` (目录): **原子化配置模块**。这是所有具体规则的"仓库"。目录下的每一个 `.ts` 文件都代表一个独立的、原子化的功能模块，例如：

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
