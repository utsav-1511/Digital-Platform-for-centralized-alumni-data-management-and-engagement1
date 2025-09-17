import { EventItem } from "@/data/events";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }: { event: EventItem }) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/1] relative">
        <img
          src={event.cover}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        {event.type && (
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-black/50 px-2 py-1 text-xs text-white">
              {event.type}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{event.title}</h3>
        {event.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.organizer}</span>
            </div>
          )}
        </div>
        {event.isRegistrationOpen && (
          <Button
            className="mt-4 w-full"
            variant="outline"
            onClick={() => navigate(`/events/register/${event.id}`)}
          >
            Register
          </Button>
        )}
      </div>
    </Card>
  );
}
