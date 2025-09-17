import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {BookOpenText} from "lucide-react";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Search,
  PanelLeftDashed,
} from "lucide-react";
import { AlignEndHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"; 
import { ReactNode, useState, useEffect, useRef } from "react";
import AIChatbot from "@/components/ai/AIChatbot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Share2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Alumni Directory", icon: Users, to: "/directory" },
  { label: "Story", icon: BookOpenText, to: "/alumni-stories" },
  { label: "Alumni Directory", icon: Users, to: "/directory" },
  { label: "Events", icon: Calendar, to: "/events" },
  { label: "Forum/Chat", icon: MessageSquare, to: "/forum" },
  { label: "Leaderboard", icon: AlignEndHorizontal, to: "/leaderboard" },
  { label: "Settings", icon: Settings, to: "/settings" },
  { label: "Become a Mentor", icon: PanelLeftDashed, to: "/become-mentor" },
];

function Topbar() {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const inviteLink = `${window.location.origin}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard!");
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on the Alumni Hub!",
          text: "I just joined our new alumni website, and it's been fun catching up. You should join too!",
          url: inviteLink,
        });
        toast.success("Link shared successfully!");
      } catch (error) {
        toast.error("Could not share the link.");
      }
    } else {
      // Fallback for browsers that don't support the Share API
      copyToClipboard();
      toast.info("Share not supported, link copied instead.");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-background/90 text-foreground/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
  
  <div className="flex items-center gap-3">
    <SidebarTrigger className="md:hidden" />
    <div>
      <div className="text-lg font-semibold text-primary">
        Alumni Hub
      </div>
    </div>
  </div>

  <div className="flex flex-1 items-center justify-center">
    {/* <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1> */}
  </div>

  <div className="flex items-center gap-3">
    <div className="hidden md:flex items-center gap-2">
      <div className="relative w-72">
        <Input placeholder="Search alumni, events..." />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>

    <Button className="hidden sm:inline-flex" onClick={() => setInviteOpen(true)}>
      Invite Alumni
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>UK</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card text-card-foreground">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => navigate("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/logout")}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={isInviteOpen} onOpenChange={setInviteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Alumni</DialogTitle>
          <DialogDescription>
            Hello,

              We are excited to invite you to join Alumni Hub – the official platform for our CSE Association alumni! {<br></br>}
              👉 {inviteLink} – Sign up now and be part of our growing community!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input value={inviteLink} readOnly />
          <Button variant="secondary" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button onClick={shareLink} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={() => setInviteOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>
  );
}

export default function AlumniLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [showTopbar, setShowTopbar] = useState(true);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleScroll = () => {
      const currentScrollY = mainContent.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down
        setShowTopbar(false);
      } else {
        // Scrolling up
        setShowTopbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white font-bold">
              A
            </div>
            <div>
              <div className="text-sm font-semibold">Alumni Hub</div>
              <div className="text-xs text-muted-foreground">
                CSE Association
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ label, icon: Icon, to }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        location.pathname === to ||
                        location.pathname.startsWith(to + "/")
                      }
                    >
                      <Link to={to} className="flex items-center gap-2">
                        <Icon className="text-primary" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex w-full flex-col gap-2 p-3">
            <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
              Tip: Press ⌘/Ctrl + B to toggle the sidebar
            </div>
            <div className="flex items-center justify-between">
              <Link
                to="/logout"
                className="text-sm text-primary hover:underline"
              >
                Sign out
              </Link>
              <div className="text-xs text-muted-foreground">v1.0</div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset
        ref={mainContentRef}
        className="bg-background text-foreground transition-colors duration-300 overflow-y-auto"
      >
        <div className={cn("transform-gpu transition-transform duration-300", !showTopbar && "-translate-y-full")}> <Topbar /></div>
        <div className={cn("mx-auto w-full max-w-7xl p-4 md:p-0")}>
          {children ?? <Outlet />}
        </div>
        <AIChatbot />
      </SidebarInset>
    </SidebarProvider>
  );
}
