import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              // This splits heavy node_modules into a separate, cachable file
              test: /node_modules/,
              name: 'vendor',
            },
          ],
        },
      },
    },
  },
});
