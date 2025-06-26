import React from "react";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/schema";
import type { ContactWithRelations } from "@/lib/typesWithRelations";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShadcnInputField } from "@/components/ui/ShadcnInputField";
import { ShadcnImageUploadField } from "@/components/ui/ShadcnImageUploadField";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDebounce } from "use-debounce";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { ShadcnComboboxField } from "@/components/ui/ShadcnComboboxField";

const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  date_of_birth: z.string().optional().or(z.literal("")),
  profile_picture_url: z.string().optional(),
  gender_id: z.string().optional().or(z.literal("")),
});
type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  initial?: Partial<ContactWithRelations>;
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

  const [genderOptions, setGenderOptions] = React.useState<{ id: number; name: string }[]>([]);
  const [genderLoading, setGenderLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [genderSearch, setGenderSearch] = React.useState(initial.gender?.name || "");
  const [debouncedGenderSearch] = useDebounce(genderSearch, SEARCH_DEBOUNCE_MS);

  // Fetch gender options from API (correct route)
  React.useEffect(() => {
    let ignore = false;
    const fetchGenders = async () => {
      setGenderLoading(true);
      try {
        const params = new URLSearchParams({
          search: debouncedGenderSearch,
          page: "1",
          pageSize: "10",
          sortBy: "name",
          sortDir: "asc",
        });
        const res = await fetch(`/api/gender?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setGenderOptions(data.data || []);
        } else {
          if (!ignore) setGenderOptions([]);
        }
      } catch {
        if (!ignore) setGenderOptions([]);
      } finally {
        if (!ignore) setGenderLoading(false);
      }
    };
    fetchGenders();
    return () => {
      ignore = true;
    };
  }, [debouncedGenderSearch]);

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
        {/* Gender Combobox (reusable) */}
        <ShadcnComboboxField
          form={form}
          name="gender_id"
          label="Gender"
          options={genderOptions}
          loading={genderLoading}
          searchValue={genderSearch}
          onSearchChange={setGenderSearch}
          placeholder="Select gender"
          description=""
          disabled={loading}
        />
        {/* End Gender Combobox */}
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
