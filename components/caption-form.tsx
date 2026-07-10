"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Field, Textarea } from "@/components/ui";

export function CaptionForm() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
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
      toast.error(e instanceof Error ? e.message : "Failed to generate");
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
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <form onSubmit={generate} className="flex flex-col gap-4">
          <Field
            label="Reel topic"
            description="Describe what the reel is about. The caption follows your saved structure (editable in Settings)."
          >
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={5}
              placeholder="e.g. 3 morning habits that doubled my productivity as a founder"
              className="resize-none"
            />
          </Field>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !topic.trim()}
          >
            <Sparkles size={14} />
            {loading ? "Writing…" : "Write caption"}
          </Button>
        </form>
      </Card>

      <Card className="flex min-h-[280px] flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-foreground">
            Generated caption
          </span>
          {output && (
            <Button size="sm" onClick={copy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
        {output ? (
          <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground">
            {output}
          </pre>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-[13px] text-muted-2">
            Your caption will appear here.
          </div>
        )}
      </Card>
    </div>
  );
}
