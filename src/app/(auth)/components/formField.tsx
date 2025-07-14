import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { FormInputFieldProps } from "../../../../types";

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
  description,
}: FormInputFieldProps<T>) => {
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
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                {...field}
                className="input-class"
                autoComplete={type === "password" ? "off" : "on"}
                required
              />
            </FormControl>
            {description && <FormDescription className="mt-1 text-xs">{description}</FormDescription>}
            <FormMessage className="form-message mt-2" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default InputField;
