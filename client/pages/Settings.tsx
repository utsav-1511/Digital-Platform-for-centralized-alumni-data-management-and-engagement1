import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Bell,
  HelpCircle,
  Palette,
  Save,
  Shield,
  Upload,
  User,
  Mail,
  CalendarDays,
  MessageSquare,
  Smartphone,
  Laptop,
  ExternalLink,
  Plus,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

export default function Index() {
  const [theme, setTheme, toggleTheme] = useTheme();
  const [exampleFromServer, setExampleFromServer] = useState("");

  // Demo fetch kept to show server connectivity (hidden visually)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/demo");
        const data = await res.json();
        setExampleFromServer((data && data.message) || "");
      } catch (err) {
        // silent
      }
    })();
  }, []);

  // Account state
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [form, setForm] = useState({
    fullName: "Utsav",
    email: "utsav@gmail.com",
    phone: "+91 9821272145",
    password: "",
  });
  const [twoFA, setTwoFA] = useState(false);

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);

  // Privacy
  const [hideFromDirectory, setHideFromDirectory] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  // Sessions (sample realistic data)
  const sessions: Session[] = useMemo(
    () => [
      {
        id: "current",
        device: "MacBook Pro · Safari",
        location: "San Francisco, USA",
        lastActive: "Just now",
        current: true,
      },
      {
        id: "iphone",
        device: "iPhone 14 · Alumni Hub App",
        location: "San Francisco, USA",
        lastActive: "2 hours ago",
      },
      {
        id: "work-laptop",
        device: "Windows · Chrome",
        location: "Seattle, USA",
        lastActive: "Yesterday",
      },
    ],
    [],
  );

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeBlocked = (name: string) =>
    setBlockedUsers((prev) => prev.filter((n) => n !== name));

  const addBlocked = () => {
    const name = prompt("Block user by name or email:");
    if (!name) return;
    setBlockedUsers((prev) => Array.from(new Set([...prev, name])));
  };

  const saveAll = () => {
    // In a real app, submit to API here
    const payload = {
      theme,
      account: { ...form, password: form.password ? "updated" : undefined, twoFA },
      notifications: {
        email: notifEmail,
        events: notifEvents,
        chat: notifChat,
        weeklySummary,
      },
      privacy: { hideFromDirectory, blockedUsers },
    };
    console.log("Saved settings:", payload);
    const el = document.getElementById("save-toast");
    if (el) {
      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");
      setTimeout(() => {
        el.classList.add("opacity-0");
        el.classList.remove("opacity-100");
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
      <span>{label}</span>
    </a>
  );

  const Section = ({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) => (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        {desc ? <CardDescription>{desc}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const ThemePreview = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
          <Sun className="h-4 w-4" /> Light preview
        </div>
        <div className="space-y-2">
          <div className="h-10 rounded-md bg-slate-100" />
          <div className="h-6 w-1/2 rounded-md bg-slate-200" />
          <div className="h-6 w-1/3 rounded-md bg-slate-200" />
          <div className="h-9 w-28 rounded-md bg-[hsl(var(--primary))]" />
        </div>
      </div>
      <div className="rounded-lg border bg-slate-900 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Moon className="h-4 w-4" /> Dark preview
        </div>
        <div className="space-y-2">
          <div className="h-10 rounded-md bg-slate-800" />
          <div className="h-6 w-1/2 rounded-md bg-slate-700" />
          <div className="h-6 w-1/3 rounded-md bg-slate-700" />
          <div className="h-9 w-28 rounded-md bg-[hsl(var(--accent))]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="h-max rounded-xl border bg-card p-3 shadow-sm md:sticky md:top-6">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settings
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem href="#account" icon={User} label="Account" />
            <NavItem href="#notifications" icon={Bell} label="Notifications" />
            <NavItem href="#privacy" icon={Shield} label="Privacy" />
            <NavItem href="#theme" icon={Palette} label="Theme" />
            <NavItem href="#help" icon={HelpCircle} label="Help" />
          </nav>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Alumni Hub · Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account, privacy, notifications, and appearance.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button onClick={saveAll} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>

          {/* Account Settings */}
          <Section id="account" title="Account Settings" desc="Update your profile information and security.">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} alt={form.fullName} />
                    <AvatarFallback>{form.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="space-x-2">
                    <label htmlFor="avatar-upload">
                      <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                      <Button variant="secondary" className="gap-2" asChild>
                        <span>
                          <Upload className="h-4 w-4" /> Change
                        </span>
                      </Button>
                    </label>
                    {avatarUrl ? (
                      <Button variant="ghost" className="text-destructive" onClick={() => setAvatarUrl(undefined)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input 
                      id="fullName" 
                      value={form.fullName} 
                      onChange={handleInputChange}
                      className="focus:ring-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-muted-foreground">(login)</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleInputChange}
                      className="focus:ring-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={form.phone} 
                      onChange={handleInputChange}
                      className="focus:ring-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={form.password} 
                      onChange={handleInputChange}
                      className="focus:ring-2"
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <div className="font-medium">Two‑factor authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security to your account.</div>
                  </div>
                  <Switch checked={twoFA} onCheckedChange={setTwoFA} aria-label="Enable 2FA" />
                </div>
              </div>
            </div>
          </Section>

          {/* Notification Preferences */}
          <Section id="notifications" title="Notification Preferences" desc="Choose when Alumni Hub should reach you.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email notifications</div>
                    <div className="text-sm text-muted-foreground">Direct messages, mentions, and updates</div>
                  </div>
                </div>
                <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
              </div>

              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Event reminders</div>
                    <div className="text-sm text-muted-foreground">RSVPs, changes, and upcoming events</div>
                  </div>
                </div>
                <Switch checked={notifEvents} onCheckedChange={setNotifEvents} />
              </div>

              <div className="flex items-center justify-between rounded-md border p-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Chat alerts</div>
                    <div className="text-sm text-muted-foreground">New messages and replies</div>
                  </div>
                </div>
                <Switch checked={notifChat} onCheckedChange={setNotifChat} />
              </div>

              <div className="flex items-center justify-between rounded-md border p-4 md:col-span-2">
                <div>
                  <div className="font-medium">Weekly summary email</div>
                  <div className="text-sm text-muted-foreground">Highlights, new members, and trending posts</div>
                </div>
                <Switch checked={weeklySummary} onCheckedChange={setWeeklySummary} />
              </div>
            </div>
          </Section>

          {/* Privacy & Security */}
          <Section id="privacy" title="Privacy & Security" desc="Control how others see you and manage security.">
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <div className="font-medium">Hide profile from directory</div>
                  <div className="text-sm text-muted-foreground">People will not be able to find your profile in the alumni directory</div>
                </div>
                <Switch checked={hideFromDirectory} onCheckedChange={setHideFromDirectory} />
              </div>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Blocked users</CardTitle>
                  <CardDescription>Manage who can contact you</CardDescription>
                </CardHeader>
                <CardContent>
                  {blockedUsers.length === 0 ? (
                    <div className="flex items-center justify-between rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                      <span>No blocked users yet</span>
                      <Button variant="secondary" className="gap-2" onClick={addBlocked}>
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {blockedUsers.map((u) => (
                        <div key={u} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{u}</span>
                          </div>
                          <Button variant="ghost" className="text-destructive" onClick={() => removeBlocked(u)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Button variant="secondary" className="gap-2" onClick={addBlocked}>
                          <Plus className="h-4 w-4" /> Add another
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Session history</CardTitle>
                  <CardDescription>Devices that have accessed your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.id} className={cn("flex items-center justify-between rounded-md border p-3", s.current && "bg-accent/10")}>
                      <div className="flex items-center gap-3">
                        {/iphone|phone/i.test(s.device) ? (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Laptop className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{s.device}</div>
                          <div className="text-xs text-muted-foreground">{s.location} · {s.lastActive}{s.current ? " · Current session" : ""}</div>
                        </div>
                      </div>
                      <Button variant="ghost">Sign out</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Theme Settings */}
          <Section id="theme" title="Theme Settings" desc="Switch between light and dark modes with live preview.">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <div className="font-medium">Appearance</div>
                    <div className="text-sm text-muted-foreground">Choose your preferred color mode</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={theme === "light" ? "default" : "secondary"} onClick={() => setTheme("light")}>Light</Button>
                    <Button variant={theme === "dark" ? "default" : "secondary"} onClick={() => setTheme("dark")}>Dark</Button>
                  </div>
                </div>
                <ThemePreview />
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 font-medium">Brand colors</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="h-10 rounded-md bg-[hsl(var(--primary))]" />
                      <div className="mt-1 text-xs text-muted-foreground">Primary</div>
                    </div>
                    <div>
                      <div className="h-10 rounded-md bg-[hsl(var(--accent))]" />
                      <div className="mt-1 text-xs text-muted-foreground">Accent</div>
                    </div>
                    <div>
                      <div className="h-10 rounded-md bg-destructive" />
                      <div className="mt-1 text-xs text-muted-foreground">Destructive</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 font-medium">Accessibility</div>
                  <div className="text-sm text-muted-foreground">Colors and contrast tailored for readability.</div>
                </div>
              </div>
            </div>
          </Section>

          {/* System Info & Help */}
          <Section id="help" title="System Info & Help" desc="Version, updates, and support.">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">App status</CardTitle>
                  <CardDescription>Alumni Hub</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="font-medium">0.1.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Updates</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">Up to date</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <a href="#" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      Release notes <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Button variant="secondary">Check for updates</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Help & Support</CardTitle>
                  <CardDescription>We’re here to help</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    Browse help center <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    Contact support <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Feedback</CardTitle>
                  <CardDescription>Tell us what’s working and what to improve</CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="feedback">Your message</Label>
                  <textarea id="feedback" className="mt-2 w-full resize-y rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={4} placeholder="Share your thoughts..." />
                  <div className="mt-3">
                    <Button className="gap-2">
                      <SendIcon className="h-4 w-4" /> Submit feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <div className="h-10" />
        </main>
      </div>

      {/* Sticky footer actions */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto max-w-7xl px-4 pb-6 md:px-6">
        <div className="pointer-events-auto rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/75">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Your changes are local until saved.</div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Cancel</Button>
              <Button className="gap-2" onClick={saveAll}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tiny toast */}
      <div id="save-toast" className="pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 transform rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity">
        Settings saved
      </div>

      <p className="sr-only">{exampleFromServer}</p>
    </div>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
