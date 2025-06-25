"use client";

import { Button } from "@/components/ui/button";
import type { State } from "@/lib/schema";
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

export type StateFormProps = {
  initial?: Partial<State>;
  onSubmit: (data: { name: string }) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

const stateSchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name must be at most 64 characters"),
});
type StateFormValues = z.infer<typeof stateSchema>;

export default function StateForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: StateFormProps) {
  const form = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: initial.name || "",
    },
  });

  const onFormSubmit = async (data: StateFormValues) => {
    await onSubmit({ name: data.name.trim() });
  };

  return (
    <Form {...form}>
      <form className="space-y-4 max-w-md" onSubmit={form.handleSubmit(onFormSubmit)}>
        <ShadcnInputField
          form={form}
          name="name"
          label="Name"
          inputProps={{
            maxLength: 64,
            autoFocus: true,
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
