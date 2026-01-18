import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, Square } from "lucide-react";
import { useVoiceRecorder, useVoiceStream } from "../../replit_integrations/audio";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Greetings, BlueCoder! Need help with a quest?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const recorder = useVoiceRecorder();
  const stream = useVoiceStream({
    onUserTranscript: (text) => {
      setMessages(prev => [...prev, { role: "user", text }]);
    },
    onTranscript: (delta, full) => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === "assistant") {
          return [...prev.slice(0, -1), { role: "assistant", text: full }];
        }
        return [...prev, { role: "assistant", text: full }];
      });
    },
    onError: (err) => console.error(err)
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message immediately
    const userMsg: Message = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    // In a real implementation, we would send this text to the chat API
    // For now, we'll simulate a response or use the voice flow if implemented for text
  };
  
  const handleVoiceToggle = async () => {
    if (recorder.state === "recording") {
      const blob = await recorder.stopRecording();
      // Use conversation ID 1 as default for the widget
      await stream.streamVoiceResponse("/api/conversations/1/messages", blob);
    } else {
      await recorder.startRecording();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] pixel-card flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary/10 p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-display text-xs text-primary">AI Companion</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "max-w-[85%] rounded-lg p-3 text-sm font-body leading-relaxed",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" 
                      : "bg-muted text-foreground mr-auto rounded-tl-none border border-border"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card/50">
              <div className="flex gap-2">
                <button
                  onClick={handleVoiceToggle}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    recorder.state === "recording" 
                      ? "bg-destructive text-destructive-foreground animate-pulse" 
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  {recorder.state === "recording" ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask for hints..."
                  className="flex-1 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50 border-2 border-primary-foreground/20"
      >
        <MessageCircle className="h-7 w-7 text-primary-foreground" />
      </button>
    </>
  );
}
