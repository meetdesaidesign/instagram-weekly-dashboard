"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export function CaptionTemplateForm({
  initialTemplate,
  initialExamples,
}: {
  initialTemplate: string;
  initialExamples: string;
}) {
  const [template, setTemplate] = useState(initialTemplate);
  const [examples, setExamples] = useState(initialExamples);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captionTemplate: template,
          captionExamples: examples,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed");
      setMsg("Saved");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium">Caption structure</label>
        <p className="text-xs text-muted mt-0.5">
          The exact instructions and structure the AI follows when writing
          captions from a topic.
        </p>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={12}
          className="input resize-y mt-2 font-mono text-xs leading-relaxed"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Example captions (optional)</label>
        <p className="text-xs text-muted mt-0.5">
          Paste a few of your best captions so the AI matches your voice.
        </p>
        <textarea
          value={examples}
          onChange={(e) => setExamples(e.target.value)}
          rows={6}
          placeholder="Paste 1-3 example captions here…"
          className="input resize-y mt-2 text-sm"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="btn brand-gradient btn-primary self-start"
        >
          <Save size={16} />
          {saving ? "Saving…" : "Save"}
        </button>
        {msg && <span className="text-xs text-muted">{msg}</span>}
      </div>
    </div>
  );
}

export function DisconnectButton() {
  return (
    <form action="/api/instagram/disconnect" method="post">
      <button type="submit" className="btn btn-secondary text-danger">
        Disconnect
      </button>
    </form>
  );
}
