import React, { useState } from "react";
import SectionGenerator from "./SectionGenerator.jsx";
import LiquidLibrary from "./LiquidLibrary.jsx";
import KeyPoints from "./KeyPoints.jsx";

export default function App() {
  const [view, setView] = useState("generator");
  return (
    <div style={{ background: "#EDF1EF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "16px 22px 0", display: "flex", gap: 8, fontFamily: "system-ui, sans-serif" }}>
        {[["generator", "Section generator"], ["library", "Liquid library"], ["keypoints", "Key points"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{ cursor: "pointer", padding: "8px 14px", borderRadius: 8, border: "1px solid #D8E0DC", background: view === k ? "#14201C" : "#fff", color: view === k ? "#fff" : "#14201C", fontWeight: 600, fontSize: 13 }}>{l}</button>
        ))}
      </div>
      {view === "generator" ? (
        <SectionGenerator />
      ) : view === "keypoints" ? (
        <KeyPoints />
      ) : (
        <div className="sf-root" style={{ maxWidth: 1140, margin: "0 auto", padding: "16px 22px 40px" }}>
          <style>{`.sf-root *{box-sizing:border-box}.sf-input{width:100%;font:inherit;font-size:14px;border:1px solid #D8E0DC;border-radius:8px;padding:10px 12px}.sf-btn{font-family:inherit;cursor:pointer;border:none;border-radius:8px;font-weight:600}.sf-mode{border:1px solid #D8E0DC;background:#fff;color:#14201C;font-size:12.5px}.sf-mode-active{background:#14201C;color:#fff}.sf-code{font-family:ui-monospace,Consolas,monospace}`}</style>
          <LiquidLibrary />
        </div>
      )}
    </div>
  );
}
