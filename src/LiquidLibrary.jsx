import React, { useMemo, useState } from "react";
import { OBJECTS, TAGS, FILTERS, RULES, CLI } from "./liquidReference.js";
import { CODE, VIDEOS } from "./liquidCode.js";

const C = { ink: "#14201C", muted: "#5F6F69", line: "#D8E0DC", primary: "#0E6E56", soft: "#E7F0EC", code: "#0D1613", codeInk: "#D6E4DD" };

const TABS = [
  ["all", "All"],
  ["code", "Code"],
  ["objects", "Objects"],
  ["tags", "Tags"],
  ["filters", "Filters"],
  ["rules", "Rules"],
  ["cli", "CLI"],
  ["learn", "Docs & videos"],
];

function CodeCard({ group, title, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1000); });
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, marginTop: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: C.soft }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{title} <span style={{ fontSize: 10.5, color: C.primary, marginLeft: 6 }}>{group}</span></div>
        <button className="sf-btn" onClick={copy} style={{ fontSize: 11.5, padding: "4px 9px", background: "#fff", color: C.primary }}>{copied ? "Copied ✓" : "Copy"}</button>
      </div>
      <pre className="sf-code" style={{ margin: 0, padding: 12, background: C.code, color: C.codeInk, fontSize: 12, lineHeight: 1.55, overflow: "auto" }}>{code}</pre>
    </div>
  );
}

function Row({ name, usage, desc, badge, href }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(usage).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1000); });
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,190px) 1fr auto", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.line}`, alignItems: "start" }}>
      <div style={{ fontWeight: 600, fontSize: 13.5, wordBreak: "break-word" }}>
        {href ? <a href={href} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{name}</a> : name} {badge && <span style={{ fontSize: 10.5, color: C.primary, background: C.soft, borderRadius: 4, padding: "1px 6px", marginLeft: 4 }}>{badge}</span>}
      </div>
      <div>
        <code className="sf-code" style={{ fontSize: 12, background: C.code, color: C.codeInk, padding: "3px 7px", borderRadius: 5, display: "inline-block", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{usage}</code>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.45 }}>{desc}</div>
      </div>
      <button className="sf-btn" onClick={copy} style={{ fontSize: 11.5, padding: "4px 9px", background: C.soft, color: C.primary }}>{copied ? "✓" : "Copy"}</button>
    </div>
  );
}

export default function LiquidLibrary() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const query = q.trim().toLowerCase();
  const hit = (...s) => !query || s.join(" ").toLowerCase().includes(query);

  const data = useMemo(() => ({
    objects: OBJECTS.filter(([n, u, d]) => hit(n, u, d)).map(([n, u, d]) => ({ name: n, usage: u, desc: d, badge: "object", href: /^[a-z_]+$/.test(n) ? "https://shopify.dev/docs/api/liquid/objects/" + n : undefined })),
    tags: TAGS.filter(([n, u, g, d]) => hit(n, u, g, d)).map(([n, u, g, d]) => ({ name: n, usage: u, desc: d, badge: "tag · " + g })),
    filters: FILTERS.filter(([n, u, g, d]) => hit(n, u, g, d)).map(([n, u, g, d]) => ({ name: n, usage: u, desc: d, badge: "filter · " + g })),
    rules: RULES.map((r) => ({ ...r, items: r.items.filter((i) => hit(r.group, i)) })).filter((r) => r.items.length),
    code: CODE.filter(([g, t, c]) => hit(g, t, c)),
    learn: VIDEOS.filter(([t, u]) => hit(t, u)),
    cli: CLI.filter(([c, d]) => hit(c, d)),
  }), [query]);

  const show = (k) => tab === "all" || tab === k;
  const total = data.code.length + data.learn.length + data.objects.length +data.tags.length + data.filters.length + data.cli.length + data.rules.reduce((a, r) => a + r.items.length, 0);

  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
      <input
        className="sf-input"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search objects, tags, filters, rules…  e.g. image_url, forloop, metafield, schema"
        aria-label="Search Liquid reference"
      />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0 6px" }}>
        {TABS.map(([k, l]) => (
          <button key={k} className={"sf-btn sf-mode" + (tab === k ? " sf-mode-active" : "")} style={{ flex: "0 0 auto", padding: "6px 12px" }} onClick={() => setTab(k)}>{l}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted, alignSelf: "center" }}>{total} results</span>
      </div>

      {show("code") && data.code.map(([g, t, c]) => <CodeCard key={g + t} group={g} title={t} code={c} />)}
      {show("learn") && (
        <div style={{ marginTop: 10 }}>
          {data.learn.map(([t, u]) => (
            <div key={u} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13.5 }}>
              <a href={u} target="_blank" rel="noreferrer" style={{ color: C.primary, fontWeight: 600 }}>{u.includes("youtube") ? "▶ " : "📄 "}{t}</a>
            </div>
          ))}
        </div>
      )}
      {show("objects") && data.objects.map((r) => <Row key={"o" + r.name} {...r} />)}
      {show("tags") && data.tags.map((r) => <Row key={"t" + r.name} {...r} />)}
      {show("filters") && data.filters.map((r) => <Row key={"f" + r.name} {...r} />)}
      {show("cli") && data.cli.map(([c, d]) => <Row key={"c" + c} name="CLI" usage={c} desc={d} badge="shopify" />)}
      {show("rules") && data.rules.map((r) => (
        <div key={r.group} style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.primary, marginBottom: 4 }}>{r.group}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: C.ink }}>
            {r.items.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      ))}
      {total === 0 && <div style={{ padding: 20, color: C.muted, fontSize: 13 }}>Nothing matches “{q}”. Try a shorter term.</div>}
      <div style={{ marginTop: 16, fontSize: 12, color: C.muted }}>
        Full docs: <a href="https://shopify.dev/docs/api/liquid" target="_blank" rel="noreferrer" style={{ color: C.primary }}>shopify.dev/docs/api/liquid</a>
      </div>
    </div>
  );
}
