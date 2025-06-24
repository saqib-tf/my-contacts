"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddressTypeForm from "../AddressTypeForm";
import type { AddressType } from "@/lib/schema";

export default function AddressTypeEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [addressType, setAddressType] = useState<AddressType | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    fetch(`/api/address-type/${id}`)
      .then((res) => res.json())
      .then((data) => setAddressType(data))
      .finally(() => setFetching(false));
  }, [id]);

  if (fetching) return <div className="mt-8">Loading...</div>;
  if (!addressType) return <div className="mt-8 text-red-600">Address type not found.</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Edit Address Type</h2>
      <AddressTypeForm
        initial={addressType}
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch(`/api/address-type/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update address type");
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
