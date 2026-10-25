import React from "react";

const C = { ink: "#14201C", muted: "#5F6F69", line: "#D8E0DC", primary: "#0E6E56", soft: "#E7F0EC", code: "#0D1613", codeInk: "#D6E4DD" };

const LIQUID = {
  title: "Liquid",
  href: "https://shopify.dev/docs/api/liquid",
  intro: "Liquid is Shopify's open-source template language. A template mixes static content with dynamic data, so one product template can show each product's own title, image and price.",
  points: [
    ["Output {{ }}", "Prints an object or property using dot notation, e.g. product.title."],
    ["Tags {% %}", "Logic that renders nothing itself: if/else, for loops, variable creation. Some take parameters (e.g. limit: on for). The liquid tag nests many tags in one delimiter."],
    ["Filters |", "Modify output and chain left to right, e.g. upcase, remove. Many accept parameters."],
    ["Object categories", "Store resources (products, collections), standard content (content_for_header) and functional elements (paginate, search)."],
    ["Object scopes", "Global (any Liquid file except checkout.liquid and Liquid assets), template-specific (e.g. product), or reached through a parent object (e.g. article via blog)."],
    ["Variables", "assign and capture create custom variables, used with the same syntax as objects."],
    ["Basics", "Six basic data types, plus logical and comparison operators for conditions."],
    ["Scope of the docs", "Covers theme Liquid only. Notification, Flow, order printer and packing slip templates use different variations."],
  ],
  snippet: `{% assign title = product.title | upcase %}
{% for variant in product.variants limit: 3 %}
  <p>{{ title }} – {{ variant.price | money }}</p>
{% endfor %}`,
  tools: ["Liquid cheat sheet", "Theme Check linter (+ VS Code extension)", "Shopify CLI theme console (REPL)", "Liquid on GitHub"],
};

const CLI = {
  title: "Shopify CLI",
  href: "https://shopify.dev/docs/api/shopify-cli",
  intro: "Shopify CLI generates and works with apps, themes and custom storefronts, and automates common development tasks.",
  points: [
    ["Requirements", "Node.js 22.12+, a package manager (npm, Yarn 1.x or pnpm) and Git 2.28.0+."],
    ["Install", "Globally via the @shopify/cli@latest package, or Homebrew on macOS (tap shopify/shopify, install shopify-cli)."],
    ["Command shape", "shopify [topic] [command]. Run shopify help to list everything."],
    ["Auto-upgrade", "Since 4.0 it upgrades itself with the package manager you used. Skipped in CI, project-local installs and major bumps. Use shopify upgrade or shopify config autoupgrade on|off."],
    ["Proxy", "From 3.78, set SHOPIFY_HTTP_PROXY / SHOPIFY_HTTPS_PROXY (credentials allowed in the URL)."],
    ["Analytics", "Usage data is collected by default. Opt out with SHOPIFY_CLI_NO_ANALYTICS=1 or OPT_OUT_INSTRUMENTATION=true."],
    ["This project", "npm run theme starts shopify theme dev and npm run theme:check lints, both against the theme/ folder."],
  ],
  snippet: `npm install -g @shopify/cli@latest
shopify help
shopify theme dev --path theme
shopify theme check --path theme`,
  tools: ["Open source on GitHub", "Shopify CLI & Libraries forum", "Dev Platform forum"],
};

function Card({ d }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>
        {d.title} <a href={d.href} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.primary, fontWeight: 600, marginLeft: 8 }}>Official docs ↗</a>
      </h2>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.5 }}>{d.intro}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 10 }}>
        {d.points.map(([h, t]) => (
          <div key={h} style={{ background: C.soft, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.primary }}>{h}</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 3 }}>{t}</div>
          </div>
        ))}
      </div>
      <pre style={{ margin: "14px 0 0", padding: 12, background: C.code, color: C.codeInk, borderRadius: 10, fontSize: 12, lineHeight: 1.55, overflow: "auto", fontFamily: "ui-monospace,Consolas,monospace" }}>{d.snippet}</pre>
      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 10 }}>Related: {d.tools.join(" · ")}</div>
    </section>
  );
}

export default function KeyPoints() {
  return (
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "16px 22px 40px", fontFamily: "system-ui, sans-serif", color: C.ink }}>
      <h1 style={{ fontSize: 24, margin: "0 0 4px" }}>Key points</h1>
      <p style={{ color: C.muted, marginTop: 0 }}>Summary of the Shopify Liquid reference and Shopify CLI docs.</p>
      <Card d={LIQUID} />
      <Card d={CLI} />
    </div>
  );
}
