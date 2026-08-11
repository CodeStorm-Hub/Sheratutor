"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = { role: "assistant" | "student"; text: string };

export function ExplainSimplyButton({
  questionText,
  stepName,
  observation,
}: {
  questionText: string;
  stepName: string;
  observation: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: `Let's talk about "${stepName}" — ask me anything about it.` },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  async function send() {
    if (!input.trim() || pending) return;
    const studentMessage = input;
    setMessages((m) => [...m, { role: "student", text: studentMessage }]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          studentAnswerChunk: observation,
          rubricFailureReason: observation,
          studentMessage,
        }),
      });
      const json = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: json.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong. Try again?" }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-mint-deep dark:text-mint">
          Explain it simply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Explain it simply</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 pr-4">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg p-3 max-w-[85%] ${
                  m.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up…"
            disabled={pending}
          />
          <Button type="submit" disabled={pending}>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
