export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  cover: string;
  description?: string;
  organizer?: string;
  type?: "meetup" | "workshop" | "seminar" | "tech-talk";
  isRegistrationOpen?: boolean;
}

export const eventsData: EventItem[] = [
  {
    id: "e1",
    title: "Annual Alumni Meetup",
    date: "Sat, Oct 12 • 5:00 PM",
    location: "New Delhi",
    cover: "https://plus.unsplash.com/premium_photo-1673240845240-2fce9077a6e9?q=80&w=2069&auto=format&fit=crop",
    description: "Join us for our annual alumni gathering and networking event",
    organizer: "Alumni Association",
    type: "meetup",
    isRegistrationOpen: true
  },
  {
    id: "e2",
    title: "Tech Talk: LLM",
    date: "Fri, Nov 08 • 4:00 PM",
    location: "Mumbai",
    cover: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop",
    description: "Learn about the latest developments in Large Language Models",
    organizer: "Tech Department",
    type: "tech-talk",
    isRegistrationOpen: true
  },
  // ...other events
];