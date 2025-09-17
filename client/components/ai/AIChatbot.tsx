import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!open) return;
    // focus input when opened
    const el = boxRef.current?.querySelector("textarea");
    (el as HTMLTextAreaElement | null)?.focus();
  }, [open]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        let errorText = `AI service error: ${res.status} ${res.statusText} - The requested endpoint was not found.`;
        try {
          const errorData = await res.json();
          errorText = errorData?.error || errorData?.details || errorText;
        } catch (e) { // if json parsing fails, keep the original error
        }
        setMessages((m) => [...m, { from: "ai", text: `Error: ${errorText}` }]);
      } else {
        const data = await res.json();        setMessages((m) => [          ...m,
          { from: "ai", text: data.reply || "No reply" },
        ]);
      }
    } catch (e: any) {
      let errorMessage = "Network error";
      if (e instanceof SyntaxError) {
        errorMessage = `JSON parse error: ${e.message}`;
      } else {
        errorMessage = `Network error: ${e.message}`;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg"
          onClick={() => setOpen((s) => !s)}
          aria-label="Open AI chat"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 md:w-96">
          <div
            ref={boxRef}
            className="rounded-lg bg-white shadow-lg ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="font-semibold">AI Assistant</div>
              <div className="text-xs text-muted-foreground">Gemini</div>
            </div>
            <div className="p-3 h-64 overflow-auto space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-md p-2 ${m.from === "user" ? "bg-primary/10 self-end" : "bg-slate-100"}`}
                >
                  <div className="text-sm">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                className="flex-1 resize-none rounded-md border px-2 py-1 text-sm"
                placeholder="Ask AI..."
              />
              <button
                onClick={send}
                className="rounded-md bg-primary px-3 py-1 text-white"
                disabled={loading}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
