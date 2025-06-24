"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CountryForm from "../CountryForm";

export default function CountryEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchCountry() {
      setFetching(true);
      const res = await fetch(`/api/country/${id}`);
      if (res.ok) {
        setInitialData(await res.json());
      }
      setFetching(false);
    }
    if (id) fetchCountry();
  }, [id]);

  async function handleUpdate(data: { code: string; name: string }) {
    setLoading(true);
    try {
      const res = await fetch(`/api/country/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update country");
      router.push("/settings/country");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div>Loading...</div>;
  if (!initialData) return <div>Country not found.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Country</h2>
      <CountryForm initialData={initialData} onSubmit={handleUpdate} loading={loading} />
    </div>
  );
}
