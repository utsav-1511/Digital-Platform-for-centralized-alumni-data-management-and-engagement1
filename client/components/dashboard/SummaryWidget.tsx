import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SummaryWidget({
  title,
  value,
  icon,
  className,
  accent = "bg-accent/15 text-accent-foreground",
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="flex items-center justify-between p-4 ">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-2xl font-semibold text-primary">
            {value}
          </div>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            accent,
          )}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
