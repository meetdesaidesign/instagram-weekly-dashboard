"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Textarea } from "@/components/ui";

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

  async function save() {
    setSaving(true);
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
      toast.success("Caption structure saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Caption structure"
        description="The exact instructions and structure the AI follows when writing captions from a topic."
      >
        <Textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={12}
          className="resize-y font-mono text-xs leading-relaxed"
        />
      </Field>
      <Field
        label="Example captions (optional)"
        description="Paste a few of your best captions so the AI matches your voice."
      >
        <Textarea
          value={examples}
          onChange={(e) => setExamples(e.target.value)}
          rows={6}
          placeholder="Paste 1-3 example captions here…"
          className="resize-y"
        />
      </Field>
      <Button
        variant="primary"
        onClick={save}
        disabled={saving}
        className="self-start"
      >
        <Save size={14} />
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function DisconnectButton() {
  return (
    <form action="/api/instagram/disconnect" method="post">
      <Button type="submit" variant="danger">
        Disconnect
      </Button>
    </form>
  );
}
