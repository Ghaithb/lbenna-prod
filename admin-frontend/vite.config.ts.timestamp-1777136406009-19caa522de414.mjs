// vite.config.ts
import { defineConfig } from "file:///D:/telechargement%20c/lbenna%20site%20web/prod/admin-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/telechargement%20c/lbenna%20site%20web/prod/admin-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwind from "file:///D:/telechargement%20c/lbenna%20site%20web/prod/admin-frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
import * as path from "path";
var __vite_injected_original_dirname = "D:\\telechargement c\\lbenna site web\\prod\\admin-frontend";
var vite_config_default = defineConfig({
  plugins: [react(), tailwind()],
  build: {
    outDir: "dist",
    sourcemap: true
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false
        // Keep the /api prefix so requests hit backend's global /api routes
        // e.g. /api/projects -> http://localhost:3001/api/projects
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "../shared/src"),
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@types": path.resolve(__vite_injected_original_dirname, "./src/types")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx0ZWxlY2hhcmdlbWVudCBjXFxcXGxiZW5uYSBzaXRlIHdlYlxcXFxwcm9kXFxcXGFkbWluLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx0ZWxlY2hhcmdlbWVudCBjXFxcXGxiZW5uYSBzaXRlIHdlYlxcXFxwcm9kXFxcXGFkbWluLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi90ZWxlY2hhcmdlbWVudCUyMGMvbGJlbm5hJTIwc2l0ZSUyMHdlYi9wcm9kL2FkbWluLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHRhaWx3aW5kIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdGFpbHdpbmQoKV0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTc0LFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAxJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICAvLyBLZWVwIHRoZSAvYXBpIHByZWZpeCBzbyByZXF1ZXN0cyBoaXQgYmFja2VuZCdzIGdsb2JhbCAvYXBpIHJvdXRlc1xuICAgICAgICAvLyBlLmcuIC9hcGkvcHJvamVjdHMgLT4gaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaS9wcm9qZWN0c1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ0BzaGFyZWQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc2hhcmVkL3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgICdAcGFnZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcGFnZXMnKSxcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaG9va3MnKSxcbiAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgICdAc2VydmljZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc2VydmljZXMnKSxcbiAgICAgICdAdHlwZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdHlwZXMnKSxcbiAgICB9XG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVcsU0FBUyxvQkFBb0I7QUFDcFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sY0FBYztBQUNyQixZQUFZLFVBQVU7QUFIdEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFBQSxFQUM3QixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUE7QUFBQSxNQUdWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQVUsYUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsV0FBZ0IsYUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDbEQsZUFBb0IsYUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxVQUFlLGFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQy9DLFVBQWUsYUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsVUFBZSxhQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxhQUFrQixhQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ3JELFVBQWUsYUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
