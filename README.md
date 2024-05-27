# @arvinn/eslint-config [![npm](https://img.shields.io/npm/v/@arvinn/eslint-config.svg)](https://npmjs.com/package/@arvinn/eslint-config)

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3, Prettier.

Forked from [@sxzz/eslint-config](https://github.com/sxzz/eslint-config)

# Install

```bash
pnpm install -D eslint
pnpm install -D @arvinn/eslint-config
pnpm install -D prettier
pnpm install -D @arvinn/prettier-config
# or
pnpm install -D eslint prettier @arvinn/eslint-config @arvinn/prettier-config
```

```bash
touch eslint.config.js
```

```js
// eslint.config.js
import { arvinn } from "@arvinn/eslint-config";
export default arvinn();
```

```json
// package.json
{
  "scripts": {
    "lint": "eslint .",
    "prettier": "prettier --write ."
  },
  "prettier": "@arvinn/prettier-config"
}
```

**close project floder && reopen project**

```bash
npx prettier 'src/**/*.ts' --write
# or
prettier --write \"**/*.{js,jsx,ts,tsx,css,md,json,html,vue,scss,sass,less}\"
# or 
prettier --write .
```

# Other

```js
// eslint.config.js
// https://eslint.org/docs/latest/use/configure/migration-guide
import { arvinn } from "@arvinn/eslint-config";
import js from "@eslint/js";
import myConfig from "eslint-config-my-config";
import customConfig from "./custom-config.js";

export default arvinn(
  [
    js.configs.recommended,
    customConfig,
    myConfig,
    {
      // 全部
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ["src/**/*.ts"],
      rules: {
        "perfectionist/sort-objects": "error",
      },
    },
    {
      // 自定义
      ...customTestConfig,
      files: ["src/**/*.js"],
      // 单种类型插件
      plugins: {
        jsdoc
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ["**/*.md/*"],
      rules: {
        "sort-imports": "off",
      },
    },
    {
      ignores: [
        "!node_modules/",           // unignore `node_modules/` directory
        "node_modules/*",           // ignore its content
        "!node_modules/mylibrary/"  // unignore `node_modules/mylibrary` directory
      ]
    }
  ],
  {
    vue: true,
    prettier: {
      singleQuote: true,
      semi: false,
    },
  },
);
```

# Error
1. if there have an error like this:
```
import { arvinn } from "@arvinn/eslint-config";
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

just add `type: "module"` to `package.json`

```json
{
  "type": "module"
}
```

2. if there have an error like this:
```
[Failed to load PostCSS config: Failed to load PostCSS config (searchPath: /Users/wangwenbo/Documents/wangwenbo/Mine/electron-demo/src): [ReferenceError] module is not defined in ES module scope
[0] This file is being treated as an ES module because it has a '.js' file extension 
```

coz `postcss.config.js` file contains `module.exports = {`
  
`}` 

like this: 

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

and `package.json` has `type: "module"`

so just replace to 

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. if there have an error like this:
```
ReferenceError: exports is not defined in ES module scope
[1] This file is being treated as an ES module because it has a '.js' file extension and '/Users/wangwenbo/Documents/wangwenbo/Mine/electron-demo/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
```

just rename to `.cjs`
