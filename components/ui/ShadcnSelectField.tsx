import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ShadcnSelectFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ShadcnSelectField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = "Select...",
  disabled = false,
  autoFocus = false,
}: ShadcnSelectFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={
                Array.isArray(field.value)
                  ? field.value[0]
                  : field.value !== undefined && field.value !== null
                  ? String(field.value)
                  : undefined
              }
              disabled={disabled}
              // autoFocus is not supported by shadcn Select
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
