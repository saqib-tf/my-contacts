"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactForm from "@/components/ContactForm";

export default function ContactCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Contact</h2>
      <ContactForm
        onSubmit={async (data) => {
          setLoading(true);
          try {
            const res = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create contact");
            router.push("/");
          } finally {
            setLoading(false);
          }
        }}
        loading={loading}
        submitLabel="Create"
        cancelLabel="Cancel"
        onCancel={() => router.push("/")}
      />
    </div>
  );
}
