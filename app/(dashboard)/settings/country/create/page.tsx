"use client";

import { useRouter } from "next/navigation";
import CountryForm from "../CountryForm";
import { useState } from "react";

export default function CountryCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(data: { code: string; name: string }) {
    setLoading(true);
    try {
      const res = await fetch("/api/country", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create country");
      router.push("/settings/country");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Country</h2>
      <CountryForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}
