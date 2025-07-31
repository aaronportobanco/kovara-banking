import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";
const SelectSearchInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="sticky top-0 z-10 bg-background">
        <div className="relative p-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input ref={ref} {...props} className={`pl-8 w-full ${className || ""}`} />
        </div>
      </div>
    );
  },
);

SelectSearchInput.displayName = "SelectSearchInput";

export { SelectSearchInput };
