"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormFieldProps } from "#/types";
import { ControllerRenderProps, FieldPath } from "react-hook-form";
import { SelectSearchInput } from "./SelectSearchInput";
import statesAndCitiesData from "#/US_States_and_Cities.json";

const usStates = Object.keys(statesAndCitiesData).sort();

export function FormCountrySelect<T extends Record<string, unknown>>({
  control,
  name,
  label,
  placeholder,
}: FormFieldProps<T>): JSX.Element {
  const [search, setSearch] = useState("");

  const filteredStates = usStates.filter(state =>
    state.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, FieldPath<T>> }) => (
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
                    placeholder="Search state..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {filteredStates.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
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
