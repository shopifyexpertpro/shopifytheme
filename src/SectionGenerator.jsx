import React, { useState, useEffect } from "react";

/* ---------- design tokens ---------- */
const T = {
  paper: "#EDF1EF",
  surface: "#FFFFFF",
  ink: "#14201C",
  muted: "#5F6F69",
  faint: "#8A9691",
  line: "#D8E0DC",
  primary: "#0E6E56",
  primaryDark: "#0A5643",
  primarySoft: "#E7F0EC",
  codeBg: "#0D1613",
  codeInk: "#D6E4DD",
  codeTag: "#7FD1B9",
  codeOut: "#E4B363",
  codeCom: "#5E7168",
  danger: "#B23A3A",
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
.sf-root, .sf-root *{ box-sizing:border-box; }
.sf-root{ font-family:'Space Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif; -webkit-font-smoothing:antialiased; color:${T.ink}; }
.sf-grid{ display:grid; grid-template-columns:400px 1fr; gap:20px; align-items:start; }
@media (max-width:900px){ .sf-grid{ grid-template-columns:1fr; } }
.sf-field{ margin-bottom:16px; }
.sf-label{ display:block; font-size:12.5px; font-weight:600; color:${T.ink}; margin-bottom:6px; }
.sf-input,.sf-textarea,.sf-select{ width:100%; font-family:inherit; font-size:14px; color:${T.ink}; background:#fff; border:1px solid ${T.line}; border-radius:8px; padding:10px 12px; outline:none; transition:border-color .15s, box-shadow .15s; }
.sf-textarea{ resize:vertical; min-height:96px; line-height:1.5; }
.sf-input:focus,.sf-textarea:focus,.sf-select:focus{ border-color:${T.primary}; box-shadow:0 0 0 3px rgba(14,110,86,.12); }
.sf-hint{ font-size:12px; color:${T.muted}; margin-top:5px; line-height:1.45; }
.sf-hint a{ color:${T.primary}; }
.sf-btn{ font-family:inherit; cursor:pointer; border:none; border-radius:9px; font-weight:600; transition:background .15s, transform .05s, opacity .15s; }
.sf-btn:active{ transform:translateY(1px); }
.sf-btn-primary{ background:${T.primary}; color:#fff; padding:13px 18px; font-size:15px; width:100%; display:flex; align-items:center; justify-content:center; gap:9px; }
.sf-btn-primary:hover{ background:${T.primaryDark}; }
.sf-btn-primary:disabled{ opacity:.5; cursor:not-allowed; }
.sf-btn-ghost{ background:transparent; color:#cfe0d8; border:1px solid #2b3a34; padding:6px 11px; font-size:12.5px; font-weight:600; border-radius:7px; }
.sf-btn-ghost:hover{ background:#182420; }
.sf-mode{ flex:1; padding:9px 10px; font-size:12.5px; border-radius:8px; border:1px solid ${T.line}; background:#fff; color:${T.ink}; }
.sf-mode-active{ background:${T.ink}; color:#fff; border-color:${T.ink}; }
.sf-collapse{ width:100%; display:flex; align-items:center; justify-content:space-between; background:transparent; border:none; cursor:pointer; padding:0; font-family:inherit; font-size:12.5px; font-weight:600; color:${T.ink}; }
.sf-code{ font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace; }
.sf-scroll::-webkit-scrollbar{ width:10px; height:10px; }
.sf-scroll::-webkit-scrollbar-thumb{ background:#26332E; border-radius:6px; }
.sf-scroll::-webkit-scrollbar-track{ background:transparent; }
.lq-tag{ color:${T.codeTag}; }
.lq-out{ color:${T.codeOut}; }
.lq-com{ color:${T.codeCom}; font-style:italic; }
.sf-spin{ width:15px; height:15px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:sfspin .7s linear infinite; }
@keyframes sfspin{ to{ transform:rotate(360deg); } }
.sf-skel{ height:12px; border-radius:4px; background:linear-gradient(90deg,#182420,#20302a,#182420); background-size:200% 100%; animation:sfshim 1.3s ease-in-out infinite; }
@keyframes sfshim{ 0%{ background-position:200% 0; } 100%{ background-position:-200% 0; } }
input[type=color].sf-swatch{ width:38px; height:34px; padding:0; border:1px solid ${T.line}; border-radius:7px; background:#fff; cursor:pointer; }
@media (prefers-reduced-motion:reduce){ .sf-btn,.sf-input,.sf-textarea,.sf-select{ transition:none; } .sf-spin{ animation-duration:1.4s; } .sf-skel{ animation:none; } }
`;

const SECTION_TYPES = [
  ["hero", "Hero"],
  ["image_text", "Image with text"],
  ["featured_product", "Featured product"],
  ["testimonials", "Testimonials / reviews"],
  ["faq", "FAQ / accordion"],
  ["features", "Feature grid"],
  ["rich_text", "Rich text"],
  ["collection_grid", "Collection grid"],
  ["logo_list", "Logo list"],
  ["newsletter", "Newsletter signup"],
  ["custom", "Custom"],
];

const THEMES = [
  ["horizon", "Horizon (nested blocks)"],
  ["dawn", "Dawn / OS 2.0"],
];

const GUARANTEES = [
  ["Complete schema", "Every text, image, colour and layout choice is an editor setting — nothing hardcoded."],
  ["Editor-ready presets", "A presets block, so it shows up under “Add section” right away."],
  ["Scoped CSS", "All styles are namespaced to the section id — zero bleed into the rest of the theme."],
  ["Settings-driven styling", "Colours and spacing flow through CSS variables, so they’re editable in the theme editor."],
  ["Accessible & responsive", "Heading order, alt text, focus states, reduced-motion, mobile-first."],
  ["Theme-check friendly", "Valid Liquid with sensible defaults, using Shopify’s image filters."],
];

const SAMPLE = `{% comment %} settings become editable controls in the theme editor {% endcomment %}
{
  "type": "color",
  "id": "bg",
  "label": "Background",
  "default": "#0E6E56"
}`;

/* ============================================================
   ONLINE MODE — free-tier AI via an OpenAI-compatible endpoint
   (OpenRouter: same /chat/completions shape as OpenAI, and it
   hosts several ":free" models you can use with a free API key
   from openrouter.ai/keys)
   ============================================================ */
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Defaults from .env.local (dev only — Vite inlines VITE_* values into the bundle)
const ENV_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const ENV_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "";

const FREE_MODEL_PRESETS = [
  ["openai/gpt-4o", "GPT-4o (paid, reads images)"],
  ["meta-llama/llama-3.1-8b-instruct:free", "Llama 3.1 8B (free)"],
  ["google/gemma-2-9b-it:free", "Gemma 2 9B (free)"],
  ["mistralai/mistral-7b-instruct:free", "Mistral 7B (free)"],
  ["deepseek/deepseek-chat-v3-0324:free", "DeepSeek V3 (free)"],
  ["google/gemma-3-27b-it:free", "Gemma 3 27B (free, reads images)"],
  ["qwen/qwen2.5-vl-72b-instruct:free", "Qwen 2.5 VL 72B (free, reads images)"],
];
const VISION_MODEL = ENV_MODEL || "openai/gpt-4o";

/* Read an uploaded image, downscale it (keeps the API payload small) and
   pull two dominant colours for primary / accent. */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn’t read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file isn’t an image the browser can open."));
      img.onload = () => {
        const max = 1280;
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve({ dataUrl: c.toDataURL("image/jpeg", 0.85), colors: dominantColors(ctx, c.width, c.height) });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function dominantColors(ctx, w, h) {
  const { data } = ctx.getImageData(0, 0, w, h);
  const step = Math.max(1, Math.floor((w * h) / 20000)) * 4;
  const buckets = {};
  for (let i = 0; i < data.length; i += step) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx > 235 || mx < 25 || mx - mn < 30) continue; // skip near-white, near-black and greys
    const k = (r >> 4) + "," + (g >> 4) + "," + (b >> 4);
    const e = buckets[k] || (buckets[k] = { n: 0, r: 0, g: 0, b: 0 });
    e.n++; e.r += r; e.g += g; e.b += b;
  }
  const hex = (e) => "#" + [e.r, e.g, e.b].map((v) => Math.round(v / e.n).toString(16).padStart(2, "0")).join("");
  const sorted = Object.values(buckets).sort((a, b) => b.n - a.n);
  if (!sorted.length) return null;
  const first = sorted[0];
  const far = (e) => Math.abs(e.r / e.n - first.r / first.n) + Math.abs(e.g / e.n - first.g / first.n) + Math.abs(e.b / e.n - first.b / first.n) > 120;
  const second = sorted.find(far) || sorted[1] || first;
  return [hex(first), hex(second)];
}

function systemPrompt() {
  return `You are a senior Shopify theme developer. You produce ONE complete, production-ready Shopify section (.liquid) file a merchant can drop into a theme's /sections folder and use immediately in the theme editor.

Non-negotiable requirements:
1. A complete {% schema %} at the end. EVERY piece of text, every image, every colour and every meaningful layout choice must be an editor setting (types: text, textarea, richtext, inline_richtext, image_picker, color, range, select, checkbox, url). Nothing user-facing may be hardcoded.
2. A "presets" array (with a name) so the section appears under Add section in the theme editor.
3. Repeatable items (slides, cards, testimonials, logos, faq rows, features) modelled as schema "blocks", rendered with {% for block in section.blocks %}, each block root carrying {{ block.shopify_attributes }}.
4. Scope ALL CSS to this section instance: use a root class suffixed with the section id, e.g. class="foundry-x foundry-x--{{ section.id }}", and prefix every selector with .foundry-x--{{ section.id }}. Styles must never leak into the rest of the theme.
5. Drive colours and spacing from settings via CSS custom properties set inline on the section root, e.g. style="--fx-bg: {{ section.settings.bg }}; --fx-pad: {{ section.settings.padding }}px;", with the <style> block using var(--fx-bg). This is what keeps styling editable. Put CSS in an inline <style> tag (NOT {% stylesheet %}, which cannot interpolate Liquid).
6. Accessible, semantic HTML: correct heading order, alt text bound to image settings, buttons vs links used correctly, visible :focus-visible states, and a prefers-reduced-motion guard around any motion.
7. Mobile-first and responsive.
8. Images via Shopify filters: {{ section.settings.image | image_url: width: 1200 | image_tag: loading: 'lazy' }}, with a graceful fallback when unset.
9. Valid Liquid, no theme-check errors, sensible defaults on every setting so it looks right the moment it is added.
10. No external libraries, fonts or CDNs; inherit theme fonts.

Adapt to the target theme (Horizon: nested-block conventions; Dawn: classic OS 2.0 sections + blocks). Keep the section focused and the code COMPLETE — never truncate; if scope is large, keep it tight rather than cut off.

Respond with ONLY a JSON object, no markdown and no backticks, in exactly this shape:
{"filename":"sections/<kebab-name>.liquid","liquid":"<the complete .liquid file as a string>","settingsSummary":["<setting> — <what it controls>"],"notes":["<short note on a notable decision>"],"files":[{"filename":"<path>","content":"<file contents>"}]}
"files" is OPTIONAL: only include it when the brief asks for separate files (CSS asset, snippet, theme blocks). The main section stays in "liquid"; every extra file goes in "files".
Escape the liquid string properly for JSON. Output nothing outside the JSON object.`;
}

function userPrompt(f) {
  const typeLabel = (SECTION_TYPES.find((s) => s[0] === f.type) || [])[1] || "Custom";
  const themeLabel = (THEMES.find((s) => s[0] === f.target) || [])[1] || "Horizon";
  const lines = [
    `Section type: ${typeLabel}`,
    `Target theme: ${themeLabel}`,
    `Description: ${f.desc.trim() || "Recreate the section shown in the attached reference image."}`,
  ];
  if (f.image) lines.push("\nREFERENCE IMAGE ATTACHED: design a section that closely matches it — same layout and column structure, content order, visual hierarchy, spacing, alignment, corner radius, button style and colour palette. Turn every text, image and repeated item you see into editable settings or blocks, using the visible copy as default values where readable. Use image_picker settings for photos (don't hotlink the screenshot).");
  if (f.brandName.trim()) lines.push(`Brand / product name: ${f.brandName.trim()}`);
  lines.push(`Primary colour: ${f.primary}`);
  lines.push(`Accent colour: ${f.accent}`);
  lines.push(`Use the primary and accent colours as the defaults for the relevant colour settings.`);
  const ti = f.theme || {};
  const tl = [];
  if (ti.name?.trim()) tl.push(`Theme name: ${ti.name.trim()}`);
  if (ti.container?.trim()) tl.push(`Content wrapper CSS class: ${ti.container.trim()} (use it for the section's inner container instead of a custom max-width)`);
  if (ti.button?.trim()) tl.push(`Button CSS class(es): ${ti.button.trim()} (add to every button/CTA)`);
  if (ti.headingFont?.trim()) tl.push(`Heading font-family / CSS var: ${ti.headingFont.trim()}`);
  if (ti.bodyFont?.trim()) tl.push(`Body font-family / CSS var: ${ti.bodyFont.trim()}`);
  if (ti.cssVars?.trim()) tl.push(`Theme CSS variables available (prefer them, with fallbacks): ${ti.cssVars.trim()}`);
  if (ti.rules?.trim()) tl.push(`Extra theme conventions: ${ti.rules.trim()}`);
  if (tl.length) lines.push("\nTHEME INFO — match this theme's conventions (overrides the defaults above where they conflict):\n" + tl.join("\n"));
  if (ti.sample?.trim()) lines.push("\nExisting section from the theme; copy its markup style, class naming and schema conventions:\n```liquid\n" + ti.sample.trim().slice(0, 6000) + "\n```");
  const o = f.opts || {};
  const ol = [];
  if (o.css) ol.push("- Put ALL CSS in a separate file assets/section-<name>.css (plain CSS, no Liquid; scope selectors to the root class without the section id; dynamic values still come from inline CSS custom properties on the root). Load it in the section with {{ 'section-<name>.css' | asset_url | stylesheet_tag }}. Do NOT also inline it.");
  if (o.blocks) ol.push("- Make repeatable items THEME BLOCKS: one file per block type in blocks/<name>.liquid, each with its own {% schema %} (name + settings) and {{ block.shopify_attributes }} on its root. The section renders them with {% content_for 'blocks' %} and its schema uses \"blocks\": [{ \"type\": \"@theme\" }], with presets listing the block types.");
  else if (o.snippet) ol.push("- Put the markup of each repeated item in a snippet snippets/<name>-item.liquid (start it with a {% doc %} block listing @param), called from the section as {% render '<name>-item', block: block %}.");
  if (ol.length) lines.push("\nOUTPUT STRUCTURE (return the extra files in the \"files\" array):\n" + ol.join("\n"));
  if (f.useVoice && f.voice.trim()) lines.push(`Write default placeholder copy in this brand voice: ${f.voice.trim()}`);
  else lines.push(`Use clear, generic placeholder copy for the default text.`);
  return lines.join("\n");
}

async function generateOnline(f, apiKey, model) {
  let res;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": (typeof window !== "undefined" && window.location && window.location.origin) || "https://section-foundry.local",
        "X-Title": "Section Foundry",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt() },
          {
            role: "user",
            content: f.image
              ? [{ type: "text", text: userPrompt(f) }, { type: "image_url", image_url: { url: f.image } }]
              : userPrompt(f),
          },
        ],
        temperature: 0.4,
      }),
    });
  } catch (e) {
    throw new Error("Couldn’t reach the API — check your internet connection, or switch to Offline mode.");
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error("That API key was rejected. Grab a free one at openrouter.ai/keys and paste it in.");
    if (res.status === 402) throw new Error("This model needs credits on your OpenRouter account. Pick a model ending in “:free” instead.");
    if (res.status === 429) throw new Error("Rate-limited on the free tier. Wait a bit and try again, or switch to Offline mode.");
    if (f.image && (res.status === 400 || res.status === 404)) throw new Error(`This model probably can’t read images (${res.status}). Pick one marked “reads images”, e.g. ${VISION_MODEL}.`);
    throw new Error(`The model couldn’t be reached (${res.status}). Try again in a moment.`);
  }
  const data = await res.json();
  const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "").trim();
  if (!text) throw new Error("The model returned an empty response. Try tightening the description and generate again.");
  return parseResult(text);
}

/* ============================================================
   OFFLINE MODE — rule-based template engine, no AI, no network
   ============================================================ */
function scopeCss(prefix, css) {
  return css.replace(/&/g, `.${prefix}--{{ section.id }}`);
}

function baseCss(prefix) {
  return scopeCss(prefix, `
&, & *{ box-sizing:border-box; }
&{ padding-top:var(--fx-pad-t); padding-bottom:var(--fx-pad-b); }
& .fx-inner{ max-width:1200px; margin:0 auto; padding:0 24px; }
& .visually-hidden{ position:absolute!important; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
& .fx-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; background:var(--fx-primary); color:#fff; font-weight:600; font-size:15px; padding:13px 22px; border-radius:8px; text-decoration:none; border:none; cursor:pointer; transition:opacity .15s, transform .05s; }
& .fx-btn:hover{ opacity:.88; }
& .fx-btn:active{ transform:translateY(1px); }
& .fx-btn:focus-visible{ outline:2px solid var(--fx-accent); outline-offset:3px; }
& .fx-placeholder{ background:#e9edeb; border-radius:10px; width:100%; height:auto; display:block; }
@media (prefers-reduced-motion:reduce){ & *{ transition:none!important; animation:none!important; } }
`);
}

function buildSection({ prefix, filename, css, bodyLiquid, schema }) {
  const fullCss = baseCss(prefix) + "\n" + scopeCss(prefix, css);
  const liquid = `{% comment %}
  Generated offline by Section Foundry — no AI used.
  Every colour, text and layout choice below is wired to a setting in the schema at the bottom of this file.
{% endcomment %}
<div class="${prefix} ${prefix}--{{ section.id }}" style="--fx-primary: {{ section.settings.primary_color }}; --fx-accent: {{ section.settings.accent_color }}; --fx-pad-t: {{ section.settings.padding_top }}px; --fx-pad-b: {{ section.settings.padding_bottom }}px;">
  <style>
${fullCss}
  </style>
${bodyLiquid}
</div>

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
  return { filename, liquid };
}

function commonColorSettings(primary, accent) {
  return [
    { type: "color", id: "primary_color", label: "Primary colour", default: primary },
    { type: "color", id: "accent_color", label: "Accent colour", default: accent },
  ];
}
function commonPaddingSettings(top, bottom) {
  return [
    { type: "range", id: "padding_top", label: "Top padding", min: 0, max: 160, step: 4, unit: "px", default: top },
    { type: "range", id: "padding_bottom", label: "Bottom padding", min: 0, max: 160, step: 4, unit: "px", default: bottom },
  ];
}

const SETTING_DESCRIPTIONS = {
  heading: "Main heading text",
  subheading: "Supporting line under the heading",
  text: "Body copy",
  text_align: "Text alignment",
  button_label: "Call-to-action button text",
  button_link: "Where the button links to",
  show_button: "Whether the button is shown",
  image: "Image shown in this section",
  image_position: "Which side the image sits on",
  primary_color: "Main accent colour (buttons, highlights)",
  accent_color: "Secondary accent colour",
  padding_top: "Space above the section",
  padding_bottom: "Space below the section",
  product: "Which product this section shows",
  collection: "Which collection this section shows",
  products_to_show: "How many products appear",
  columns_desktop: "Number of columns on desktop",
  show_price: "Whether the price is shown",
  show_vendor: "Whether the vendor/brand name is shown",
  view_all_label: "Text on the “view all” link",
  grayscale: "Whether logos are shown in grayscale",
  placeholder_text: "Placeholder text in the email field",
  question: "FAQ question text",
  answer: "FAQ answer text",
  quote: "Testimonial quote",
  author: "Customer name",
  role: "Customer’s role or location",
  avatar: "Customer photo",
  title: "Feature title",
  icon: "Feature icon image",
  alt: "Image alt text",
  link: "Where the logo links to",
};

function summarize(settings, prefix) {
  return (settings || [])
    .filter((s) => s.type !== "header")
    .map((s) => `${prefix ? prefix + ": " : ""}${s.label} — ${SETTING_DESCRIPTIONS[s.id] || "Editable in the theme editor"}`);
}

function finalize(schema, built, notes) {
  let settingsSummary = summarize(schema.settings);
  if (schema.blocks) {
    for (const b of schema.blocks) settingsSummary = settingsSummary.concat(summarize(b.settings, b.name));
  }
  return {
    filename: built.filename,
    liquid: built.liquid,
    settingsSummary,
    notes: notes || [
      "Generated offline with a rule-based template — for AI-written copy tailored to your description, switch to Online mode.",
    ],
  };
}

const OFFLINE_TYPES = {
  hero: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const desc = f.desc.trim();
      const schema = {
        name: "Hero",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `Meet ${brand}` },
          { type: "richtext", id: "subheading", label: "Subheading", default: `<p>${desc || "A short line about what makes you different."}</p>` },
          { type: "text", id: "button_label", label: "Button label", default: "Shop now" },
          { type: "url", id: "button_link", label: "Button link" },
          { type: "image_picker", id: "image", label: "Image" },
          { type: "select", id: "image_position", label: "Image position", default: "right", options: [{ value: "right", label: "Right" }, { value: "left", label: "Left" }] },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(72, 72),
        ],
        presets: [{ name: "Hero" }],
      };
      const bodyLiquid = `  <div class="fx-hero__inner fx-inner">
    <div class="fx-hero__grid fx-hero__grid--{{ section.settings.image_position }}">
      <div class="fx-hero__content">
        <h1 class="fx-hero__heading">{{ section.settings.heading }}</h1>
        {%- if section.settings.subheading != blank -%}<div class="fx-hero__sub">{{ section.settings.subheading }}</div>{%- endif -%}
        {%- if section.settings.button_label != blank -%}<a href="{{ section.settings.button_link }}" class="fx-btn">{{ section.settings.button_label }}</a>{%- endif -%}
      </div>
      <div class="fx-hero__media">
        {%- if section.settings.image -%}
          {{ section.settings.image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '400,600,800,1200,1600', sizes: '(min-width: 750px) 50vw, 100vw', alt: section.settings.heading, class: 'fx-hero__img' }}
        {%- else -%}
          {{ 'hero-apparel-1' | placeholder_svg_tag: 'fx-placeholder fx-hero__img' }}
        {%- endif -%}
      </div>
    </div>
  </div>`;
      const css = `
& .fx-hero__grid{ display:grid; grid-template-columns:1fr 1fr; gap:44px; align-items:center; }
& .fx-hero__grid--left .fx-hero__content{ order:2; }
@media (max-width:749px){ & .fx-hero__grid{ grid-template-columns:1fr; gap:28px; } & .fx-hero__grid--left .fx-hero__media, & .fx-hero__grid--left .fx-hero__content{ order:0; } }
& .fx-hero__heading{ font-size:clamp(28px,4vw,44px); line-height:1.12; font-weight:700; margin:0 0 14px; }
& .fx-hero__sub{ font-size:16px; line-height:1.55; opacity:.82; margin:0 0 22px; max-width:46ch; }
& .fx-hero__img{ width:100%; height:auto; border-radius:14px; display:block; }
`;
      return finalize(schema, buildSection({ prefix: "fx-hero", filename: "sections/hero.liquid", css, bodyLiquid, schema }));
    },
  },

  image_text: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const desc = f.desc.trim();
      const schema = {
        name: "Image with text",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `About ${brand}` },
          { type: "richtext", id: "text", label: "Text", default: `<p>${desc || "Say a little about this — what it is, why it matters, or what makes it different."}</p>` },
          { type: "image_picker", id: "image", label: "Image" },
          { type: "select", id: "image_position", label: "Image position", default: "left", options: [{ value: "left", label: "Left" }, { value: "right", label: "Right" }] },
          { type: "checkbox", id: "show_button", label: "Show button", default: false },
          { type: "text", id: "button_label", label: "Button label", default: "Learn more" },
          { type: "url", id: "button_link", label: "Button link" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        presets: [{ name: "Image with text" }],
      };
      const bodyLiquid = `  <div class="fx-imgtext__inner fx-inner">
    <div class="fx-imgtext__grid fx-imgtext__grid--{{ section.settings.image_position }}">
      <div class="fx-imgtext__media">
        {%- if section.settings.image -%}
          {{ section.settings.image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '400,600,800,1200', sizes: '(min-width: 750px) 50vw, 100vw', alt: section.settings.heading, class: 'fx-imgtext__img' }}
        {%- else -%}
          {{ 'lifestyle-1' | placeholder_svg_tag: 'fx-placeholder fx-imgtext__img' }}
        {%- endif -%}
      </div>
      <div class="fx-imgtext__content">
        <h2 class="fx-imgtext__heading">{{ section.settings.heading }}</h2>
        <div class="fx-imgtext__text">{{ section.settings.text }}</div>
        {%- if section.settings.show_button and section.settings.button_label != blank -%}
          <a href="{{ section.settings.button_link }}" class="fx-btn">{{ section.settings.button_label }}</a>
        {%- endif -%}
      </div>
    </div>
  </div>`;
      const css = `
& .fx-imgtext__grid{ display:grid; grid-template-columns:1fr 1fr; gap:44px; align-items:center; }
& .fx-imgtext__grid--right .fx-imgtext__media{ order:2; }
@media (max-width:749px){ & .fx-imgtext__grid{ grid-template-columns:1fr; gap:24px; } & .fx-imgtext__grid--right .fx-imgtext__media{ order:0; } }
& .fx-imgtext__heading{ font-size:clamp(24px,3vw,34px); font-weight:700; margin:0 0 12px; }
& .fx-imgtext__text{ font-size:15.5px; line-height:1.6; opacity:.85; margin:0 0 18px; }
& .fx-imgtext__img{ width:100%; height:auto; border-radius:14px; display:block; }
`;
      return finalize(schema, buildSection({ prefix: "fx-imgtext", filename: "sections/image-with-text.liquid", css, bodyLiquid, schema }));
    },
  },

  featured_product: {
    build(f) {
      const schema = {
        name: "Featured product",
        settings: [
          { type: "product", id: "product", label: "Product" },
          { type: "checkbox", id: "show_vendor", label: "Show vendor", default: true },
          { type: "checkbox", id: "show_price", label: "Show price", default: true },
          { type: "text", id: "button_label", label: "Button label", default: "View product" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        presets: [{ name: "Featured product" }],
      };
      const bodyLiquid = `  {%- assign fx_product = section.settings.product -%}
  <div class="fx-product__inner fx-inner">
    {%- if fx_product -%}
      {%- assign fx_product_alt = fx_product.featured_image.alt | default: fx_product.title -%}
      <div class="fx-product__grid">
        <div class="fx-product__media">
          {%- if fx_product.featured_image -%}
            {{ fx_product.featured_image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '400,600,800,1200', sizes: '(min-width: 750px) 50vw, 100vw', alt: fx_product_alt, class: 'fx-product__img' }}
          {%- else -%}
            {{ 'product-1' | placeholder_svg_tag: 'fx-placeholder fx-product__img' }}
          {%- endif -%}
        </div>
        <div class="fx-product__info">
          {%- if section.settings.show_vendor and fx_product.vendor != blank -%}<div class="fx-product__vendor">{{ fx_product.vendor }}</div>{%- endif -%}
          <h2 class="fx-product__title">{{ fx_product.title }}</h2>
          {%- if section.settings.show_price -%}
            <div class="fx-product__price">
              {{ fx_product.price | money }}
              {%- if fx_product.compare_at_price > fx_product.price -%}
                <s class="fx-product__compare">{{ fx_product.compare_at_price | money }}</s>
              {%- endif -%}
            </div>
          {%- endif -%}
          {%- if fx_product.description != blank -%}
            <div class="fx-product__desc">{{ fx_product.description | strip_html | truncatewords: 40 }}</div>
          {%- endif -%}
          <a href="{{ fx_product.url }}" class="fx-btn">{{ section.settings.button_label }}</a>
        </div>
      </div>
    {%- else -%}
      <div class="fx-product__empty">Select a product in the theme editor to preview this section.</div>
    {%- endif -%}
  </div>`;
      const css = `
& .fx-product__grid{ display:grid; grid-template-columns:1fr 1fr; gap:44px; align-items:center; }
@media (max-width:749px){ & .fx-product__grid{ grid-template-columns:1fr; gap:24px; } }
& .fx-product__vendor{ font-size:12.5px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; opacity:.65; margin-bottom:6px; }
& .fx-product__title{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 10px; }
& .fx-product__price{ font-size:18px; font-weight:600; margin-bottom:14px; }
& .fx-product__compare{ opacity:.55; margin-left:8px; font-weight:400; }
& .fx-product__desc{ font-size:15px; line-height:1.6; opacity:.85; margin-bottom:18px; }
& .fx-product__img{ width:100%; height:auto; border-radius:14px; display:block; }
& .fx-product__empty{ text-align:center; opacity:.6; padding:40px 0; font-size:14px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-product", filename: "sections/featured-product.liquid", css, bodyLiquid, schema }), [
        "Links to the product page rather than an inline add-to-cart form — use Online mode if you need a full variant picker and AJAX cart.",
      ]);
    },
  },

  testimonials: {
    build(f) {
      const desc = f.desc.trim();
      const schema = {
        name: "Testimonials",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: "What our customers say" },
          { type: "range", id: "columns_desktop", label: "Columns (desktop)", min: 1, max: 4, step: 1, default: 3 },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        blocks: [
          {
            type: "testimonial",
            name: "Testimonial",
            settings: [
              { type: "richtext", id: "quote", label: "Quote", default: `<p>${desc || "Loved the quality and the shipping was fast."}</p>` },
              { type: "text", id: "author", label: "Author", default: "Happy customer" },
              { type: "text", id: "role", label: "Role / location", default: "Verified buyer" },
              { type: "image_picker", id: "avatar", label: "Photo" },
            ],
          },
        ],
        presets: [{ name: "Testimonials", blocks: [{ type: "testimonial" }, { type: "testimonial" }, { type: "testimonial" }] }],
      };
      const bodyLiquid = `  <div class="fx-testimonials__inner fx-inner">
    <h2 class="fx-testimonials__heading">{{ section.settings.heading }}</h2>
    <div class="fx-testimonials__grid" style="--fx-cols: {{ section.settings.columns_desktop }};">
      {%- for block in section.blocks -%}
        <div class="fx-testimonials__card" {{ block.shopify_attributes }}>
          <div class="fx-testimonials__mark" aria-hidden="true">&ldquo;</div>
          <blockquote class="fx-testimonials__quote">{{ block.settings.quote }}</blockquote>
          <div class="fx-testimonials__person">
            {%- if block.settings.avatar -%}
              {{ block.settings.avatar | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '80,120', alt: block.settings.author, class: 'fx-testimonials__avatar' }}
            {%- else -%}
              <span class="fx-testimonials__initial" aria-hidden="true">{{ block.settings.author | slice: 0 }}</span>
            {%- endif -%}
            <div>
              <div class="fx-testimonials__author">{{ block.settings.author }}</div>
              {%- if block.settings.role != blank -%}<div class="fx-testimonials__role">{{ block.settings.role }}</div>{%- endif -%}
            </div>
          </div>
        </div>
      {%- endfor -%}
    </div>
  </div>`;
      const css = `
& .fx-testimonials__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 28px; text-align:center; }
& .fx-testimonials__grid{ display:grid; grid-template-columns:repeat(var(--fx-cols),1fr); gap:20px; }
@media (max-width:749px){ & .fx-testimonials__grid{ grid-template-columns:1fr; } }
& .fx-testimonials__card{ background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:14px; padding:22px; }
& .fx-testimonials__mark{ font-size:34px; color:var(--fx-accent); line-height:1; font-weight:700; margin-bottom:4px; }
& .fx-testimonials__quote{ margin:0 0 18px; font-size:15px; line-height:1.6; }
& .fx-testimonials__person{ display:flex; align-items:center; gap:10px; }
& .fx-testimonials__avatar{ width:40px; height:40px; border-radius:50%; object-fit:cover; }
& .fx-testimonials__initial{ width:40px; height:40px; border-radius:50%; background:var(--fx-primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; text-transform:uppercase; }
& .fx-testimonials__author{ font-size:13.5px; font-weight:600; }
& .fx-testimonials__role{ font-size:12.5px; opacity:.6; }
`;
      return finalize(schema, buildSection({ prefix: "fx-testimonials", filename: "sections/testimonials.liquid", css, bodyLiquid, schema }));
    },
  },

  faq: {
    build(f) {
      const desc = f.desc.trim();
      const schema = {
        name: "FAQ",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: "Frequently asked questions" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        blocks: [
          {
            type: "faq_item",
            name: "Question",
            settings: [
              { type: "text", id: "question", label: "Question", default: "Question goes here" },
              { type: "richtext", id: "answer", label: "Answer", default: `<p>${desc || "Answer goes here."}</p>` },
            ],
          },
        ],
        presets: [{ name: "FAQ", blocks: [{ type: "faq_item" }, { type: "faq_item" }, { type: "faq_item" }] }],
      };
      const bodyLiquid = `  <div class="fx-faq__inner fx-inner">
    <h2 class="fx-faq__heading">{{ section.settings.heading }}</h2>
    <div class="fx-faq__list">
      {%- for block in section.blocks -%}
        <details class="fx-faq__item" {{ block.shopify_attributes }}>
          <summary class="fx-faq__q">
            <span>{{ block.settings.question }}</span>
            <span class="fx-faq__icon" aria-hidden="true"></span>
          </summary>
          <div class="fx-faq__a">{{ block.settings.answer }}</div>
        </details>
      {%- endfor -%}
    </div>
  </div>`;
      const css = `
& .fx-faq__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 20px; }
& .fx-faq__list{ max-width:760px; }
& .fx-faq__item{ border-bottom:1px solid rgba(0,0,0,.1); padding:16px 0; }
& .fx-faq__q{ display:flex; align-items:center; justify-content:space-between; gap:14px; cursor:pointer; list-style:none; font-weight:600; font-size:15px; }
& .fx-faq__q::-webkit-details-marker{ display:none; }
& .fx-faq__q:focus-visible{ outline:2px solid var(--fx-accent); outline-offset:4px; }
& .fx-faq__icon{ flex-shrink:0; width:11px; height:11px; border-right:2px solid var(--fx-primary); border-bottom:2px solid var(--fx-primary); transform:rotate(45deg); transition:transform .15s; }
& .fx-faq__item[open] .fx-faq__icon{ transform:rotate(-135deg); }
& .fx-faq__a{ font-size:14.5px; line-height:1.6; opacity:.82; padding-top:10px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-faq", filename: "sections/faq.liquid", css, bodyLiquid, schema }), [
        "Uses native <details>/<summary> for the accordion — fully accessible and needs zero JavaScript.",
      ]);
    },
  },

  features: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const desc = f.desc.trim();
      const schema = {
        name: "Feature grid",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `Why ${brand}` },
          { type: "richtext", id: "subheading", label: "Subheading", default: desc ? `<p>${desc}</p>` : "" },
          { type: "range", id: "columns_desktop", label: "Columns (desktop)", min: 2, max: 4, step: 1, default: 3 },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        blocks: [
          {
            type: "feature",
            name: "Feature",
            settings: [
              { type: "image_picker", id: "icon", label: "Icon" },
              { type: "text", id: "title", label: "Title", default: "Feature title" },
              { type: "richtext", id: "text", label: "Text", default: "<p>A short description of this feature.</p>" },
            ],
          },
        ],
        presets: [{ name: "Feature grid", blocks: [{ type: "feature" }, { type: "feature" }, { type: "feature" }] }],
      };
      const bodyLiquid = `  <div class="fx-features__inner fx-inner">
    <div class="fx-features__head">
      <h2 class="fx-features__heading">{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<div class="fx-features__sub">{{ section.settings.subheading }}</div>{%- endif -%}
    </div>
    <div class="fx-features__grid" style="--fx-cols: {{ section.settings.columns_desktop }};">
      {%- for block in section.blocks -%}
        <div class="fx-features__card" {{ block.shopify_attributes }}>
          {%- if block.settings.icon -%}
            {{ block.settings.icon | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '64,96', alt: block.settings.title, class: 'fx-features__icon' }}
          {%- else -%}
            <span class="fx-features__dot" aria-hidden="true"></span>
          {%- endif -%}
          <h3 class="fx-features__title">{{ block.settings.title }}</h3>
          <div class="fx-features__text">{{ block.settings.text }}</div>
        </div>
      {%- endfor -%}
    </div>
  </div>`;
      const css = `
& .fx-features__head{ text-align:center; max-width:640px; margin:0 auto 34px; }
& .fx-features__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 10px; }
& .fx-features__sub{ font-size:15px; opacity:.75; line-height:1.55; }
& .fx-features__grid{ display:grid; grid-template-columns:repeat(var(--fx-cols),1fr); gap:28px; }
@media (max-width:749px){ & .fx-features__grid{ grid-template-columns:1fr; } }
& .fx-features__card{ text-align:center; }
& .fx-features__icon{ width:44px; height:44px; margin:0 auto 14px; object-fit:contain; }
& .fx-features__dot{ display:block; width:10px; height:10px; border-radius:50%; background:var(--fx-accent); margin:0 auto 16px; }
& .fx-features__title{ font-size:16px; font-weight:700; margin:0 0 8px; }
& .fx-features__text{ font-size:14px; line-height:1.55; opacity:.8; }
`;
      return finalize(schema, buildSection({ prefix: "fx-features", filename: "sections/feature-grid.liquid", css, bodyLiquid, schema }));
    },
  },

  rich_text: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const desc = f.desc.trim();
      const schema = {
        name: "Rich text",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `About ${brand}` },
          { type: "richtext", id: "text", label: "Text", default: `<p>${desc || "Write a short, focused message here."}</p>` },
          { type: "select", id: "text_align", label: "Alignment", default: "center", options: [{ value: "center", label: "Center" }, { value: "left", label: "Left" }] },
          { type: "checkbox", id: "show_button", label: "Show button", default: false },
          { type: "text", id: "button_label", label: "Button label", default: "Learn more" },
          { type: "url", id: "button_link", label: "Button link" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        presets: [{ name: "Rich text" }],
      };
      const bodyLiquid = `  <div class="fx-richtext__inner fx-inner fx-richtext__inner--{{ section.settings.text_align }}">
    <h2 class="fx-richtext__heading">{{ section.settings.heading }}</h2>
    <div class="fx-richtext__text">{{ section.settings.text }}</div>
    {%- if section.settings.show_button and section.settings.button_label != blank -%}
      <a href="{{ section.settings.button_link }}" class="fx-btn">{{ section.settings.button_label }}</a>
    {%- endif -%}
  </div>`;
      const css = `
& .fx-richtext__inner{ max-width:680px; }
& .fx-richtext__inner--center{ text-align:center; margin-left:auto; margin-right:auto; }
& .fx-richtext__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 14px; }
& .fx-richtext__text{ font-size:15.5px; line-height:1.65; opacity:.85; margin-bottom:18px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-richtext", filename: "sections/rich-text.liquid", css, bodyLiquid, schema }));
    },
  },

  collection_grid: {
    build(f) {
      const schema = {
        name: "Collection grid",
        settings: [
          { type: "collection", id: "collection", label: "Collection" },
          { type: "text", id: "heading", label: "Heading", default: "Shop the collection" },
          { type: "range", id: "products_to_show", label: "Products to show", min: 2, max: 12, step: 1, default: 8 },
          { type: "range", id: "columns_desktop", label: "Columns (desktop)", min: 2, max: 5, step: 1, default: 4 },
          { type: "checkbox", id: "show_price", label: "Show price", default: true },
          { type: "checkbox", id: "show_vendor", label: "Show vendor", default: false },
          { type: "text", id: "view_all_label", label: "“View all” label", default: "View all" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        presets: [{ name: "Collection grid" }],
      };
      const bodyLiquid = `  {%- assign fx_collection = section.settings.collection -%}
  <div class="fx-collection__inner fx-inner">
    <div class="fx-collection__head">
      <h2 class="fx-collection__heading">{{ section.settings.heading }}</h2>
      {%- if fx_collection -%}<a href="{{ fx_collection.url }}" class="fx-collection__viewall">{{ section.settings.view_all_label }}</a>{%- endif -%}
    </div>
    {%- if fx_collection -%}
      <div class="fx-collection__grid" style="--fx-cols: {{ section.settings.columns_desktop }};">
        {%- for product in fx_collection.products limit: section.settings.products_to_show -%}
          {%- assign fx_card_alt = product.featured_image.alt | default: product.title -%}
          <a href="{{ product.url }}" class="fx-collection__card">
            <div class="fx-collection__media">
              {%- if product.featured_image -%}
                {{ product.featured_image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '300,450,600,900', sizes: '(min-width: 750px) 25vw, 50vw', alt: fx_card_alt, class: 'fx-collection__img' }}
              {%- else -%}
                {{ 'product-1' | placeholder_svg_tag: 'fx-placeholder fx-collection__img' }}
              {%- endif -%}
            </div>
            {%- if section.settings.show_vendor and product.vendor != blank -%}<div class="fx-collection__vendor">{{ product.vendor }}</div>{%- endif -%}
            <div class="fx-collection__title">{{ product.title }}</div>
            {%- if section.settings.show_price -%}<div class="fx-collection__price">{{ product.price | money }}</div>{%- endif -%}
          </a>
        {%- endfor -%}
      </div>
    {%- else -%}
      <div class="fx-collection__empty">Select a collection in the theme editor to preview this section.</div>
    {%- endif -%}
  </div>`;
      const css = `
& .fx-collection__head{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; margin-bottom:24px; }
& .fx-collection__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0; }
& .fx-collection__viewall{ font-size:13.5px; font-weight:600; color:var(--fx-primary); text-decoration:none; white-space:nowrap; }
& .fx-collection__viewall:hover{ text-decoration:underline; }
& .fx-collection__grid{ display:grid; grid-template-columns:repeat(var(--fx-cols),1fr); gap:26px 18px; }
@media (max-width:749px){ & .fx-collection__grid{ grid-template-columns:repeat(2,1fr); } }
& .fx-collection__card{ color:inherit; text-decoration:none; display:block; }
& .fx-collection__img{ width:100%; height:auto; border-radius:10px; display:block; margin-bottom:10px; }
& .fx-collection__vendor{ font-size:11.5px; opacity:.6; text-transform:uppercase; letter-spacing:.03em; margin-bottom:3px; }
& .fx-collection__title{ font-size:14px; font-weight:600; margin-bottom:3px; }
& .fx-collection__price{ font-size:13.5px; opacity:.75; }
& .fx-collection__empty{ text-align:center; opacity:.6; padding:40px 0; font-size:14px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-collection", filename: "sections/collection-grid.liquid", css, bodyLiquid, schema }));
    },
  },

  logo_list: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const schema = {
        name: "Logo list",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `Trusted by teams like ${brand}` },
          { type: "checkbox", id: "grayscale", label: "Show logos in grayscale", default: true },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(48, 48),
        ],
        blocks: [
          {
            type: "logo",
            name: "Logo",
            settings: [
              { type: "image_picker", id: "image", label: "Logo image" },
              { type: "text", id: "alt", label: "Alt text", default: "Brand logo" },
              { type: "url", id: "link", label: "Link" },
            ],
          },
        ],
        presets: [{ name: "Logo list", blocks: [{ type: "logo" }, { type: "logo" }, { type: "logo" }, { type: "logo" }] }],
      };
      const bodyLiquid = `  <div class="fx-logos__inner fx-inner">
    <h2 class="fx-logos__heading">{{ section.settings.heading }}</h2>
    <div class="fx-logos__row{% if section.settings.grayscale %} fx-logos__row--gray{% endif %}">
      {%- for block in section.blocks -%}
        <div class="fx-logos__item" {{ block.shopify_attributes }}>
          {%- if block.settings.link != blank -%}<a href="{{ block.settings.link }}" class="fx-logos__link" aria-label="{{ block.settings.alt }}">{%- endif -%}
          {%- if block.settings.image -%}
            {{ block.settings.image | image_url: width: 1600 | image_tag: loading: 'lazy', widths: '160,240,320', alt: block.settings.alt, class: 'fx-logos__img' }}
          {%- else -%}
            {{ 'lifestyle-1' | placeholder_svg_tag: 'fx-placeholder fx-logos__img' }}
          {%- endif -%}
          {%- if block.settings.link != blank -%}</a>{%- endif -%}
        </div>
      {%- endfor -%}
    </div>
  </div>`;
      const css = `
& .fx-logos__heading{ text-align:center; font-size:15px; font-weight:600; opacity:.7; margin:0 0 26px; }
& .fx-logos__row{ display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:40px; }
& .fx-logos__img{ height:32px; width:auto; max-width:140px; object-fit:contain; display:block; }
& .fx-logos__row--gray .fx-logos__img{ filter:grayscale(1); opacity:.6; transition:filter .15s, opacity .15s; }
& .fx-logos__row--gray .fx-logos__item:hover .fx-logos__img{ filter:grayscale(0); opacity:1; }
`;
      return finalize(schema, buildSection({ prefix: "fx-logos", filename: "sections/logo-list.liquid", css, bodyLiquid, schema }));
    },
  },

  newsletter: {
    build(f) {
      const brand = f.brandName.trim() || "our list";
      const desc = f.desc.trim();
      const schema = {
        name: "Newsletter",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `Join ${brand}` },
          { type: "richtext", id: "subheading", label: "Subheading", default: `<p>${desc || "Get news, early access and offers."}</p>` },
          { type: "text", id: "placeholder_text", label: "Email field placeholder", default: "Email address" },
          { type: "text", id: "button_label", label: "Button label", default: "Subscribe" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(56, 56),
        ],
        presets: [{ name: "Newsletter" }],
      };
      const bodyLiquid = `  <div class="fx-newsletter__inner fx-inner">
    <h2 class="fx-newsletter__heading">{{ section.settings.heading }}</h2>
    {%- if section.settings.subheading != blank -%}<div class="fx-newsletter__sub">{{ section.settings.subheading }}</div>{%- endif -%}
    {%- form 'customer', id: 'FxNewsletterForm-' | append: section.id, class: 'fx-newsletter__form' -%}
      <input type="hidden" name="contact[tags]" value="newsletter">
      <label class="visually-hidden" for="FxNewsletterEmail-{{ section.id }}">{{ section.settings.placeholder_text }}</label>
      <input type="email" name="contact[email]" id="FxNewsletterEmail-{{ section.id }}" class="fx-newsletter__input" placeholder="{{ section.settings.placeholder_text }}" required>
      <button type="submit" class="fx-btn fx-newsletter__btn">{{ section.settings.button_label }}</button>
      {%- if form.posted_successfully? -%}
        <p class="fx-newsletter__success" role="status">Thanks — you’re subscribed.</p>
      {%- endif -%}
      {%- if form.errors -%}
        <p class="fx-newsletter__error" role="alert">{{ form.errors.messages.first }}</p>
      {%- endif -%}
    {%- endform -%}
  </div>`;
      const css = `
& .fx-newsletter__inner{ max-width:560px; text-align:center; }
& .fx-newsletter__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 10px; }
& .fx-newsletter__sub{ font-size:15px; opacity:.8; line-height:1.55; margin-bottom:22px; }
& .fx-newsletter__form{ display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
& .fx-newsletter__input{ flex:1; min-width:220px; font-size:14px; padding:13px 14px; border-radius:8px; border:1px solid rgba(0,0,0,.15); }
& .fx-newsletter__input:focus-visible{ outline:2px solid var(--fx-accent); outline-offset:2px; }
& .fx-newsletter__btn{ flex-shrink:0; }
& .fx-newsletter__success{ width:100%; color:var(--fx-primary); font-size:13.5px; margin-top:10px; }
& .fx-newsletter__error{ width:100%; color:#B23A3A; font-size:13.5px; margin-top:10px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-newsletter", filename: "sections/newsletter.liquid", css, bodyLiquid, schema }), [
        "Uses Shopify’s built-in customer form (contact[tags]=newsletter) — subscriptions post straight to your customer list, no JavaScript or app required.",
      ]);
    },
  },

  custom: {
    build(f) {
      const brand = f.brandName.trim() || "Your Brand";
      const desc = f.desc.trim();
      const schema = {
        name: "Custom section",
        settings: [
          { type: "text", id: "heading", label: "Heading", default: `${brand}` },
          { type: "richtext", id: "text", label: "Text", default: `<p>${desc || "Write your message here."}</p>` },
          { type: "select", id: "text_align", label: "Alignment", default: "center", options: [{ value: "center", label: "Center" }, { value: "left", label: "Left" }] },
          { type: "checkbox", id: "show_button", label: "Show button", default: false },
          { type: "text", id: "button_label", label: "Button label", default: "Learn more" },
          { type: "url", id: "button_link", label: "Button link" },
          ...commonColorSettings(f.primary, f.accent),
          ...commonPaddingSettings(64, 64),
        ],
        presets: [{ name: "Custom section" }],
      };
      const bodyLiquid = `  <div class="fx-richtext__inner fx-inner fx-richtext__inner--{{ section.settings.text_align }}">
    <h2 class="fx-richtext__heading">{{ section.settings.heading }}</h2>
    <div class="fx-richtext__text">{{ section.settings.text }}</div>
    {%- if section.settings.show_button and section.settings.button_label != blank -%}
      <a href="{{ section.settings.button_link }}" class="fx-btn">{{ section.settings.button_label }}</a>
    {%- endif -%}
  </div>`;
      const css = `
& .fx-richtext__inner{ max-width:680px; }
& .fx-richtext__inner--center{ text-align:center; margin-left:auto; margin-right:auto; }
& .fx-richtext__heading{ font-size:clamp(22px,3vw,30px); font-weight:700; margin:0 0 14px; }
& .fx-richtext__text{ font-size:15.5px; line-height:1.65; opacity:.85; margin-bottom:18px; }
`;
      return finalize(schema, buildSection({ prefix: "fx-richtext", filename: "sections/custom-section.liquid", css, bodyLiquid, schema }), [
        "“Custom” has no fixed offline template, so this is a flexible text block — switch to Online mode for a section built exactly to your description.",
      ]);
    },
  },
};

function generateOffline(f) {
  const tpl = OFFLINE_TYPES[f.type] || OFFLINE_TYPES.custom;
  const r = tpl.build(f);
  const ti = f.theme || {};
  const used = [];
  let l = r.liquid;
  const m = l.match(/<div class="(\S+) \1--\{\{ section\.id \}\}"/);
  const prefix = m && m[1];
  if (ti.container?.trim()) { l = l.replace(/class="fx-inner/g, `class="fx-inner ${ti.container.trim()}`); used.push("wrapper class"); }
  if (ti.button?.trim()) { l = l.replace(/class="fx-btn/g, `class="fx-btn ${ti.button.trim()}`); used.push("button class"); }
  if (prefix) {
    const sel = `.${prefix}--{{ section.id }}`;
    let extra = "";
    if (ti.bodyFont?.trim()) { extra += `${sel}{ font-family:${ti.bodyFont.trim()}; }\n`; used.push("body font"); }
    if (ti.headingFont?.trim()) { extra += `${sel} h1, ${sel} h2, ${sel} h3, ${sel} h4{ font-family:${ti.headingFont.trim()}; }\n`; used.push("heading font"); }
    if (extra) l = l.replace(/\n  <\/style>/, `\n${extra}  </style>`);
  }
  if (ti.name?.trim()) l = l.replace("Generated offline by Section Foundry — no AI used.", `Generated offline by Section Foundry for theme: ${ti.name.trim()}.`);
  r.liquid = l;
  if (used.length) r.notes = [...(r.notes || []), `Applied theme info: ${used.join(", ")}. CSS variables, sample code and extra rules are used in Online (AI) mode only.`];
  return splitOutput(r, f.opts || {});
}

/* Split a generated section into separate files: CSS asset, item snippet, or theme blocks. */
function splitOutput(r, opt) {
  const extra = [];
  const notes = [...(r.notes || [])];
  let l = r.liquid;
  const m = l.match(/<div class="(\S+) \1--\{\{ section\.id \}\}"/);
  const prefix = m && m[1];
  const base = r.filename.split("/").pop().replace(/\.liquid$/, "");
  const loopRe = /([ \t]*)\{%-\s*for block in section\.blocks\s*-%\}([\s\S]*?)\{%-\s*endfor\s*-%\}/;
  const lm = l.match(loopRe);
  const sm = l.match(/\{% schema %\}\s*([\s\S]*?)\s*\{% endschema %\}/);
  const dedent = (t) => {
    const lines = t.replace(/^\n+|\s+$/g, "").split("\n");
    const ind = Math.min(...lines.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length));
    return lines.map((x) => x.slice(ind)).join("\n");
  };
  if ((opt.blocks || opt.snippet) && !lm) notes.push("This section type has no repeated items, so the blocks/snippet split was skipped.");
  else if (opt.blocks && lm && sm) {
    const schema = JSON.parse(sm[1]);
    const blk = schema.blocks && schema.blocks[0];
    const type = `${prefix}-${blk.type.replace(/_/g, "-")}`;
    extra.push({
      filename: `blocks/${type}.liquid`,
      liquid: `${dedent(lm[2])}\n\n{% schema %}\n${JSON.stringify({ name: blk.name, settings: blk.settings }, null, 2)}\n{% endschema %}\n`,
    });
    schema.blocks = [{ type: "@theme" }];
    if (schema.presets) schema.presets = schema.presets.map((p) => ({ ...p, blocks: (p.blocks || []).map(() => ({ type })) }));
    l = l
      .replace(loopRe, (_, ind) => `${ind}{% content_for 'blocks' %}`)
      .replace(sm[0], () => `{% schema %}\n${JSON.stringify(schema, null, 2)}\n{% endschema %}`);
    notes.push(`Items are now theme blocks (blocks/${type}.liquid) rendered with content_for 'blocks'.`);
  } else if (opt.snippet && lm) {
    const name = `${base}-item`;
    extra.push({
      filename: `snippets/${name}.liquid`,
      liquid: `{% doc %}\n  Markup for one ${base} item.\n  @param {object} block - the section block to render\n{% enddoc %}\n\n${dedent(lm[2])}\n`,
    });
    l = l.replace(loopRe, (_, ind) => `${ind}{%- for block in section.blocks -%}\n${ind}  {% render '${name}', block: block %}\n${ind}{%- endfor -%}`);
    notes.push(`Item markup moved to snippets/${name}.liquid.`);
  }
  if (opt.css && prefix) {
    const cm = l.match(/ *<style>\n([\s\S]*?)\n *<\/style>/);
    if (cm) {
      const css = dedent(cm[1]).split(`.${prefix}--{{ section.id }}`).join(`.${prefix}`);
      if (/\{\{|\{%/.test(css)) notes.push("The CSS contains Liquid, so it stayed inline.");
      else {
        const file = `section-${base}.css`;
        extra.push({ filename: `assets/${file}`, liquid: css + "\n" });
        l = l.replace(cm[0], () => `  {{ '${file}' | asset_url | stylesheet_tag }}`);
        notes.push(`CSS moved to assets/${file}.`);
      }
    }
  }
  return { ...r, liquid: l, notes, files: [{ filename: r.filename, liquid: l }, ...extra] };
}

/* ---------- helpers ---------- */
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlight(code) {
  let s = escapeHtml(code);
  s = s.replace(/(\{%-?[\s\S]*?-?%\})/g, '<span class="lq-tag">$1</span>');
  s = s.replace(/(\{\{-?[\s\S]*?-?\}\})/g, '<span class="lq-out">$1</span>');
  s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="lq-com">$1</span>');
  return s;
}
function parseResult(text) {
  let t = text.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  try {
    if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
    const o = JSON.parse(t);
    return {
      filename: o.filename || "sections/custom-section.liquid",
      liquid: o.liquid || "",
      files: [{ filename: o.filename || "sections/custom-section.liquid", liquid: o.liquid || "" }].concat(
        (Array.isArray(o.files) ? o.files : []).filter((x) => x && x.filename && (x.content || x.liquid)).map((x) => ({ filename: x.filename, liquid: x.content || x.liquid }))
      ),
      settingsSummary: Array.isArray(o.settingsSummary) ? o.settingsSummary : [],
      notes: Array.isArray(o.notes) ? o.notes : [],
    };
  } catch (e) {
    return {
      filename: "sections/custom-section.liquid",
      liquid: text,
      settingsSummary: [],
      notes: ["Returned as raw code — the structured response couldn’t be parsed, so double-check for a clean cut-off at the end."],
    };
  }
}

/* ---------- small icon ---------- */
function Check({ c = T.primary }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 8.5l3 3 7-7.5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LS_MODE = "sf_mode";
const LS_API_KEY = "sf_api_key";
const LS_MODEL = "sf_model";

function readLS(key, fallback) {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

export default function App() {
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("hero");
  const [target, setTarget] = useState("horizon");
  const [brandName, setBrandName] = useState("");
  const [primary, setPrimary] = useState("#0E6E56");
  const [accent, setAccent] = useState("#E4B363");
  const [voice, setVoice] = useState("");
  const [useVoice, setUseVoice] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [themeOpen, setThemeOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(readLS("sf_theme", "{}")) || {}; } catch (e) { return {}; }
  });
  const setT = (k) => (e) => setTheme((t) => ({ ...t, [k]: e.target.value }));
  useEffect(() => { try { window.localStorage.setItem("sf_theme", JSON.stringify(theme)); } catch (e) {} }, [theme]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fileIdx, setFileIdx] = useState(0);
  const [opts, setOpts] = useState(() => {
    try { return JSON.parse(readLS("sf_opts", "{}")) || {}; } catch (e) { return {}; }
  });
  useEffect(() => { try { window.localStorage.setItem("sf_opts", JSON.stringify(opts)); } catch (e) {} }, [opts]);
  const toggleOpt = (k) => setOpts((o) => ({ ...o, [k]: !o[k], ...(k === "blocks" && !o.blocks ? { snippet: false } : {}), ...(k === "snippet" && !o.snippet ? { blocks: false } : {}) }));
  const files = result ? (result.files && result.files.length ? result.files : [{ filename: result.filename, liquid: result.liquid }]) : [];
  const active = files[Math.min(fileIdx, files.length - 1)] || null;

  const [mode, setMode] = useState(() => readLS(LS_MODE, ENV_API_KEY ? "online" : "offline"));
  const [apiKey, setApiKey] = useState(() => readLS(LS_API_KEY, "") || ENV_API_KEY);
  const [model, setModel] = useState(() => ENV_MODEL || readLS(LS_MODEL, FREE_MODEL_PRESETS[0][0]));

  const [refImg, setRefImg] = useState(null); // { dataUrl, colors, name }
  const [dragOver, setDragOver] = useState(false);
  async function pickImage(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file (PNG, JPG, WebP…)."); return; }
    try {
      const r = await loadImage(file);
      setRefImg({ ...r, name: file.name });
      setError("");
    } catch (e) { setError(e.message); }
  }

  useEffect(() => {
    const onPaste = (e) => {
      const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
      if (item) { e.preventDefault(); pickImage(item.getAsFile()); }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  useEffect(() => { try { window.localStorage.setItem(LS_MODE, mode); } catch (e) {} }, [mode]);
  useEffect(() => { try { window.localStorage.setItem(LS_API_KEY, apiKey); } catch (e) {} }, [apiKey]);
  useEffect(() => { try { window.localStorage.setItem(LS_MODEL, model); } catch (e) {} }, [model]);

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);
    setFileIdx(0);
    setCopied(false);
    const f = { desc, type, target, brandName, primary, accent, voice, useVoice, theme, opts, image: mode === "online" && refImg ? refImg.dataUrl : null };
    try {
      if (mode === "online") {
        if (!apiKey.trim()) throw new Error("Add a free OpenRouter API key first (openrouter.ai/keys), or switch to Offline mode.");
        const r = await generateOnline(f, apiKey.trim(), model.trim() || FREE_MODEL_PRESETS[0][0]);
        setResult(r);
      } else {
        const r = generateOffline(f);
        setResult(r);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    if (!active) return;
    navigator.clipboard.writeText(active.liquid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }
  const [sent, setSent] = useState("");
  async function sendToTheme() {
    if (!result) return;
    try {
      const r = await fetch("/__theme/write", { method: "POST", body: JSON.stringify({ files }) });
      const j = await r.json();
      setSent(j.ok ? "Saved " + files.length + " file(s)" : j.error || "Failed");
    } catch (e) { setSent("Dev server only"); }
    setTimeout(() => setSent(""), 2500);
  }
  function download() {
    if (!result) return;
    const blob = new Blob([active.liquid], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = active.filename.split("/").pop() || "section.liquid";
    a.click();
    URL.revokeObjectURL(url);
  }

  const canGo = (desc.trim().length > 0 || (mode === "online" && !!refImg)) && !loading;

  return (
    <div className="sf-root" style={{ background: T.paper, minHeight: "100%", padding: "26px 22px 40px" }}>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* header */}
        <header style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="sf-code" style={{ color: T.codeTag, fontSize: 18, fontWeight: 600 }}>{"{%"}</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.01em" }}>Section Foundry</div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 1 }}>Production-ready Shopify sections — works offline, or online with a free AI model.</div>
          </div>
        </header>

        <div className="sf-grid">
          {/* ---------- left: the brief ---------- */}
          <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, padding: 20 }}>
            <div className="sf-field">
              <label className="sf-label">Generation mode</label>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className={"sf-btn sf-mode" + (mode === "offline" ? " sf-mode-active" : "")} onClick={() => setMode("offline")}>
                  ⚡ Offline
                </button>
                <button type="button" className={"sf-btn sf-mode" + (mode === "online" ? " sf-mode-active" : "")} onClick={() => setMode("online")}>
                  🌐 Online (free AI)
                </button>
              </div>
              <div className="sf-hint">
                {mode === "offline"
                  ? "Rule-based template, no internet or API key needed — works anywhere."
                  : "Calls a free model through OpenRouter's OpenAI-compatible API. Needs a free key."}
              </div>
            </div>

            {mode === "online" && (
              <div style={{ background: T.primarySoft, border: `1px solid ${T.line}`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div className="sf-field" style={{ marginBottom: 10 }}>
                  <label className="sf-label" htmlFor="apiKey">OpenRouter API key</label>
                  <input
                    id="apiKey"
                    type="password"
                    className="sf-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-…"
                  />
                  <div className="sf-hint">
                    Free at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai/keys</a>. Stored only in this browser.
                  </div>
                </div>
                <div className="sf-field" style={{ marginBottom: 0 }}>
                  <label className="sf-label" htmlFor="model">Model</label>
                  <input id="model" className="sf-input" list="freeModels" value={model} onChange={(e) => setModel(e.target.value)} placeholder={FREE_MODEL_PRESETS[0][0]} />
                  <datalist id="freeModels">
                    {FREE_MODEL_PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </datalist>
                  <div className="sf-hint">
                    Any slug ending in <span className="sf-code">:free</span> works. Browse more at{" "}
                    <a href="https://openrouter.ai/models?max_price=0" target="_blank" rel="noreferrer">openrouter.ai/models?max_price=0</a>.
                  </div>
                </div>
              </div>
            )}

            <div className="sf-field">
              <label className="sf-label" htmlFor="desc">What should this section do?</label>
              <textarea
                id="desc"
                className="sf-textarea"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. A hero for a specialty coffee brand — large heading, one line of subtext, an email capture, and a lifestyle image on the right. Warm, confident tone."
              />
            </div>

            <div className="sf-field">
              <label className="sf-label" htmlFor="refimg">Reference image <span style={{ color: T.faint, fontWeight: 400 }}>· optional, design a similar section</span></label>
              {refImg ? (
                <div style={{ border: `1px solid ${T.line}`, borderRadius: 10, padding: 10, background: "#fff" }}>
                  <img src={refImg.dataUrl} alt="Reference design" style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6, background: T.paper, display: "block" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: T.muted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{refImg.name}</span>
                    {refImg.colors && (
                      <button type="button" className="sf-btn sf-mode" style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }} onClick={() => { setPrimary(refImg.colors[0]); setAccent(refImg.colors[1]); }}>
                        {refImg.colors.map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: `1px solid ${T.line}` }} />)}
                        Use colours
                      </button>
                    )}
                    <button type="button" className="sf-btn sf-mode" style={{ flex: "none" }} onClick={() => setRefImg(null)}>Remove</button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="refimg"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); pickImage(e.dataTransfer.files[0]); }}
                  style={{ display: "block", border: `1.5px dashed ${dragOver ? T.primary : T.line}`, background: dragOver ? T.primarySoft : "#fff", borderRadius: 10, padding: "16px 12px", textAlign: "center", fontSize: 13, color: T.muted, cursor: "pointer" }}
                >
                  Drop a screenshot here, paste, or <span style={{ color: T.primary, fontWeight: 600 }}>browse</span>
                </label>
              )}
              <input id="refimg" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { pickImage(e.target.files[0]); e.target.value = ""; }} />
              <div className="sf-hint">
                {mode === "online"
                  ? <>The AI copies its layout and style. Needs a model that reads images — e.g. <a href="#" onClick={(e) => { e.preventDefault(); setModel(VISION_MODEL); }}>{VISION_MODEL}</a>.</>
                  : "Offline mode can’t read layouts — it can only pick up the image’s colours. Switch to Online to design from the image."}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div className="sf-field" style={{ flex: 1 }}>
                <label className="sf-label" htmlFor="type">Section type</label>
                <select id="type" className="sf-select" value={type} onChange={(e) => setType(e.target.value)}>
                  {SECTION_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="sf-field" style={{ flex: 1 }}>
                <label className="sf-label" htmlFor="target">Target theme</label>
                <select id="target" className="sf-select" value={target} onChange={(e) => setTarget(e.target.value)}>
                  {THEMES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* brand */}
            <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 4, paddingTop: 16 }}>
              <button className="sf-collapse" onClick={() => setBrandOpen((o) => !o)} aria-expanded={brandOpen}>
                <span>Brand details <span style={{ color: T.faint, fontWeight: 400 }}>· optional</span></span>
                <span style={{ color: T.muted, transform: brandOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▾</span>
              </button>

              {brandOpen && (
                <div style={{ marginTop: 14 }}>
                  <div className="sf-field">
                    <label className="sf-label" htmlFor="brand">Brand / product name</label>
                    <input id="brand" className="sf-input" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Pastel Roast" />
                  </div>
                  <div className="sf-field">
                    <label className="sf-label">Colours</label>
                    <div style={{ display: "flex", gap: 16 }}>
                      {[["Primary", primary, setPrimary], ["Accent", accent, setAccent]].map(([lbl, val, set]) => (
                        <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input type="color" className="sf-swatch" value={val} onChange={(e) => set(e.target.value)} aria-label={lbl + " colour"} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{lbl}</div>
                            <div className="sf-code" style={{ fontSize: 11.5, color: T.muted }}>{val.toUpperCase()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sf-field" style={{ marginBottom: 10 }}>
                    <label className="sf-label" htmlFor="voice">Brand voice</label>
                    <input id="voice" className="sf-input" value={voice} onChange={(e) => setVoice(e.target.value)} placeholder="Calm, precise, a little playful" />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.muted, cursor: "pointer" }}>
                    <input type="checkbox" checked={useVoice} onChange={(e) => setUseVoice(e.target.checked)} style={{ accentColor: T.primary, width: 15, height: 15 }} disabled={mode === "offline"} />
                    Write placeholder copy in this voice{mode === "offline" ? " (online mode only)" : ""}
                  </label>
                </div>
              )}
            </div>

            {/* output structure */}
            <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 16, paddingTop: 16 }}>
              <div className="sf-label">Output files <span style={{ color: T.faint, fontWeight: 400 }}>· optional, keep unticked for one file</span></div>
              {[["css", "Separate CSS file", "assets/section-….css, linked with stylesheet_tag"],
                ["snippet", "Snippet for repeated items", "snippets/…-item.liquid, called with render"],
                ["blocks", "Theme blocks", "blocks/….liquid with own schema, rendered by content_for"]].map(([k, l, d]) => (
                <label key={k} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, marginBottom: 7, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!opts[k]} onChange={() => toggleOpt(k)} style={{ accentColor: T.primary, width: 15, height: 15, marginTop: 2 }} />
                  <span><b style={{ fontWeight: 600 }}>{l}</b><br /><span style={{ color: T.muted, fontSize: 12 }}>{d}</span></span>
                </label>
              ))}
            </div>

            {/* theme info */}
            <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 16, paddingTop: 16 }}>
              <button className="sf-collapse" onClick={() => setThemeOpen((o) => !o)} aria-expanded={themeOpen}>
                <span>Theme info <span style={{ color: T.faint, fontWeight: 400 }}>· so the section matches your theme</span></span>
                <span style={{ color: T.muted, transform: themeOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▾</span>
              </button>
              {themeOpen && (
                <div style={{ marginTop: 14 }}>
                  <div className="sf-field">
                    <label className="sf-label" htmlFor="tname">Theme name</label>
                    <input id="tname" className="sf-input" value={theme.name || ""} onChange={setT("name")} placeholder="Dawn, Horizon, Impulse, custom…" />
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div className="sf-field" style={{ flex: 1 }}>
                      <label className="sf-label" htmlFor="tcont">Wrapper class</label>
                      <input id="tcont" className="sf-input" value={theme.container || ""} onChange={setT("container")} placeholder="page-width" />
                    </div>
                    <div className="sf-field" style={{ flex: 1 }}>
                      <label className="sf-label" htmlFor="tbtn">Button class</label>
                      <input id="tbtn" className="sf-input" value={theme.button || ""} onChange={setT("button")} placeholder="button button--primary" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div className="sf-field" style={{ flex: 1 }}>
                      <label className="sf-label" htmlFor="thf">Heading font</label>
                      <input id="thf" className="sf-input" value={theme.headingFont || ""} onChange={setT("headingFont")} placeholder="var(--font-heading-family)" />
                    </div>
                    <div className="sf-field" style={{ flex: 1 }}>
                      <label className="sf-label" htmlFor="tbf">Body font</label>
                      <input id="tbf" className="sf-input" value={theme.bodyFont || ""} onChange={setT("bodyFont")} placeholder="var(--font-body-family)" />
                    </div>
                  </div>
                  <div className="sf-field">
                    <label className="sf-label" htmlFor="tvars">CSS variables <span style={{ color: T.faint, fontWeight: 400 }}>· AI mode</span></label>
                    <input id="tvars" className="sf-input" value={theme.cssVars || ""} onChange={setT("cssVars")} placeholder="--color-base-text, --color-button, --page-width" />
                  </div>
                  <div className="sf-field">
                    <label className="sf-label" htmlFor="trules">Other conventions <span style={{ color: T.faint, fontWeight: 400 }}>· AI mode</span></label>
                    <textarea id="trules" className="sf-textarea" style={{ minHeight: 60 }} value={theme.rules || ""} onChange={setT("rules")} placeholder="e.g. use color_scheme settings, BEM class names, snippets for buttons…" />
                  </div>
                  <div className="sf-field" style={{ marginBottom: 0 }}>
                    <label className="sf-label" htmlFor="tsample">Paste an existing section from the theme <span style={{ color: T.faint, fontWeight: 400 }}>· AI mode</span></label>
                    <textarea id="tsample" className="sf-textarea sf-code" style={{ fontSize: 12 }} value={theme.sample || ""} onChange={setT("sample")} placeholder="{% schema %} … paste a section file so the AI copies its style" />
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 20 }}>
              <button className="sf-btn sf-btn-primary" onClick={generate} disabled={!canGo}>
                {loading ? <><span className="sf-spin" /> Forging section…</> : "Generate section"}
              </button>
              {error && (
                <div style={{ marginTop: 12, background: "#FBECEC", border: "1px solid #F0C9C9", color: T.danger, fontSize: 13, borderRadius: 8, padding: "10px 12px", lineHeight: 1.45 }}>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* ---------- right: the output ---------- */}
          <div>
            <div className="sf-scroll" style={{ background: T.codeBg, borderRadius: 14, border: "1px solid #1C2A25", overflow: "hidden" }}>
              {/* slab top bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #1C2A25" }}>
                <div className="sf-code" style={{ fontSize: 12.5, color: result ? T.codeInk : T.codeCom }}>
                  {active ? active.filename : "sections/…"}
                </div>
                {result && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="sf-btn sf-btn-ghost" onClick={copyCode}>{copied ? "Copied ✓" : "Copy"}</button>
                    <button className="sf-btn sf-btn-ghost" onClick={sendToTheme}>{sent || "Send to theme/"}</button>
                    <button className="sf-btn sf-btn-ghost" onClick={download}>Download .liquid</button>
                  </div>
                )}
              </div>

              {files.length > 1 && (
                <div style={{ display: "flex", gap: 4, padding: "8px 10px 0", borderBottom: "1px solid #1C2A25", overflowX: "auto" }}>
                  {files.map((fl, i) => (
                    <button key={fl.filename} onClick={() => setFileIdx(i)} className="sf-btn sf-code" style={{ fontSize: 11.5, padding: "6px 10px", borderRadius: "6px 6px 0 0", background: i === fileIdx ? "#182420" : "transparent", color: i === fileIdx ? T.codeInk : T.codeCom, whiteSpace: "nowrap" }}>{fl.filename}</button>
                  ))}
                </div>
              )}

              {/* slab body */}
              <div className="sf-scroll" style={{ maxHeight: 560, overflow: "auto", padding: "16px 16px 20px" }}>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 13, color: T.codeCom, marginBottom: 6 }} className="sf-code">building schema · scoping styles · wiring settings…</div>
                    {[92, 74, 60, 84, 48, 70, 88, 55].map((w, i) => <div key={i} className="sf-skel" style={{ width: w + "%" }} />)}
                  </div>
                ) : result ? (
                  <pre className="sf-code" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.62, color: T.codeInk, whiteSpace: "pre", tabSize: 2 }}>
                    <code dangerouslySetInnerHTML={{ __html: highlight(active.liquid) }} />
                  </pre>
                ) : (
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.codeInk }}>Your section lands here.</div>
                    <div style={{ fontSize: 13, color: "#93a69d", marginTop: 6, marginBottom: 16, lineHeight: 1.5 }}>
                      Describe it on the left and hit Generate. The difference from a raw prompt is that every choice comes back wired to an editor setting — like this:
                    </div>
                    <pre className="sf-code" style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: T.codeInk, whiteSpace: "pre", background: "#0A110E", border: "1px solid #1C2A25", borderRadius: 8, padding: 12 }}>
                      <code dangerouslySetInnerHTML={{ __html: highlight(SAMPLE) }} />
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* settings summary from the model */}
            {result && result.settingsSummary.length > 0 && (
              <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px", marginTop: 14 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Editor settings in this section</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.settingsSummary.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: T.muted, lineHeight: 1.45 }}>
                      <Check /><span>{s}</span>
                    </div>
                  ))}
                </div>
                {result.notes.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${T.line}`, paddingTop: 10, fontSize: 12.5, color: T.faint, lineHeight: 1.5 }}>
                    {result.notes.map((n, i) => <div key={i}>· {n}</div>)}
                  </div>
                )}
              </div>
            )}

            {/* the standing guarantee */}
            <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "16px 18px", marginTop: 14 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>Every file is built to ship</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                {GUARANTEES.map(([h, d]) => (
                  <div key={h} style={{ display: "flex", gap: 9 }}>
                    <Check />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h}</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2, lineHeight: 1.4 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
