import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Filters = {
  query: string;
  industry: string | "all";
  role: string | "all";
  batch: number | "all";
  sort: "recent" | "liked";
};

export function FiltersBar({ value, onChange, className }: { value: Filters; onChange: (v: Filters) => void; className?: string }) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  return (
    <div className={cn("grid gap-3 md:grid-cols-5", className)}>
      <div className="md:col-span-2">
        <Input
          placeholder="Search alumni, roles, stories..."
          value={value.query}
          onChange={(e) => set({ query: e.target.value })}
        />
      </div>
      <Select value={String(value.batch)} onValueChange={(v) => set({ batch: v === "all" ? "all" : parseInt(v) })}>
        <SelectTrigger>
          <SelectValue placeholder="Batch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Batches</SelectItem>
          {Array.from({ length: 15 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select value={value.industry} onValueChange={(v) => set({ industry: v as Filters["industry"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Industry" />
        </SelectTrigger>
        <SelectContent>
          {(["all", "Software", "Finance", "Consulting", "Healthcare", "Education", "Marketing"] as const).map((i) => (
            <SelectItem key={i} value={i}>
              {i === "all" ? "All Industries" : i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={value.role} onValueChange={(v) => set({ role: v as Filters["role"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {(["all", "Engineer", "Manager", "Analyst", "Researcher", "Designer"] as const).map((r) => (
            <SelectItem key={r} value={r}>
              {r === "all" ? "All Roles" : r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={value.sort} onValueChange={(v) => set({ sort: v as Filters["sort"] })}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="liked">Most Liked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FiltersBar;
