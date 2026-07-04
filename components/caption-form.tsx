"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

export function CaptionForm() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed");
      setOutput(data.output);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <form onSubmit={generate} className="card p-5 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Reel topic</label>
          <p className="text-xs text-muted mt-0.5">
            Describe what the reel is about. The caption follows your saved
            structure (editable in Settings).
          </p>
        </div>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={5}
          placeholder="e.g. 3 morning habits that doubled my productivity as a founder"
          className="input resize-none"
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="btn brand-gradient btn-primary"
        >
          <Sparkles size={16} />
          {loading ? "Writing…" : "Write caption"}
        </button>
        {error && <p className="text-sm text-danger">{error}</p>}
      </form>

      <div className="card p-5 flex flex-col gap-3 min-h-[280px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Generated caption</span>
          {output && (
            <button
              onClick={copy}
              className="btn btn-secondary py-1.5 px-3 text-xs"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        {output ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
            {output}
          </pre>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-sm text-[var(--muted-2)]">
            Your caption will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
