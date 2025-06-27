"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GenderForm from "../GenderForm";
import type { Gender } from "@/lib/schema";

export default function GenderEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [gender, setGender] = useState<Gender | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    fetch(`/api/gender/${id}`)
      .then((res) => res.json())
      .then((data) => setGender(data))
      .finally(() => setFetching(false));
  }, [id]);

  if (fetching) return <div className="mt-8">Loading...</div>;
  if (!gender) return <div className="mt-8 text-red-600">Gender not found.</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Edit Gender</h2>
      <GenderForm
        initial={gender}
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch(`/api/gender/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update gender");
            router.push("/settings/gender");
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
        submitLabel="Save"
        cancelLabel="Cancel"
        onCancel={() => router.push("/settings/gender")}
      />
    </div>
  );
}
