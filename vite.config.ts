import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import whiteToDisk from './white.to.disk'




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),whiteToDisk()],
  resolve: {},
});
