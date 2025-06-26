"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ShadcnInputField } from "@/components/ui/ShadcnInputField";
import { ShadcnComboboxField } from "@/components/ui/ShadcnComboboxField";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import type { AddressWithRelations } from "@/lib/typesWithRelations";

const addressSchema = z.object({
  street: z.string().min(1, "Street is required").max(255),
  city: z.string().min(1, "City is required").max(100),
  postal_code: z.string().max(20).optional().or(z.literal("")),
  address_type_id: z.string().min(1, "Type is required"),
  country_id: z.string().min(1, "Country is required"),
  state_id: z.string().optional().or(z.literal("")),
});
type AddressFormValues = z.infer<typeof addressSchema>;

export type AddressFormProps = {
  initial?: Partial<AddressWithRelations>;
  onSubmit: (data: AddressFormValues) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

export default function AddressForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: AddressFormProps) {
  const router = useRouter();
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: initial.street || "",
      city: initial.city || "",
      postal_code: initial.postal_code || "",
      address_type_id: initial.address_type_id ? String(initial.address_type_id) : "",
      country_id: initial.country_id ? String(initial.country_id) : "",
      state_id: initial.state_id ? String(initial.state_id) : "",
    },
  });

  // State and fetch logic for address type
  const [addressTypeOptions, setAddressTypeOptions] = useState<{ id: number; name: string }[]>([]);
  const [addressTypeLoading, setAddressTypeLoading] = useState(false);
  const [addressTypeSearch, setAddressTypeSearch] = useState(initial.address_type?.name || "");
  // State and fetch logic for country
  const [countryOptions, setCountryOptions] = useState<{ id: number; name: string }[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState(initial.country?.name || "");
  // State and fetch logic for state
  const [stateOptions, setStateOptions] = useState<{ id: number; name: string }[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateSearch, setStateSearch] = useState(initial.state?.name || "");

  // Fetch address types
  useEffect(() => {
    let ignore = false;
    async function fetchTypes() {
      setAddressTypeLoading(true);
      try {
        const params = new URLSearchParams({
          search: addressTypeSearch,
          page: "1",
          pageSize: "10",
        });
        const res = await fetch(`/api/address-type?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setAddressTypeOptions(data.data || []);
        } else {
          if (!ignore) setAddressTypeOptions([]);
        }
      } catch {
        if (!ignore) setAddressTypeOptions([]);
      } finally {
        if (!ignore) setAddressTypeLoading(false);
      }
    }
    fetchTypes();
    return () => {
      ignore = true;
    };
  }, [addressTypeSearch]);

  // Fetch countries
  useEffect(() => {
    let ignore = false;
    async function fetchCountries() {
      setCountryLoading(true);
      try {
        const params = new URLSearchParams({ search: countrySearch, page: "1", pageSize: "10" });
        const res = await fetch(`/api/country?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setCountryOptions(data.data || []);
        } else {
          if (!ignore) setCountryOptions([]);
        }
      } catch {
        if (!ignore) setCountryOptions([]);
      } finally {
        if (!ignore) setCountryLoading(false);
      }
    }
    fetchCountries();
    return () => {
      ignore = true;
    };
  }, [countrySearch]);

  // Fetch states (depends on country)
  useEffect(() => {
    let ignore = false;
    async function fetchStates() {
      if (!form.watch("country_id")) {
        setStateOptions([]);
        return;
      }
      setStateLoading(true);
      try {
        const params = new URLSearchParams({
          search: stateSearch,
          page: "1",
          pageSize: "10",
          countryId: form.watch("country_id") || "",
        });
        const res = await fetch(`/api/state?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setStateOptions(data.data || []);
        } else {
          if (!ignore) setStateOptions([]);
        }
      } catch {
        if (!ignore) setStateOptions([]);
      } finally {
        if (!ignore) setStateLoading(false);
      }
    }
    fetchStates();
    return () => {
      ignore = true;
    };
  }, [stateSearch, form.watch("country_id")]);

  useEffect(() => {
    // Only reset if initial is not empty and not equal to current form values
    if (initial && Object.keys(initial).length > 0) {
      form.reset({
        street: initial.street || "",
        city: initial.city || "",
        postal_code: initial.postal_code || "",
        address_type_id: initial.address_type_id ? String(initial.address_type_id) : "",
        country_id: initial.country_id ? String(initial.country_id) : "",
        state_id: initial.state_id ? String(initial.state_id) : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-w-md"
        onSubmit={form.handleSubmit(async (data) => {
          // Transform state_id from empty string to undefined before submit
          const submitData = {
            ...data,
            state_id: data.state_id === "" ? undefined : data.state_id,
          };
          await onSubmit(submitData);
        })}
      >
        <ShadcnInputField
          form={form}
          name="street"
          label="Street"
          inputProps={{ maxLength: 255, autoFocus: true, disabled: loading }}
        />
        <ShadcnInputField
          form={form}
          name="city"
          label="City"
          inputProps={{ maxLength: 100, disabled: loading }}
        />
        <ShadcnInputField
          form={form}
          name="postal_code"
          label="Postal Code"
          inputProps={{ maxLength: 20, disabled: loading }}
        />
        <ShadcnComboboxField
          form={form}
          name="address_type_id"
          label="Type"
          options={addressTypeOptions}
          loading={addressTypeLoading}
          searchValue={addressTypeSearch}
          onSearchChange={setAddressTypeSearch}
          placeholder="Select type"
          disabled={loading}
        />
        <ShadcnComboboxField
          form={form}
          name="country_id"
          label="Country"
          options={countryOptions}
          loading={countryLoading}
          searchValue={countrySearch}
          onSearchChange={setCountrySearch}
          placeholder="Select country"
          disabled={loading}
        />
        <ShadcnComboboxField
          form={form}
          name="state_id"
          label="State"
          options={stateOptions}
          loading={stateLoading}
          searchValue={stateSearch}
          onSearchChange={setStateSearch}
          placeholder="Select state"
          disabled={loading || !form.watch("country_id")}
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
