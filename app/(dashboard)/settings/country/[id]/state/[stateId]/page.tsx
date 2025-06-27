"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StateForm from "../StateForm";
import type { State } from "@/lib/schema";

export default function StateEditPage() {
  const router = useRouter();
  const params = useParams();
  const stateId = params.stateId as string;
  const [stateData, setStateData] = useState<State | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    fetch(`/api/state/${stateId}`)
      .then((res) => res.json())
      .then((data) => setStateData(data))
      .finally(() => setFetching(false));
  }, [stateId]);

  if (fetching) return <div className="mt-8">Loading...</div>;
  if (!stateData) return <div className="mt-8 text-red-600">State not found.</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Edit State</h2>
      <StateForm
        initial={stateData}
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch(`/api/state/${stateId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update state");
            router.back();
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
        submitLabel="Save"
        cancelLabel="Cancel"
        onCancel={() => router.back()}
      />
    </div>
  );
}
