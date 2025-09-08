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

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
    },
  },
})
