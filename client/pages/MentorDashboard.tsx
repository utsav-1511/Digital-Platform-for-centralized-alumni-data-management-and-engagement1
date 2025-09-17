import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message { id: string; from: "me" | "them"; text: string; time: string }
interface Mentee { id: string; name: string; role: string; lastMessage: string }

const sampleMentees: Mentee[] = [
  { id: "m1", name: "Rahul Kumar", role: "CS Student", lastMessage: "Can we connect this weekend?" },
  { id: "m2", name: "Priya Singh", role: "Data Analyst", lastMessage: "Thanks for the resume tips!" },
  { id: "m3", name: "Arjun Mehta", role: "Frontend Intern", lastMessage: "Any React resources?" },
];

const sampleMessages: Record<string, Message[]> = {
  m1: [
    { id: "1", from: "them", text: "Hi! I'm interested in data science.", time: "10:00" },
    { id: "2", from: "me", text: "Great! Let's plan a roadmap.", time: "10:05" },
  ],
  m2: [{ id: "3", from: "them", text: "Could you review my resume?", time: "12:00" }],
  m3: [{ id: "4", from: "them", text: "How do I learn React?", time: "14:00" }],
};

export default function MentorDashboard() {
  const [active, setActive] = useState<Mentee>(sampleMentees[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages[active.id] ?? []);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: Message = { id: crypto.randomUUID(), from: "me", text, time: new Date().toLocaleTimeString() };
    setMessages((m) => [...m, msg]);
    setInput("");
  };

  const choose = (m: Mentee) => {
    setActive(m);
    setMessages(sampleMessages[m.id] ?? []);
  };

  return (
    <main className="container py-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-4 min-h-[520px]">
        <Card>
          <CardHeader>
            <CardTitle>Your Mentees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleMentees.map((m) => (
              <button
                key={m.id}
                className={`w-full rounded-md border px-3 py-2 text-left ${active.id === m.id ? "bg-accent" : "hover:bg-accent"}`}
                onClick={() => choose(m)}
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{m.lastMessage}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Chat with {active.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${msg.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.text}
                  <div className="text-[10px] opacity-70 mt-1">{msg.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t flex items-center gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }} />
            <Button onClick={send}>Send</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
