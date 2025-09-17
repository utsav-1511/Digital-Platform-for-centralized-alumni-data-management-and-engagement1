import { eventsData } from "@/data/events";
import EventCard from "@/components/dashboard/EventCard";
import { Card } from "@/components/ui/card";

export default function Events() {
  return (
    <div className="space-y-4 md:p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Events</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventsData.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      <Card className="mt-4 p-4 text-sm text-muted-foreground">
        Stay tuned for upcoming events from your college.
      </Card>
    </div>
  );
}
