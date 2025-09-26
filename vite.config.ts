import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import storybookTest from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 类型断言
const __filename = fileURLToPath((import.meta as any).url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest()],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: 'playwright', instances: [{ browser: 'chromium' }] },
          setupFiles: [resolve(__dirname, '.storybook/vitest.setup.ts')]
        }
      }
    ]
  }
});
