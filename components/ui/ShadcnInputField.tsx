import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ShadcnInputFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: "text" | "number" | "date" | "email" | "password";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ShadcnInputField<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  inputProps = {},
  disabled = false,
  autoFocus = false,
}: ShadcnInputFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              type={type}
              disabled={disabled}
              autoFocus={autoFocus}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
