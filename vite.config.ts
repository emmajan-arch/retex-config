import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port dédié : 5173 est souvent pris par d'autres projets (ex. product-gym)
export default defineConfig({
  plugins: [react()],
  server: { port: 5180, strictPort: true },
});
