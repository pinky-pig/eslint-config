# @arvinn/eslint-config [![npm](https://img.shields.io/npm/v/@arvinn/eslint-config.svg)](https://npmjs.com/package/@arvinn/eslint-config)

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3, Prettier.

Forked from [@sxzz/eslint-config](https://github.com/sxzz/eslint-config)

# Usage

```js
// eslint.config.js
import { arvinn } from "@arvinn/eslint-config";

export default arvinn(
  [
    {
      files: ["src/**/*.ts"],
      rules: {
        "perfectionist/sort-objects": "error",
      },
    },
    {
      files: ["**/*.md/*"],
      rules: {
        "sort-imports": "off",
      },
    },
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
