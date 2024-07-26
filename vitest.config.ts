// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // This is essential for rendering components
    setupFiles: './test/setup.ts',
  },
});
