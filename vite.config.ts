import { defineConfig, loadEnv } from 'vite';
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

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      copyPublicFolder()
    ],
    
    // Path aliases
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@services': resolve(__dirname, './src/services'),
        '@types': resolve(__dirname, './src/types'),
        '@utils': resolve(__dirname, './src/utils'),
      },
    },
    
    // Environment variables
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
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
    
    optimizeDeps: {
      exclude: ['lucide-react']
    } as const,
    
    server: {
      port: 3000,
      open: true,
    },
  };
});
