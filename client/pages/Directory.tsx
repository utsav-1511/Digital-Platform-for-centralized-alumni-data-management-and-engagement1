import { useMemo, useState } from "react";
import AlumniTable, { AlumniItem } from "@/components/dashboard/AlumniTable";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Directory() {
  const [query, setQuery] = useState("");
  const data = useMemo<AlumniItem[]>(
    () => [
      {
        id: "1",
        name: "Aditya Tiwari",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQENqe9wlcNCRg/profile-displayphoto-crop_800_800/B56ZjgqRy3H8AI-/0/1756115838566?e=1759968000&v=beta&t=fRfAmi7le13x6vQ2QVvNalYQJqCnI1e2IT3vPjOUa_E",
        batch: "2016",
        company: "Bloom",
      },
      {
        id: "2",
        name: "Aman",
        avatar: "",
        batch: "2018",
        company: "Hooli",
      },
      {
        id: "3",
        name: "Akhilesh Pal",
        avatar: "",
        batch: "2015",
        company: "Infosys",
      },
      {
        id: "4",
        name: "Aditya Tiwari",
        avatar: "",
        batch: "2012",
        company: "Google",
      },
      {
        id: "5",
        name: "Anisha",
        avatar: "",
        batch: "2019",
        company: "Meta",
      },
      {
        id: "6",
        name: "Siddhatth",
        avatar: "",
        batch: "2023",
        company: "Ado",
      },
    ],
    [],
  );

  const filtered = data.filter((d) =>
    (d.name + " " + d.company + " " + d.batch)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4 md:p-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Alumni Directory</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name, company, batch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="p-4">
          <AlumniTable data={filtered} />
        </div>
      </Card>
    </div>
  );
}
