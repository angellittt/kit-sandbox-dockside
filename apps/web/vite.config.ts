import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    // Playwright (in the docker-compose-e2e.yml "playwright" container)
    // hits this server over the docker network as "http://web:5173", so
    // Vite's Host-header check needs to allow that hostname explicitly.
    allowedHosts: ["web"],
  },
});
