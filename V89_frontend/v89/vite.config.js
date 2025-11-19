import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 💡 This is the correct location for the proxy settings
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // <-- Your Express server port
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '') // Optional: if you want to strip /api on the backend
      },
    },
  },
});
