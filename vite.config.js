import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_API_BASE_URL || env.VITE_BACKEND_URL || 'https://akilesh-portfolio-api.onrender.com'

  return {
    plugins: [react()],
    base: '/Akilesh-A-Software-Systems-Portfolio/',
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && typeof res.writeHead === 'function' && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Backend service unavailable' }));
              }
            });
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three') || id.includes('@react-three')) {
                return 'three-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'motion-vendor';
              }
              if (id.includes('@tsparticles')) {
                return 'particles-vendor';
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 1200,
    },
  }
})

