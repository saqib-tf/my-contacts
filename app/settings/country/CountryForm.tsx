"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Country, NewCountry } from "@/lib/schema";

interface CountryFormProps {
  initialData?: Partial<Country>;
  onSubmit: (data: NewCountry) => Promise<void>;
  loading?: boolean;
}

export default function CountryForm({ initialData = {}, onSubmit, loading }: CountryFormProps) {
  const [code, setCode] = useState(initialData.code || "");
  const [name, setName] = useState(initialData.name || "");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim() || !name.trim()) {
      setError("Code and Name are required.");
      return;
    }
    await onSubmit({ code, name } as NewCountry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1 font-medium">Code</label>
        <Input value={code} onChange={(e) => setCode(e.target.value)} required maxLength={10} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={255} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
