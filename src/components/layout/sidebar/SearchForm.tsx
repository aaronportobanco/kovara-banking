import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Buscar..."
            className="pl-9 pr-3 py-2 rounded-[8px] border border-gray-400 bg-muted/10 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition"
          />
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}

export default SearchForm;
