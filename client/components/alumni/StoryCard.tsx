import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Share2, ExternalLink, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StoryTimelineItem = {
  id: string;
  date: string;
  title: string;
  description: string;
};

export type StoryAttachment = {
  id: string;
  type: "image" | "link" | "certificate";
  url: string;
  label?: string;
};

export type AlumniStory = {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  role: string;
  batchYear: number;
  industry: string;
  headline: string;
  timeline: StoryTimelineItem[];
  attachments?: StoryAttachment[];
  likes: number;
  comments: { id: string; author: string; text: string; createdAt: string }[];
  createdAt: string;
};

export type StoryCardProps = {
  story: AlumniStory;
  onLike?: (id: string, liked: boolean) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (id: string) => void;
  className?: string;
};

export function StoryCard({ story, onLike, onComment, onShare, className }: StoryCardProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const likeCount = useMemo(() => story.likes + (liked ? 1 : 0), [story.likes, liked]);

  const share = () => {
    const storyUrl = `${window.location.origin}/?story=${story.id}`;
    navigator.clipboard.writeText(storyUrl).catch(() => {});
    onShare?.(story.id);
  };

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onComment?.(story.id, text);
    setCommentText("");
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            {story.avatar ? (
              <AvatarImage src={story.avatar} alt={story.name} />
            ) : (
              <AvatarFallback>{story.initials ?? story.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold leading-none text-foreground">{story.name}</p>
              <span className="text-muted-foreground">·</span>
              <p className="text-sm text-muted-foreground">Batch {story.batchYear}</p>
              <Badge variant="outline" className="ml-auto">{story.industry}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{story.role}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold leading-tight mt-4">{story.headline}</h3>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="space-y-4">
          <ol className="relative border-s border-border pl-6">
            {story.timeline.map((t) => (
              <li key={t.id} className="mb-6 ms-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                <time className="text-xs text-muted-foreground">{t.date}</time>
                <h4 className="font-medium mt-1">{t.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              </li>
            ))}
          </ol>

          {story.attachments && story.attachments.length > 0 && (
            <div>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {story.attachments.map((a) => (
                  <a
                    key={a.id}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative rounded-md border bg-muted/20 overflow-hidden"
                  >
                    {a.type === "image" ? (
                      <img src={a.url} alt={a.label ?? "attachment"} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="h-28 w-full flex items-center justify-center text-muted-foreground">
                        {a.type === "certificate" ? (
                          <ImageIcon className="h-6 w-6" />
                        ) : (
                          <LinkIcon className="h-6 w-6" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 px-2 py-1 text-[11px] text-white flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{a.label ?? a.url}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <div className="w-full">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <button
              className={cn("inline-flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors", liked ? "text-primary" : "hover:bg-accent")}
              aria-pressed={liked}
              onClick={() => {
                const next = !liked;
                setLiked(next);
                onLike?.(story.id, next);
              }}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              <span>{likeCount}</span>
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-accent"
              onClick={() => setShowComments((s) => !s)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{story.comments.length}</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-accent" onClick={share}>
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="h-8">View Details</Button>
            </div>
          </div>

          {showComments && (
            <div className="mt-4 space-y-3">
              <Separator />
              <ul className="space-y-3">
                {story.comments.map((c) => (
                  <li key={c.id} className="text-sm">
                    <span className="font-medium">{c.author}</span>
                    <span className="text-muted-foreground"> · {new Date(c.createdAt).toLocaleString()}</span>
                    <p className="text-muted-foreground mt-1">{c.text}</p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button size="sm" onClick={submitComment} className="h-9">Post</Button>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default StoryCard;
