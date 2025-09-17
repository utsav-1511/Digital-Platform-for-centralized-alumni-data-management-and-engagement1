import { useEffect, useMemo, useState, useRef } from "react";
import { Card } from "@/components/ui/card";

export default function Forum() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetch("/api/chat/rooms")
      .then((r) => r.json())
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    // load existing messages
    fetch(`/api/chat/rooms/${selected}/messages`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => setMessages([]));

    // close existing eventsource
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(`/api/chat/rooms/${selected}/subscribe`);
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessages((m) => [...m, data]);
      } catch (err) {}
    };
    es.onerror = () => {
      // handle
    };
    esRef.current = es;

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [selected]);

  const createRoom = async () => {
    const name = prompt("Room name");
    if (!name) return;
    const token = localStorage.getItem("token");
    const res = await fetch("/api/chat/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return alert("Failed to create room");
    const room = await res.json();
    setRooms((r) => [room, ...r]);
    setSelected(room.id);
  };

  const sendMessage = async () => {
    if (!selected || !input.trim()) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/chat/rooms/${selected}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ content: input, sender: "Me" }),
    });
    if (!res.ok) return alert("Failed to send message");
    setInput("");
    // message will be appended via SSE
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 md:p-3">
      <div className="md:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Forum & Chat</h2>
          <div>
            <button
              onClick={createRoom}
              className="rounded-md bg-primary px-3 py-2 text-white"
            >
              New Room
            </button>
          </div>
        </div>

        <Card className="p-2">
          <div className="space-y-2">
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`cursor-pointer rounded-md p-2 ${selected === r.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
              >
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="text-sm text-muted-foreground p-2">
                No rooms yet
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">
            {selected
              ? `Room: ${rooms.find((r) => r.id === selected)?.name}`
              : "Select a room"}
          </div>
        </div>

        <Card className="p-4 mb-4 h-[60vh] overflow-auto">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-md bg-white/60 p-3 shadow-sm">
                <div className="text-sm font-medium">{m.sender}</div>
                <div className="text-sm text-muted-foreground">{m.content}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No messages yet
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Write a message..."
          />
          <button
            onClick={sendMessage}
            className="rounded-md bg-primary px-4 py-2 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
