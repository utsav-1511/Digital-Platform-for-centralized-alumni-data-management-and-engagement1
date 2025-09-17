import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera, Check, Edit, Link as LinkIcon, Mail, Plus, UserPlus, Users, GraduationCap, Lock } from "lucide-react";

interface Post { id: number; title: string; description: string; imageUrl?: string }
interface Person { name: string; headline?: string; avatar?: string; profileUrl?: string }


interface Me {
  name: string;
  designation: string;
  batch: string;
  bio: string;
  cover: string;
  avatar: string;
  college: string;
  degree: string;
  skills: string[];
  contact: {
    email: string;
    website: string;
  };
  posts: Post[];
  followers: Person[];
  following: Person[];
  additionalAbout?: string;
  education: {
    college: string;
    batch: string;
    degree: string;
  };
}
const initialMe: Me = {
  name: "Utsav Kushwaha",
  designation: "Software Engineer",
  batch: "2027",
  bio:
    "Driven software engineer with a passion for creating innovative solutions and impactful products. Always eager to learn and collaborate with fellow alumni.",
  cover:
    "https://images.unsplash.com/photo-1520975682031-ae4ce7d2439b?q=80&w=1600&auto=format&fit=crop",
  avatar:
    "https://media.licdn.com/dms/image/v2/D5603AQEIVSCXlRcjCA/profile-displayphoto-scale_400_400/B56ZkUTd_FIAAg-/0/1756982274618?e=1759968000&v=beta&t=T7UUy-KWkcCBPxtr_Q5kj9Q1jDYEe09TU9Q4qRV6d6Q",
  college: "IIT Delhi",
  degree: "B.Tech in Computer Science",
  skills: ["Front End", "Blockchain", "WebDev"],
  contact: {
    email: "utsav@gmail.com",
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
  ],
  followers: [
    { name: "Aditya", headline: "SWE • FinTech" },
    { name: "Aman", headline: "Product @ Startup" },
    { name: "Anisha", headline: "Data Scientist" },
    { name: "Diksha", headline: "UI/UX Designer" },
  ],
  following: [
    { name: "Siddharth", headline: "Full‑stack Dev" },
    { name: "Riya", headline: "Security Engineer" },
    { name: "Karan", headline: "DevOps" },
    { name: "Priya", headline: "Mobile Dev" },
    { name: "Mohit", headline: "ML Engineer" },
  ],
  additionalAbout: "",
  education: {
    college: "IIT Delhi",
    batch: "2027",
    degree: "B.Tech",
  },
};

export default function MyProfile() {
  const [me, setMe] = useState(initialMe);
  const [draft, setDraft] = useState(initialMe);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showAllFollowers, setShowAllFollowers] = useState(false);
  const [showAllFollowing, setShowAllFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const followers = useMemo(
    () => (showAllFollowers ? draft.followers : draft.followers.slice(0, 6)),
    [showAllFollowers, draft.followers],
  );
  const following = useMemo(
    () => (showAllFollowing ? draft.following : draft.following.slice(0, 6)),
    [showAllFollowing, draft.following],
  );

  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, cover: reader.result as string });
    reader.readAsDataURL(file);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (draft.skills.includes(s)) return setNewSkill("");
    setDraft({ ...draft, skills: [...draft.skills, s] });
    setNewSkill("");
  };
  const removeSkill = (s: string) => setDraft({ ...draft, skills: draft.skills.filter((x) => x !== s) });

  const save = () => {
    setMe(draft);
    setIsEditing(false);
    toast.success("Profile updated");
  };
  const cancel = () => {
    setDraft(me);
    setIsEditing(false);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && selectedPost) {
        setSelectedPost(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Cover + header */}
        <div className="relative">
          <div
            className="h-44 rounded-2xl bg-cover bg-center md:h-56"
            style={{ backgroundImage: `url(${draft.cover})` }}
          />
          <div className="absolute right-4 top-4">
            <label htmlFor="cover-input">
              <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
              <Button variant="secondary" className="gap-2">
                <Camera className="h-4 w-4" /> Edit cover
              </Button>
            </label>
          </div>
          <div className="-mb-10 mt-[-44px] flex flex-col items-center gap-4 md:mt-[-56px] md:flex-row md:items-end md:gap-6">
            <div>
              <label htmlFor="avatar-input" className="relative block">
                <input id="avatar-input" type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                <Avatar className="h-24 w-24 rounded-xl border-4 border-white shadow-card">
                  <AvatarImage src={draft.avatar} alt={draft.name} />
                  <AvatarFallback className="rounded-xl">{draft.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 rounded-md bg-background/90 p-1.5 text-xs shadow ring-1 ring-border">Edit</span>
              </label>
            </div>
            <div className="md:pb-2">
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={draft.designation}
                      onChange={(e) => setDraft({ ...draft, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="batch">Batch</Label>
                    <Input id="batch" value={draft.batch} onChange={(e) => setDraft({ ...draft, batch: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="college">College</Label>
                    <Input
                      id="college"
                      value={draft.college}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={draft.degree}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold md:text-2xl">{me.name}</h1>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {me.designation} • {me.college} • Batch {me.batch}
                  </div>
                </>
              )}
            </div>
            <div className="mt-2 flex w-full justify-center gap-2 md:ml-auto md:w-auto">
              {isEditing ? (
                <>
                  <Button className="gap-2" onClick={save}>
                    <Check className="h-4 w-4" /> Save changes
                  </Button>
                  <Button variant="secondary" onClick={cancel}>Cancel</Button>
                </>
              ) : (
                <Button className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" /> Edit profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <div className="stat rounded-xl bg-white p-6 shadow-card flex flex-col items-center">
            <div className="stat-title text-sm text-muted-foreground mb-2">Connections</div>
            <div className="stat-value text-2xl font-bold text-primary">{draft.followers.length + draft.following.length}</div>
          </div>
          <div className="stat rounded-xl bg-white p-6 shadow-card flex flex-col items-center">
            <div className="stat-title text-sm text-muted-foreground mb-2">Posts</div>
            <div className="stat-value text-2xl font-bold text-primary">{draft.posts.length}</div>
          </div>
           <div className="stat rounded-xl bg-white p-6 shadow-card flex flex-col items-center">
            <div className="stat-title text-sm text-muted-foreground mb-2">Followers</div>
            <div className="stat-value text-2xl font-bold text-primary">{draft.followers.length}</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>About</CardTitle>
                {!isEditing && <CardDescription>{me.bio}</CardDescription>}
                </CardHeader>
                <CardContent>
                {isEditing ? (
                  <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    rows={4}
                    className="mt-2 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  />
                  </div>
                ) : null}
                <Separator className="my-6" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={`mailto:${me.contact.email}`}>
                  <Mail className="h-4 w-4" /> {me.contact.email}
                  </a>
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" href={me.contact.website} target="_blank" rel="noreferrer">
                  <LinkIcon className="h-4 w-4" /> {me.contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
                {isEditing && (
                  <div className="mt-6">
                  <Label htmlFor="additional-about">Additional About</Label>
                  <textarea
                    id="additional-about"
                    rows={3}
                    className="mt-2 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={draft.additionalAbout || ""}
                    onChange={(e) => setDraft({ ...draft, additionalAbout: e.target.value })}
                    placeholder="Add more about yourself..."
                  />
                  </div>
                )}
                {!isEditing && draft.additionalAbout && (
                  <div className="mt-6 text-sm text-muted-foreground">
                  <strong>Additional About:</strong> {draft.additionalAbout}
                  </div>
                )}
                {/* Added Education Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Education</h3>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{me.college} • Batch of {me.batch}</span>
                    </div>
                  </div>
                </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Your recent posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              {me.posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col rounded-xl border bg-white shadow-card overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setSelectedPost(post)}
                >
                {post.imageUrl ? (
                  <div className="w-full h-64 bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="h-full w-full object-cover"
                  />
                  </div>
                ) : (
                  <div className="w-full h-64 grid place-items-center bg-slate-100 text-lg text-slate-400">No image</div>
                )}
                <div className="p-6">
                  <div className="font-semibold text-lg mb-2">{post.title}</div>
                  <div className="text-base text-muted-foreground">{post.description}</div>
                </div>
                </div>
              ))}
              
              {/* Add the modal */}
              {selectedPost && (
                <PostModal
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                />
              )}

              {isEditing ? (
                <div className="rounded-xl border border-dashed p-6 bg-slate-50">
                <div className="mb-2 text-base font-semibold">Add new post</div>
                <NewPost
                  onAdd={(p) => {
                  setDraft({ ...draft, posts: [...draft.posts, p] });
                  setMe({ ...me, posts: [...me.posts, p] });
                  toast.success("Post added");
                  }}
                />
                </div>
              ) : null}
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" /> Followers</CardTitle>
                <CardDescription>{me.followers.length} total</CardDescription>
              </CardHeader>
              <CardContent>
                <PeopleGrid people={followers} />
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="secondary" onClick={() => setShowAllFollowers((v) => !v)}>
                    {showAllFollowers ? "Show less" : "See all"}
                  </Button>
                  <a href="#" className="text-sm text-primary hover:underline">Manage followers</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><UserPlus className="h-4 w-4" /> Following</CardTitle>
                <CardDescription>{me.following.length} total</CardDescription>
              </CardHeader>
              <CardContent>
                <PeopleGrid people={following} />
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="secondary" onClick={() => setShowAllFollowing((v) => !v)}>
                    {showAllFollowing ? "Show less" : "See all"}
                  </Button>
                  <a href="#" className="text-sm text-primary hover:underline">Manage following</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
                <CardDescription>Update your expertise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {draft.skills.map((s) => (
                    <span key={s} className="group inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs">
                      {s}
                      {isEditing ? (
                        <button className="ml-1 rounded-full p-0.5 hover:bg-accent/60" aria-label={`Remove ${s}`} onClick={() => removeSkill(s)}>
                          ×
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
                {isEditing ? (
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} className="gap-1">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {people.map((p) => (
        <Link
          key={p.name}
          to={`/profile/${encodeURIComponent(p.name)}?headline=${encodeURIComponent(p.headline || '')}`}
          className="group rounded-lg border p-3 transition-colors hover:bg-accent/40"
        >
          <div className="mb-2 h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200" />
          <div className="text-sm font-medium leading-tight group-hover:underline">{p.name}</div>
          {p.headline ? <div className="text-xs text-muted-foreground">{p.headline}</div> : null}
        </Link>
      ))}
    </div>
  );
}

function NewPost({ onAdd }: { onAdd: (p: Post) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const add = () => {
    if (!title.trim() || !description.trim()) return;
    const id = Date.now();
    onAdd({ id, title, description, imageUrl });
    setTitle("");
    setDescription("");
    setImageUrl("");
  };
  return (
    <div className="grid gap-3">
      <div>
        <Label htmlFor="p-title">Title</Label>
        <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="p-desc">Description</Label>
        <textarea
          id="p-desc"
          rows={3}
          className="mt-1 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="p-img">Image URL</Label>
        <Input id="p-img" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div className="flex justify-end">
        <Button onClick={add} className="gap-2">
          <Plus className="h-4 w-4" /> Add post
        </Button>
      </div>
    </div>
  );
}

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4
  animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto
  animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {post.imageUrl ? (
          <div className="w-full h-[60vh] bg-slate-100">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-[60vh] grid place-items-center bg-slate-100 text-lg text-slate-400">
            No image
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
          <p className="text-lg text-muted-foreground">{post.description}</p>
        </div>
        <div className="p-4 border-t bg-slate-50 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

// Add this component to show locked fields
// Reusable component to display locked fields
function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative">
        <Label>{label}</Label>
        <div className="mt-1 flex items-center">
          <Input value={value} disabled className="bg-muted pr-8" />
          <Lock className="absolute right-2 h-4 w-4 text-muted-foreground" />
        </div>
    </div>
  );
}
