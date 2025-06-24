"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";
import type { Contact } from "@/lib/schema";

export default function ContactEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    fetch(`/api/contact/${id}`)
      .then((res) => res.json())
      .then((data) => setContact(data))
      .finally(() => setFetching(false));
  }, [id]);

  if (fetching) return <div className="mt-8">Loading...</div>;
  if (!contact) return <div className="mt-8 text-red-600">Contact not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Contact</h2>
      <ContactForm
        initial={contact}
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch(`/api/contact/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update contact");
            router.push("/");
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
        submitLabel="Save"
        cancelLabel="Cancel"
        onCancel={() => router.push("/")}
      />
    </div>
  );
}
