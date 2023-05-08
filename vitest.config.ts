import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', 'src/components/atoms/AtomSelectPoc.vue'],
      // @ts-ignore
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        all: true,
        exclude: [
          // @ts-ignore
          ...configDefaults.coverage.exclude,
          'src/components/atoms/AtomSelectPoc.vue',
          'src/stores/**',
          'src/router/**',
          'src/App.vue',
          'src/main.ts',
          'src/views/**'
        ]
      }
    }
  })
)
