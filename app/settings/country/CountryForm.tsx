"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Country, NewCountry } from "@/lib/schema";
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

interface CountryFormProps {
  initialData?: Partial<Country>;
  onSubmit: (data: NewCountry) => Promise<void>;
  loading?: boolean;
}

const countrySchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
});
type CountryFormValues = z.infer<typeof countrySchema>;

export default function CountryForm({ initialData = {}, onSubmit, loading }: CountryFormProps) {
  const router = useRouter();
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      code: initialData.code || "",
      name: initialData.name || "",
    },
  });

  const onFormSubmit = async (data: CountryFormValues) => {
    await onSubmit(data as NewCountry);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 max-w-md">
        <ShadcnInputField
          form={form}
          name="code"
          label="Code"
          inputProps={{
            maxLength: 10,
            placeholder: "Enter code",
          }}
          disabled={loading}
          autoFocus
        />
        <ShadcnInputField
          form={form}
          name="name"
          label="Name"
          inputProps={{
            maxLength: 255,
            placeholder: "Enter name",
          }}
          disabled={loading}
        />
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
