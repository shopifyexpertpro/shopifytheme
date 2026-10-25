import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Dev-only endpoint: writes a generated section into ./theme/sections so
// `shopify theme dev --path theme` hot-reloads it in the preview store.
function writeToTheme() {
  return {
    name: "write-to-theme",
    configureServer(server) {
      server.middlewares.use("/__theme/write", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          try {
            const { files } = JSON.parse(body);
            const allowed = ["sections", "blocks", "snippets", "assets"];
            const written = [];
            for (const f of files) {
              const [dir, ...rest] = String(f.filename).split("/");
              const name = path.basename(rest.join("/")).replace(/[^a-z0-9._-]/gi, "-");
              if (!allowed.includes(dir) || !/\.(liquid|css|js)$/.test(name)) throw new Error("Bad file: " + f.filename);
              const d = path.resolve("theme", dir);
              fs.mkdirSync(d, { recursive: true });
              fs.writeFileSync(path.join(d, name), String(f.liquid));
              written.push(`theme/${dir}/${name}`);
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, file: written.join(", ") }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({ plugins: [react(), writeToTheme()] });
