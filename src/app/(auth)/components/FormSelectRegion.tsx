"use client";

import { useMemo, useState } from "react";
import { FieldPath, FieldValues, useWatch } from "react-hook-form";
import { allCountries as CountryRegionData } from "country-region-data";
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
import { FormFieldProps } from "../../../../types";
import { SelectSearchInput } from "./SelectSearchInput";

interface FormRegionSelectProps<T extends FieldValues>
  extends FormFieldProps<T> {
  countryField: FieldPath<T>;
}

export function FormRegionSelect<T extends FieldValues>({
  name,
  countryField,
  label,
  control,
  placeholder,
  description,
}: FormRegionSelectProps<T>) {
  const selectedCountry = useWatch({ control, name: countryField });
  const [search, setSearch] = useState("");

  const regions = useMemo(() => {
    const match = CountryRegionData.find((c) => c[1] === selectedCountry);
    return match ? match[2] : [];
  }, [selectedCountry]);

  const filteredRegions = regions.filter((region) =>
    region[0].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!regions.length}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectSearchInput
                  placeholder="Search region..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filteredRegions.map((region) => (
                  <SelectItem key={region[1]} value={region[0]}>
                    {region[0]}
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
        </FormItem>
      )}
    />
  );
}
