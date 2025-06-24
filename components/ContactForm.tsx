import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/schema";

interface ContactFormProps {
  initial?: Partial<Contact>;
  onSubmit: (data: Partial<Contact>) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export default function ContactForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState(initial.first_name || "");
  const [lastName, setLastName] = useState(initial.last_name || "");
  const [dateOfBirth, setDateOfBirth] = useState(initial.date_of_birth || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(initial.profile_picture_url || "");
  const [genderId, setGenderId] = useState(initial.gender_id ? String(initial.gender_id) : "");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!firstName.trim() || !lastName.trim()) {
          setError("First name and last name are required.");
          return;
        }
        try {
          await onSubmit({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            date_of_birth: dateOfBirth || undefined,
            profile_picture_url: profilePictureUrl || undefined,
            gender_id: genderId ? Number(genderId) : undefined,
          });
        } catch (err: any) {
          setError(err?.message || "Failed to save contact.");
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={100}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gender ID</label>
        <Input value={genderId} onChange={(e) => setGenderId(e.target.value)} type="number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <Input
          value={dateOfBirth || ""}
          onChange={(e) => setDateOfBirth(e.target.value)}
          type="date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
        <Input
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          type="url"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading} className="min-w-[100px]">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
