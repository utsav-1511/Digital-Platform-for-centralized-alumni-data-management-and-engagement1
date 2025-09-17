import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingShareButton({ targetId = "post-story" }: { targetId?: string }) {
  const onClick = () => {
    const event = new CustomEvent("open-post-story");
    window.dispatchEvent(event);
    const el = document.getElementById(targetId);
    if (!el) {
      // Fallback: set hash in case a page without listener uses this button
      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button onClick={onClick} className="h-12 rounded-full shadow-lg md:pr-5">
        <Plus className="mr-0 md:mr-2 h-5 w-5" />
        <span className="hidden md:inline">Share your journey</span>
      </Button>
    </div>
  );
}
