import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp3"],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      // androidSdk: path.resolve("/android"),
    },
  },
  build: {
    sourcemap: true,
  },
});

// C:/Users/dream machines/AppData/Local/Android/Sdk = міняю на мій шлях до АНДРОЇД СТУДІО
