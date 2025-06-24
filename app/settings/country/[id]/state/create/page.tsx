"use client";

import { useRouter, useParams } from "next/navigation";
import StateForm from "../StateForm";
import { useState } from "react";

export default function StateCreatePage() {
  const router = useRouter();
  const params = useParams();
  const countryId = params.id;
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Add State</h2>
      <StateForm
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch("/api/state", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...data, country_id: countryId }),
            });
            if (!res.ok) throw new Error("Failed to create state");
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
