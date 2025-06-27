"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddressTypeForm from "../AddressTypeForm";

export default function AddressTypeCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Add Address Type</h2>
      <AddressTypeForm
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch("/api/address-type", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create address type");
            router.push("/settings/address-type");
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
        submitLabel="Save"
        cancelLabel="Cancel"
        onCancel={() => router.push("/settings/address-type")}
      />
    </div>
  );
}
