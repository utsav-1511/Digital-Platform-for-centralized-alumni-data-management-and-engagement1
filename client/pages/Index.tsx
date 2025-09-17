import { useMemo } from "react";
import SummaryWidget from "@/components/dashboard/SummaryWidget";
import AlumniTable, { AlumniItem } from "@/components/dashboard/AlumniTable";
import EventCard from "@/components/dashboard/EventCard";
// Remove EventItem if not used or not exported from EventCard
import { Users, CalendarDays, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { eventsData } from "@/data/events";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  const alumniData: AlumniItem[] = useMemo(
    () => [
      {
        id: "1",
        name: "Anisha",
        avatar: "",
        batch: "2020",
        company: "Software Developer, Infosys",
      },
      {
        id: "2",
        name: "Aman",
        avatar: "",
        batch: "2018",
        company: "Business Analyst, TCS",
      },
      {
        id: "3",
        name: "Aditya",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQENqe9wlcNCRg/profile-displayphoto-crop_800_800/B56ZjgqRy3H8AI-/0/1756115838566?e=1759968000&v=beta&t=fRfAmi7le13x6vQ2QVvNalYQJqCnI1e2IT3vPjOUa_E",
        batch: "2018",
        company: "Data Scientist, Wipro",
      },
      {
        id: "4",
        name: "Siddharth",
        avatar: "https://media.licdn.com/dms/image/v2/D4E03AQEhRHbX3sOUyA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718269909957?e=1759968000&v=beta&t=wnaWOdxzbFQbQqJy8oss9W7YJmpWIHezd-2ALp7x03A",
        batch: "2017",
        company: "Project Manager, HCL Technologies",
      },
      {
        id: "5",
        name: "Diksha",
        avatar: "",
        batch: "2013",
        company: "Marketing Lead, Tech Mahindra",
      },
      {
        id: "6",
        name: "Ananya",
        avatar: "",
        batch: "2023",
        company: "Software Developer, Adobe",
      },
    ],
    [],
  );

  const upcomingEvents = eventsData.slice(0, 3); // Show only first 3 events

  return (
    
    <div className="space-y-6 md:p-3 mx-auto max-w-7xl">
      {/* Summary widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryWidget
          title="Total Alumni"
          value="2,487"
          icon={<Users className="h-5 w-5" />}
          accent="bg-primary/10 text-primary"
        />
        <SummaryWidget
          title="Upcoming Events"
          value={upcomingEvents.length}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="bg-accent/15 text-accent-foreground"
        />
        <SummaryWidget
          title="New Messages"
          value="34"
          icon={<MessageSquare className="h-5 w-5" />}
          accent="bg-sky-100 text-sky-700"
        />
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlumniTable data={alumniData} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold">Upcoming Events</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile spacing card to keep visual balance */}
      <Card className="lg:hidden border-dashed p-4 text-xs text-muted-foreground">
        Tip: Use the sidebar to explore the directory, events, and chat.
      </Card>
      
    </div>
  );
}