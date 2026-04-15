/* eslint-disable node/prefer-global/process */
import { defineConfig } from 'bumpp'
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export default defineConfig({
  execute: () => {
    const token = process.env.NPM_ACCESS_TOKEN

    if (!token) {
      throw new Error('NPM_ACCESS_TOKEN is required for npm publish')
    }

    const tempDir = mkdtempSync(join(tmpdir(), 'npm-publish-auth-'))
    const userConfigPath = join(tempDir, '.npmrc')

    // Isolate token usage to a temporary user config file for this publish only.
    writeFileSync(
      userConfigPath,
      `//registry.npmjs.org/:_authToken=${token}
registry=https://registry.npmjs.org/
always-auth=true
`,
      'utf8',
    )

    try {
      execFileSync('npm', ['publish', '--access', 'public'], {
        stdio: 'inherit',
        env: {
          ...process.env,
          NPM_CONFIG_USERCONFIG: userConfigPath,
        },
      })
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  },
})
