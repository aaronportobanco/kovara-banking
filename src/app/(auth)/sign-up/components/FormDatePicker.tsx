"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormFieldProps } from "#/types";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MAX_AGE, MIN_AGE } from "#/constants";
import { formatDateTime } from "@/lib/utils";

const FormDatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  description,
  autoComplete,
  pattern,
  minLength,
  maxLength,
}: FormFieldProps<T>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, FieldPath<T>> }) => (
        <FormItem className="form-item">
          <div className="flex flex-col gap-3">
            <FormLabel className="form-label">{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="relative ">
                    <Input
                      placeholder={placeholder}
                      type={type}
                      {...field}
                      className="input-class cursor-pointer"
                      autoComplete={autoComplete}
                      minLength={minLength}
                      maxLength={maxLength}
                      pattern={pattern?.source}
                      required
                      readOnly
                      value={
                        field.value
                          ? formatDateTime(new Date(`${field.value}T00:00:00`)).dateOnly
                          : ""
                      }
                    />
                    <CalendarIcon className="cursor-pointer absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  required
                  selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                  captionLayout="dropdown"
                  disabled={date => {
                    const today = new Date();
                    const hundredYearsAgo = new Date(
                      today.getFullYear() - MAX_AGE,
                      today.getMonth(),
                      today.getDate(),
                    );
                    const eighteenYearsAgo = new Date(
                      today.getFullYear() - MIN_AGE,
                      today.getMonth(),
                      today.getDate(),
                    );
                    return date > eighteenYearsAgo || date < hundredYearsAgo || date > today;
                  }}
                  onSelect={date => {
                    if (date) {
                      field.onChange(date.toISOString().split("T")[0]);
                    }
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>{" "}
            {description && (
              <FormDescription className="mt-1 text-xs">{description}</FormDescription>
            )}
            <FormMessage className="form-message mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormDatePicker;
