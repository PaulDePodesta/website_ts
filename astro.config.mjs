import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://timstaecker.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
