"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AddressType } from "@/lib/schema";
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

export type AddressTypeFormProps = {
  initial?: Partial<AddressType>;
  onSubmit: (data: { name: string }) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

const addressTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name must be at most 64 characters"),
});
type AddressTypeFormValues = z.infer<typeof addressTypeSchema>;

export default function AddressTypeForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: AddressTypeFormProps) {
  const form = useForm<AddressTypeFormValues>({
    resolver: zodResolver(addressTypeSchema),
    defaultValues: {
      name: initial.name || "",
    },
  });

  const onFormSubmit = async (data: AddressTypeFormValues) => {
    await onSubmit({ name: data.name.trim() });
  };

  return (
    <Form {...form}>
      <form className="space-y-4 max-w-md" onSubmit={form.handleSubmit(onFormSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} maxLength={64} autoFocus disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
