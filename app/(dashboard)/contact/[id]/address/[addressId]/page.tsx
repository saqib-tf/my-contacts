"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddressForm from "../AddressForm";

export default function AddressEditPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id;
  const addressId = params.addressId;
  const [initial, setInitial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddress() {
      setLoading(true);
      const res = await fetch(`/api/address/${addressId}`);
      if (res.ok) {
        setInitial(await res.json());
      }
      setLoading(false);
    }
    if (addressId) fetchAddress();
  }, [addressId]);

  async function handleSubmit(data: any) {
    await fetch(`/api/address/${addressId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, person_id: Number(contactId) }),
    });
    router.push(`/contact/${contactId}/address`);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Address</h2>
      <AddressForm
        initial={initial}
        onSubmit={handleSubmit}
        submitLabel="Update"
        onCancel={() => router.back()}
      />
    </div>
  );
}
