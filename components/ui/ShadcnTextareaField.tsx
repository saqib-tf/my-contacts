import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ShadcnTextareaFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ShadcnTextareaField<T extends FieldValues>({
  form,
  name,
  label,
  textareaProps = {},
  disabled = false,
  autoFocus = false,
}: ShadcnTextareaFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...textareaProps} disabled={disabled} autoFocus={autoFocus} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
