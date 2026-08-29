import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./client/src"),
        },
    },
    root: path.resolve(__dirname, "client"),
    base: '/user/',
    build: {
        outDir: path.resolve(__dirname, "dist/client"),
        emptyOutDir: true,
    },
    server: {
        port: 5175,
        proxy: {
            '/user/api': {
                target: 'http://127.0.0.1:5003',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/user\/api/, '/api'),
            },
            '/api': {
                target: 'http://127.0.0.1:5003',
                changeOrigin: true,
                secure: false,
            },
            '/lawyer/uploads': {
                target: 'http://localhost:5025',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/lawyer\/uploads/, '/uploads'),
            },
            '/uploads': {
                target: 'http://localhost:5025',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
