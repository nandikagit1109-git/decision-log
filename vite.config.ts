import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const html = (name: string) => fileURLToPath(new URL(`./${name}`, import.meta.url));

/**
 * The site is a small multi-page app: each page has its own .html file so the
 * meta tags, Open Graph tags and titles are real HTML that social scrapers and
 * search engines can read without running JavaScript.
 *
 * - Build:  four entries in rollupOptions.input.
 * - Dev:    this plugin rewrites /app -> /app.html etc. (vercel.json does the
 *           same in production).
 */
function mpaDevRewrites(): Plugin {
  const routes: Record<string, string> = {
    "/app": "/app.html",
    "/thank-you": "/thank-you.html",
    "/privacy": "/privacy.html",
  };
  return {
    name: "mpa-dev-rewrites",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url ?? "").split("?")[0];
        const target = routes[path];
        if (target) req.url = target;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mpaDevRewrites()],
  build: {
    rollupOptions: {
      input: {
        main: html("index.html"),
        app: html("app.html"),
        "thank-you": html("thank-you.html"),
        privacy: html("privacy.html"),
      },
    },
  },
});
