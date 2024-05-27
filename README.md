# @arvinn/eslint-config [![npm](https://img.shields.io/npm/v/@arvinn/eslint-config.svg)](https://npmjs.com/package/@arvinn/eslint-config)

Flat ESLint config for JavaScript, TypeScript, Vue 2, Vue 3, Prettier.

Forked from [@sxzz/eslint-config](https://github.com/sxzz/eslint-config)

# Install

```bash
pnpm install -D eslint
pnpm install -D @arvinn/eslint-config

pnpm install -D prettier
pnpm install -D @arvinn/prettier-config
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

close project floder && reopen project

```bash
npx prettier 'src/**/*.ts' --write
# or
npx prettier 'src/**/*.{js,ts,mjs,cjs,json}' --write
```

# Other

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
