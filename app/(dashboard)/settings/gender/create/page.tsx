"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GenderForm from "../GenderForm";

export default function GenderCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-xl mt-4">
      <h2 className="text-2xl font-bold mb-4">Add Gender</h2>
      <GenderForm
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch("/api/gender", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create gender");
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
