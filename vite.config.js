import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    base: isProduction ? '/reactchatbotv2/' : '/',
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
    },
  };
});

