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
