"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gender } from "@/lib/schema";

export type GenderFormProps = {
  initial?: Partial<Gender>;
  onSubmit: (data: { code: string; name: string }) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function GenderForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: GenderFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      setCode(initial.code || "");
      setName(initial.name || "");
    }
  }, [isEdit, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({ code, name });
      router.push("/settings/gender");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1 font-medium">Code</label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={16}
          placeholder="Enter code"
          className="w-full"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={64}
          placeholder="Enter name"
          className="w-full"
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
