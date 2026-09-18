import { execSync } from 'child_process';

let commitSha = 'local';
try {
  commitSha = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {}

const buildTime = new Date().toISOString();

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // In development, proxy /api to the local backend on port 5000
  const backendTarget = env.VITE_LOCAL_BACKEND_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    define: {
      __BUILD_COMMIT__: JSON.stringify(commitSha),
      __BUILD_TIME__: JSON.stringify(buildTime),
    },
    base: '/',
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && typeof res.writeHead === 'function' && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  success: false,
                  message: 'Local backend service is not running on port 5000. Please start the backend server.'
                }));
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
