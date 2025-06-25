import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShadcnComboboxFieldProps {
  form: any;
  name: string;
  label: string;
  options: { id: number | string; name: string }[];
  loading?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ShadcnComboboxField: React.FC<ShadcnComboboxFieldProps> = ({
  form,
  name,
  label,
  options,
  loading,
  searchValue,
  onSearchChange,
  placeholder = "Select...",
  description,
  disabled,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <FormField
      control={form.control}
      name="gender_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((g) => g.id.toString() === field.value)?.name
                    : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="h-9"
                  value={searchValue}
                  onValueChange={onSearchChange}
                />
                <CommandList>
                  <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((g) => (
                      <CommandItem
                        value={g.name}
                        key={g.id}
                        onSelect={() => {
                          form.setValue("gender_id", g.id.toString());
                          setOpen(false);
                        }}
                      >
                        {g.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            g.id.toString() === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
