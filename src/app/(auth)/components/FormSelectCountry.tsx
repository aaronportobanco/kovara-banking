"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formattedCountries } from "@/lib/countries";
import { FormFieldProps } from "../../../../types";
import { ControllerRenderProps, FieldPath } from "react-hook-form";
import { SelectSearchInput } from "./SelectSearchInput";

export function FormCountrySelect<T extends Record<string, unknown>>({
  control,
  name,
  label,
  placeholder,
}: FormFieldProps<T>) {
  const [search, setSearch] = useState("");

  const filteredCountries = formattedCountries.filter((country) =>
    country.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<T, FieldPath<T>>;
      }) => (
        <FormItem className="form-item w-full">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="w-full">
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
                  <SelectSearchInput
                    placeholder="Search country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {filteredCountries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <span className="mr-2">{country.flag}</span>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage className="form-message mt-2" />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
