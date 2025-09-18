// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"
// import tsconfigPaths from "vite-tsconfig-paths"

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
  
// })

// sample-chakura/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: "localhost",
      port: 5173,
    },
  },
});
