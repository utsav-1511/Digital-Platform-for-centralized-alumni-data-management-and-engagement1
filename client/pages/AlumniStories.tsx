import { useEffect, useMemo, useState } from "react";
import { Filters, FiltersBar } from "@/components/alumni/FiltersBar";
import PostStoryForm from "@/components/alumni/PostStoryForm";
import StoryCard, { AlumniStory } from "@/components/alumni/StoryCard";
import { Separator } from "@/components/ui/separator";
import FloatingShareButton from "@/components/FloatingShareButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";

function seedStories(): AlumniStory[] {
  return [
    {
      id: "s-1",
      name: "Anisha Verma",
      initials: "AV",
      role: "Software Developer, Infosys",
      batchYear: 2020,
      industry: "Software",
      headline: "From campus coding clubs to building enterprise apps",
      timeline: [
        { id: "t-1-1", date: "2018", title: "Internship", description: "Summer intern at a startup; learned React and Git." },
        { id: "t-1-2", date: "2019", title: "Open Source", description: "Contributed to OSS; improved problem solving and networking." },
        { id: "t-1-3", date: "2020", title: "First Job", description: "Joined Infosys; focused on front-end architecture." },
      ],
      attachments: [
        { id: "a-1", type: "image", url: "/placeholder.svg", label: "Hackathon" },
        { id: "a-2", type: "link", url: "https://github.com/", label: "GitHub" },
      ],
      likes: 56,
      comments: [
        { id: "c-1", author: "Aman", text: "Inspiring journey!", createdAt: new Date().toISOString() },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    },
    {
      id: "s-2",
      name: "Siddharth Rao",
      initials: "SR",
      role: "Project Manager, HCL Technologies",
      batchYear: 2017,
      industry: "Consulting",
      headline: "Pivoting from engineering to project leadership",
      timeline: [
        { id: "t-2-1", date: "2016", title: "Campus Leadership", description: "Led college fest tech team." },
        { id: "t-2-2", date: "2018", title: "Certification", description: "Completed PMP foundations; mentored juniors." },
        { id: "t-2-3", date: "2021", title: "Promotion", description: "Promoted to PM handling cross-functional teams." },
      ],
      attachments: [
        { id: "a-3", type: "link", url: "https://www.linkedin.com/", label: "LinkedIn" },
      ],
      likes: 88,
      comments: [
        { id: "c-2", author: "Aditya", text: "Great insights on leadership.", createdAt: new Date().toISOString() },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "s-3",
      name: "Diksha Sharma",
      initials: "DS",
      role: "Marketing Lead, Tech Mahindra",
      batchYear: 2013,
      industry: "Marketing",
      headline: "Blending data with creativity for impact",
      timeline: [
        { id: "t-3-1", date: "2014", title: "First Campaign", description: "Ran first digital campaign; learned analytics." },
        { id: "t-3-2", date: "2018", title: "Upskilling", description: "Completed Google Analytics and Meta Ads courses." },
        { id: "t-3-3", date: "2023", title: "Lead", description: "Leading a team of 8; driving growth programs." },
      ],
      attachments: [
        { id: "a-5", type: "image", url: "/placeholder.svg", label: "Campaign" },
      ],
      likes: 120,
      comments: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    },
  ];
}

export default function AlumniStories() {
  const [stories, setStories] = useState<AlumniStory[]>(seedStories());
  const [filters, setFilters] = useState<Filters>({ query: "", industry: "all", role: "all", batch: "all", sort: "recent" });
  const [openPost, setOpenPost] = useState(false);

  useEffect(() => {
    const handler = () => setOpenPost(true);
    window.addEventListener("open-post-story", handler as EventListener);
    return () => window.removeEventListener("open-post-story", handler as EventListener);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase().trim();
    let list = stories.filter((s) => {
      const matchesQuery = !q || [s.name, s.role, s.headline, s.industry, String(s.batchYear)].some((x) => x.toLowerCase().includes(q));
      const matchesIndustry = filters.industry === "all" || s.industry === filters.industry;
      const matchesRole = filters.role === "all" || s.role.toLowerCase().includes(filters.role.toLowerCase());
      const matchesBatch = filters.batch === "all" || s.batchYear === filters.batch;
      return matchesQuery && matchesIndustry && matchesRole && matchesBatch;
    });
    list = list.sort((a, b) => {
      if (filters.sort === "liked") return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [stories, filters]);

  const onCreate = (s: AlumniStory) => setStories((prev) => [s, ...prev]);

  const onLike = (id: string, liked: boolean) =>
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, likes: s.likes + (liked ? 1 : -1) } : s)));

  const onComment = (id: string, text: string) =>
    setStories((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, comments: [{ id: crypto.randomUUID(), author: "You", text, createdAt: new Date().toISOString() }, ...s.comments] }
          : s,
      ),
    );

  return (
    <main className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="container py-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Alumni Stories</h1>
            <p className="text-muted-foreground">Discover journeys and share your own to guide the next generation.</p>
          </div>
          <div className="mt-6">
            <FiltersBar value={filters} onChange={setFilters} />
          </div>
        </div>
      </section>

      <Dialog open={openPost} onOpenChange={setOpenPost}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Share your journey</DialogTitle>
          </DialogHeader>
          <PostStoryForm
            onCreate={(s) => {
              onCreate(s);
              setOpenPost(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <section className="container pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Story Feed</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} result(s)</p>
        </div>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} onLike={onLike} onComment={onComment} onShare={() => {}} />
          ))}
        </div>
        <Separator className="mt-8" />
        <p className="text-center text-sm text-muted-foreground mt-6">End of feed</p>
      </section>

      <FloatingShareButton targetId="post-story" />
    </main>
  );
}
