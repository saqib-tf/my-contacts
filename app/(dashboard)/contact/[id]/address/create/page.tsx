"use client";

import { useRouter, useParams } from "next/navigation";
import AddressForm from "../AddressForm";

export default function AddressCreatePage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id;

  async function handleSubmit(data: any) {
    await fetch(`/api/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, person_id: Number(contactId) }),
    });
    router.push(`/contact/${contactId}/address`);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Address</h2>
      <AddressForm onSubmit={handleSubmit} submitLabel="Create" onCancel={() => router.back()} />
    </div>
  );
}
