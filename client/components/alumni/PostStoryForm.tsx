import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Link as LinkIcon, FileBadge2 } from "lucide-react";

import type { AlumniStory, StoryAttachment, StoryTimelineItem } from "./StoryCard";

export type PostStoryFormValues = {
  name: string;
  role: string;
  batchYear: number | undefined;
  industry: string;
  headline: string;
  story: string;
  links: string[];
  images: string[];
};

export function PostStoryForm({ onCreate }: { onCreate: (story: AlumniStory) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [batchYear, setBatchYear] = useState<number | undefined>(undefined);
  const [industry, setIndustry] = useState("Software");
  const [headline, setHeadline] = useState("");
  const [story, setStory] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 1 &&
      role.trim().length > 1 &&
      !!batchYear &&
      industry.trim().length > 0 &&
      headline.trim().length > 5 &&
      story.trim().length > 20
    );
  }, [name, role, batchYear, industry, headline, story]);

  const addLink = () => {
    const v = linkInput.trim();
    if (!v) return;
    setLinks((prev) => Array.from(new Set([...prev, v])));
    setLinkInput("");
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls: string[] = [];
    Array.from(files).forEach((f) => {
      const u = URL.createObjectURL(f);
      urls.push(u);
    });
    setImages((prev) => [...urls, ...prev].slice(0, 9));
  };

  const onSubmit = () => {
    if (!canSubmit) return;
    const id = crypto.randomUUID();

    const timeline: StoryTimelineItem[] = story
      .split(/\n\n+/)
      .map((para, idx) => {
        const [firstLine, ...rest] = para.split("\n");
        return {
          id: `${id}-${idx}`,
          date: new Date(Date.now() - (story.length - idx) * 86400000).toLocaleDateString(),
          title: firstLine || `Step ${idx + 1}`,
          description: rest.join("\n") || para,
        } as StoryTimelineItem;
      })
      .slice(0, 6);

    const attachments: StoryAttachment[] = [
      ...images.map((url, i) => ({ id: `${id}-img-${i}`, type: "image" as const, url, label: `Image ${i + 1}` })),
      ...links.map((url, i) => ({ id: `${id}-lnk-${i}`, type: "link" as const, url, label: url })),
    ];

    const initials = name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newStory: AlumniStory = {
      id,
      name,
      initials,
      role,
      batchYear: batchYear!,
      industry,
      headline,
      timeline: timeline.length ? timeline : [
        { id: `${id}-0`, date: new Date().toLocaleDateString(), title: "Journey", description: story },
      ],
      attachments,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onCreate(newStory);

    setName("");
    setRole("");
    setBatchYear(undefined);
    setIndustry("Software");
    setHeadline("");
    setStory("");
    setLinks([]);
    setImages([]);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Share your journey</h2>
        <p className="text-sm text-muted-foreground">Inspire juniors and peers with your career path.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Current role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Select onValueChange={(v) => setBatchYear(parseInt(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Batch year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={industry} onValueChange={(v) => setIndustry(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Software",
                "Finance",
                "Consulting",
                "Healthcare",
                "Education",
                "Manufacturing",
                "Marketing",
                "Research",
              ].map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input placeholder="Professional headline (e.g. From Intern to Senior Data Scientist)" value={headline} onChange={(e) => setHeadline(e.target.value)} />

        <div>
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={"Write your story. Use blank lines to separate milestones. First line of each paragraph becomes the title."}
            className="min-h-32"
          />
          <p className="mt-2 text-xs text-muted-foreground">Tip: Separate milestones with blank lines. We’ll render them as a timeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Links & Projects</p>
              <div className="flex items-center gap-2">
                <Input
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://project or certificate link"
                />
                <Button type="button" onClick={addLink} className="whitespace-nowrap">Add</Button>
              </div>
            </div>
            {links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {links.map((l) => (
                  <Badge key={l} variant="secondary" className="gap-1">
                    <LinkIcon className="h-3 w-3" /> {l}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Images & Certificates</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" /> Upload images
              </Button>
              <Badge variant="outline" className="gap-1">
                <FileBadge2 className="h-3 w-3" /> {images.length} selected
              </Badge>
            </div>
            {images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <img key={i} src={src} className="h-20 w-full object-cover rounded-md border" alt={`upload-${i}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button onClick={onSubmit} disabled={!canSubmit}>Post Story</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostStoryForm;
