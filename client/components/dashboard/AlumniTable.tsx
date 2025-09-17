import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export interface AlumniItem {
  id: string;
  name: string;
  avatar?: string;
  batch: string;
  company: string;
}

export default function AlumniTable({ data }: { data: AlumniItem[] }) {
  return (
    <div className="space-y-4 md:p-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback>
                {item.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {item.company} • Batch {item.batch}
              </div>
            </div>
          </div>
          <Link
            to={`/profile/${encodeURIComponent(item.name)}?headline=${encodeURIComponent(
              `${item.company}`
            )}`}
            className="text-primary hover:underline"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );
}
