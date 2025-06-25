import React from "react";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ShadcnInputField } from "@/components/ui/ShadcnInputField";
import { ShadcnImageUploadField } from "@/components/ui/ShadcnImageUploadField";

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  date_of_birth: z.string().optional().or(z.literal("")),
  profile_picture_url: z.string().optional(),
  gender_id: z.string().optional().or(z.literal("")),
});
type ContactFormValues = z.infer<typeof contactSchema>;

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
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: initial.first_name || "",
      last_name: initial.last_name || "",
      date_of_birth: initial.date_of_birth || "",
      profile_picture_url: initial.profile_picture_url || "",
      gender_id: initial.gender_id ? String(initial.gender_id) : "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-md"
        onSubmit={form.handleSubmit(async (data) => {
          await onSubmit({
            ...data,
            gender_id: data.gender_id ? Number(data.gender_id) : undefined,
            profile_picture_url: data.profile_picture_url || undefined,
            date_of_birth: data.date_of_birth || undefined,
          });
        })}
      >
        <ShadcnInputField
          form={form}
          name="first_name"
          label="First Name"
          inputProps={{ maxLength: 100, autoFocus: true, disabled: loading }}
        />
        <ShadcnInputField
          form={form}
          name="last_name"
          label="Last Name"
          inputProps={{ maxLength: 100, disabled: loading }}
        />
        <ShadcnInputField
          form={form}
          name="gender_id"
          label="Gender ID"
          type="number"
          inputProps={{ disabled: loading }}
        />
        <ShadcnInputField
          form={form}
          name="date_of_birth"
          label="Date of Birth"
          type="date"
          inputProps={{ disabled: loading }}
        />
        <ShadcnImageUploadField
          form={form}
          name="profile_picture_url"
          label="Profile Picture"
          disabled={loading}
        />
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
    </Form>
  );
}
