"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      gap={8}
      icons={{
        success: <CheckCircle2 size={16} color="var(--success)" />,
        error: <AlertCircle size={16} color="var(--danger)" />,
        warning: <TriangleAlert size={16} color="var(--warning)" />,
        info: <Info size={16} color="var(--muted)" />,
      }}
      toastOptions={{
        style: {
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-modal, 12px)",
          color: "var(--foreground)",
          fontSize: "13px",
        },
      }}
    />
  );
}
