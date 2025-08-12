import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { TextAreaInputProps } from "#/types";
import { JSX } from "react";
import { Textarea } from "@/components/ui/textarea";

const TextAreaInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  autoComplete,
  minLength,
  maxLength,
  rows,
}: TextAreaInputProps<T>): JSX.Element => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, FieldPath<T>> }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Textarea
                placeholder={placeholder}
                {...field}
                className="input-class"
                autoComplete={autoComplete}
                minLength={minLength}
                maxLength={maxLength}
                rows={rows}
                required
              />
            </FormControl>
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

export default TextAreaInput;
