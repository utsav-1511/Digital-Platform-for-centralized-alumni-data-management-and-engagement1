import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Briefcase, Calendar, Globe, Link as LinkIcon, Mail, MapPin, Users } from "lucide-react";
import { useParams} from 'react-router-dom';


interface Post { id: number; title: string; description: string; imageUrl?: string }
interface Person { name: string; headline?: string; avatar?: string; profileUrl?: string }

const initialUserData = {
  name: "Utsav Kushwaha",
  designation: "Software Engineer",
  batch: "2027",
  location: "Indore, India",
  company: "AlumniSphere",
  bio:
    "Driven software engineer with a passion for creating innovative solutions and impactful products. Always eager to learn and collaborate with fellow alumni.",
  avatar:
    "https://media.licdn.com/dms/image/v2/D5603AQEIVSCXlRcjCA/profile-displayphoto-scale_400_400/B56ZkUTd_FIAAg-/0/1756982274618?e=1759968000&v=beta&t=T7UUy-KWkcCBPxtr_Q5kj9Q1jDYEe09TU9Q4qRV6d6Q",
  cover: "https://images.unsplash.com/photo-1520975682031-ae4ce7d2439b?q=80&w=1600&auto=format&fit=crop",
  skills: ["Front End", "Blockchain", "WebDev"],
  contact: {
    email: "utsav@gmail.com",
    linkedin: "https://linkedin.com/in/utsav",
    twitter: "https://twitter.com/utsav",
    website: "https://utasv.com",
  },
  posts: [
    {
      id: 1,
      title: "Excited to share my latest project!",
      description:
        "New web app for team collaboration designed to streamline tasks and boost productivity.",
      imageUrl:
        "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Attended the Alumni Networking Event",
      description:
        "Great to connect with fellow alumni and share experiences. Looking forward to future events!",
      imageUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    },
  ] as Post[],
  connections: [
    { name: "Aditya", headline: "SWE • FinTech" },
    { name: "Aman", headline: "Product @ Startup" },
    { name: "Anisha", headline: "Data Scientist" },
    { name: "Diksha", headline: "UI/UX Designer" },
    { name: "Siddharth", headline: "Full‑stack Dev" },
    { name: "Riya", headline: "Security Engineer" },
  ] as Person[],
};

export default function OtherProfile() {
    const { name } = useParams();
  const [searchParams] = useSearchParams();
  const headline = searchParams.get('headline');
  const [params] = useSearchParams();
  const derived = { ...initialUserData, name, designation: headline || initialUserData.designation } as const;
  const [user] = useState(derived);
  const [showAllConnections, setShowAllConnections] = useState(false);

  const connections = useMemo(
    () => (showAllConnections ? user.connections : user.connections.slice(0, 6)),
    [showAllConnections, user.connections],
  );

  const connect = () => {
    toast.success("Connection request sent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Cover + summary */}
        <div className="relative">
          <div
            className="h-44 rounded-2xl bg-cover bg-center md:h-56"
            style={{ backgroundImage: `url(${user.cover})` }}
          />
          <div className="-mb-10 mt-[-44px] flex flex-col items-center gap-4 md:mt-[-56px] md:flex-row md:items-end md:gap-6">
            <div>
              <Avatar className="h-24 w-24 rounded-xl border-4 border-white shadow-card">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl">{user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:pb-2">
              <h1 className="text-xl font-bold md:text-2xl color:black">{user.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {user.designation} • {user.company}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Batch {user.batch}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.location}</span>
              </div>
            </div>
            <div className="mt-2 flex w-full justify-center gap-2 md:ml-auto md:w-auto">
              <Button className="px-5" onClick={connect}>Connect</Button>
              <Button variant="secondary" className="px-5">Message</Button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>{user.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s) => (
                    <span key={s} className="inline-flex items-center rounded-full border px-3 py-1 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={`mailto:${user.contact.email}`}>
                    <Mail className="h-4 w-4" /> {user.contact.email}
                  </a>
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={user.contact.website} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" /> {user.contact.website.replace(/^https?:\/\//, "")}
                  </a>
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={user.contact.linkedin} target="_blank" rel="noreferrer">
                    <LinkIcon className="h-4 w-4" /> LinkedIn
                  </a>
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={user.contact.twitter} target="_blank" rel="noreferrer">
                    <LinkIcon className="h-4 w-4" /> Twitter
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.posts.map((post) => (
                  <div key={post.id} className="flex gap-4 rounded-lg border p-4">
                    <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="Post" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">{post.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" /> Connections</CardTitle>
                <CardDescription>{user.connections.length} total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {connections.map((p) => (
                    <Link
                      key={p.name}
                      to={`/otherprofiles?name=${encodeURIComponent(p.name)}${p.headline ? `&headline=${encodeURIComponent(p.headline)}` : ""}`}
                      className="group rounded-lg border p-3 transition-colors hover:bg-accent/40"
                    >
                      <div className="mb-2 h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200" />
                      <div className="text-sm font-medium leading-tight group-hover:underline">{p.name}</div>
                      {p.headline ? <div className="text-xs text-muted-foreground">{p.headline}</div> : null}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="secondary" onClick={() => setShowAllConnections((v) => !v)}>
                    {showAllConnections ? "Show less" : "See all"}
                  </Button>
                  <a href="#" className="text-sm text-primary hover:underline">Manage connections</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Highlights</CardTitle>
                <CardDescription>Quick stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-semibold">{user.posts.length}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-semibold">{user.skills.length}</div>
                    <div className="text-xs text-muted-foreground">Skills</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-semibold">{user.connections.length}</div>
                    <div className="text-xs text-muted-foreground">Connections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
