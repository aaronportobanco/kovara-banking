"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formattedCountries } from "@/lib/countries";
import { FormFieldProps } from "../../../../types";
import { ControllerRenderProps, FieldPath } from "react-hook-form";

export function FormCountrySelect<T extends Record<string, unknown>>({
  control,
  name,
  label,
  placeholder,
  description,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<T, FieldPath<T>>;
      }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value as string | undefined}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {formattedCountries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <span className="mr-2">{country.flag}</span>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && (
            <FormDescription className="mt-1 text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage className="form-message mt-2" />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
