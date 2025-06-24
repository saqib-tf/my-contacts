"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { State } from "@/lib/schema";

export type StateFormProps = {
  initial?: Partial<State>;
  onSubmit: (data: { name: string }) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function StateForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: StateFormProps) {
  const [name, setName] = useState(initial.name || "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!name.trim()) {
          setError("Name is required.");
          return;
        }
        try {
          await onSubmit({ name: name.trim() });
        } catch (err: any) {
          setError(err?.message || "Failed to save state.");
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={64}
          required
          autoFocus
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
