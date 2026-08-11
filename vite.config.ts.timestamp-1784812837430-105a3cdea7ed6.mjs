// vite.config.ts
import { defineConfig } from "file:///D:/BooterNetWave/VidhikAI/user-admin2/node_modules/vite/dist/node/index.js";
import react from "file:///D:/BooterNetWave/VidhikAI/user-admin2/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\BooterNetWave\\VidhikAI\\user-admin2";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./client/src")
    }
  },
  root: path.resolve(__vite_injected_original_dirname, "client"),
  base: "/user/",
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist/client"),
    emptyOutDir: true
  },
  server: {
    port: 5175,
    proxy: {
      "/user/api": {
        target: "http://localhost:5003",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/user\/api/, "/api")
      },
      "/api": {
        target: "http://localhost:5003",
        changeOrigin: true,
        secure: false
      },
      "/lawyer/uploads": {
        target: "http://localhost:5025",
        changeOrigin: true,
        secure: false,
        rewrite: (path2) => path2.replace(/^\/lawyer\/uploads/, "/uploads")
      },
      "/uploads": {
        target: "http://localhost:5025",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxCb290ZXJOZXRXYXZlXFxcXFZpZGhpa0FJXFxcXHVzZXItYWRtaW4yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxCb290ZXJOZXRXYXZlXFxcXFZpZGhpa0FJXFxcXHVzZXItYWRtaW4yXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Cb290ZXJOZXRXYXZlL1ZpZGhpa0FJL3VzZXItYWRtaW4yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9jbGllbnQvc3JjXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcm9vdDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJjbGllbnRcIiksXHJcbiAgICBiYXNlOiAnL3VzZXIvJyxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImRpc3QvY2xpZW50XCIpLFxyXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHBvcnQ6IDUxNzUsXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgJy91c2VyL2FwaSc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMycsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3VzZXJcXC9hcGkvLCAnL2FwaScpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMycsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL2xhd3llci91cGxvYWRzJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDI1JyxcclxuICAgICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvbGF3eWVyXFwvdXBsb2Fkcy8sICcvdXBsb2FkcycpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnL3VwbG9hZHMnOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUwMjUnLFxyXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5UyxTQUFTLG9CQUFvQjtBQUN0VSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUVqQixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsSUFDL0M7QUFBQSxFQUNKO0FBQUEsRUFDQSxNQUFNLEtBQUssUUFBUSxrQ0FBVyxRQUFRO0FBQUEsRUFDdEMsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0gsUUFBUSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLElBQzdDLGFBQWE7QUFBQSxFQUNqQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0gsYUFBYTtBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZ0JBQWdCLE1BQU07QUFBQSxNQUMxRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0osUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxNQUNBLG1CQUFtQjtBQUFBLFFBQ2YsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsc0JBQXNCLFVBQVU7QUFBQSxNQUNwRTtBQUFBLE1BQ0EsWUFBWTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
