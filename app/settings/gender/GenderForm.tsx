"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Gender } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ShadcnInputField } from "@/components/ui/ShadcnInputField";

export type GenderFormProps = {
  initial?: Partial<Gender>;
  onSubmit: (data: { code: string; name: string }) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

const genderSchema = z.object({
  code: z.string().min(1, "Code is required").max(16, "Code must be at most 16 characters"),
  name: z.string().min(1, "Name is required").max(64, "Name must be at most 64 characters"),
});
type GenderFormValues = z.infer<typeof genderSchema>;

export default function GenderForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: GenderFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);

  const form = useForm<GenderFormValues>({
    resolver: zodResolver(genderSchema),
    defaultValues: {
      code: initial.code || "",
      name: initial.name || "",
    },
  });

  useEffect(() => {
    if (isEdit) {
      form.setValue("code", initial.code || "");
      form.setValue("name", initial.name || "");
    }
  }, [isEdit, initial, form]);

  const onFormSubmit = async (data: GenderFormValues) => {
    try {
      await onSubmit(data);
      router.push("/settings/gender");
    } catch (err) {
      // Optionally handle error here, e.g. show toast
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 max-w-md">
        <ShadcnInputField
          form={form}
          name="code"
          label="Code"
          inputProps={{
            maxLength: 16,
            placeholder: "Enter code",
            className: "w-full",
          }}
          disabled={loading}
          autoFocus
        />
        <ShadcnInputField
          form={form}
          name="name"
          label="Name"
          inputProps={{
            maxLength: 64,
            placeholder: "Enter name",
            className: "w-full",
          }}
          disabled={loading}
        />
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
