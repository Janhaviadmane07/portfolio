import { defineConfig } from 'vite';

export default defineConfig({
  // Exclude PDFs and large binary files from the file watcher
  // to prevent EBUSY errors on Windows when files are open
  server: {
    watch: {
      ignored: ['**/*.pdf', '**/*.PDF']
    }
  }
});
