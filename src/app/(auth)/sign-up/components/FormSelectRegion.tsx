"use client";

import { useMemo, useState } from "react";
import { FieldPath, FieldValues, useWatch } from "react-hook-form";
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
import { FormFieldProps } from "#/types";
import { SelectSearchInput } from "./SelectSearchInput";
import statesAndCitiesData from "#/US_States_and_Cities.json";

interface StatesAndCities {
  [key: string]: string[];
}

const data: StatesAndCities = statesAndCitiesData;

const getCitiesByState = (state: string): string[] => {
  if (state && data[state]) {
    return data[state].sort();
  }
  return [];
};

interface FormCitySelectProps<T extends FieldValues> extends FormFieldProps<T> {
  stateField: FieldPath<T>;
}
export function FormRegionSelect<T extends FieldValues>({
  name,
  stateField,
  label,
  control,
  placeholder,
}: FormCitySelectProps<T>) {
  const selectedState = useWatch({ control, name: stateField });
  const [search, setSearch] = useState("");

  const cities = useMemo(() => {
    return getCitiesByState(selectedState);
  }, [selectedState]);

  const filteredCities = useMemo(
    () =>
      cities.filter((city) =>
        city.toLowerCase().includes(search.toLowerCase())
      ),
    [cities, search]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item w-full">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="w-full">
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!selectedState || cities.length === 0}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectSearchInput
                    placeholder="Search city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {filteredCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage className="form-message mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
}
