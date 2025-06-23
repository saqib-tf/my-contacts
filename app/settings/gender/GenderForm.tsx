"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GenderFormProps {
  genderId?: string;
}

export default function GenderForm({ genderId }: GenderFormProps) {
  const router = useRouter();
  const isEdit = Boolean(genderId);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && genderId) {
      setLoading(true);
      fetch(`/api/gender/${genderId}`)
        .then((res) => res.json())
        .then((data) => {
          setCode(data.code || "");
          setName(data.name || "");
        })
        .catch(() => setError("Failed to load gender."))
        .finally(() => setLoading(false));
    }
  }, [isEdit, genderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/gender/${genderId}` : "/api/gender";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name }),
      });
      if (!res.ok) throw new Error("Failed to save gender");
      router.push("/settings/gender");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Gender" : "Add Gender"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" variant="default" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
