import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync, copyFileSync, existsSync, mkdirSync } from 'fs';

// Function to copy files from public to dist
function copyPublicFolder() {
  return {
    name: 'copy-public-folder',
    closeBundle: () => {
      const publicDir = resolve(__dirname, 'public');
      const distDir = resolve(__dirname, 'dist');
      
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      
      const copyRecursive = (src: string, dest: string) => {
        const entries = readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
          const srcPath = resolve(src, entry.name);
          const destPath = resolve(dest, entry.name);
          
          if (entry.isDirectory()) {
            if (!existsSync(destPath)) {
              mkdirSync(destPath, { recursive: true });
            }
            copyRecursive(srcPath, destPath);
          } else {
            copyFileSync(srcPath, destPath);
          }
        }
      };
      
      copyRecursive(publicDir, distDir);
    }
  };
}

// Load environment variables
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      copyPublicFolder()
    ],
    
    // Ensure environment variables are available in the client
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
    },
  
    base: '/',
    
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  },
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
  server: {
{{ ... }}
    open: true,
  },
});
