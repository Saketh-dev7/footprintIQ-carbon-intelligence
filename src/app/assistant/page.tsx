"use client"

import { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithSustainabilityAssistant } from '@/ai/flows/conversational-sustainability-assistant';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your FootprintIQ Sustainability Assistant. How can I help you reduce your carbon footprint today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatWithSustainabilityAssistant(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 pt-12 max-w-4xl h-[calc(100vh-140px)] flex flex-col" role="main">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            AI Intelligence
          </div>
          <h1 className="text-4xl font-headline font-bold mb-2">Sustainability Assistant</h1>
          <p className="text-muted-foreground">Ask anything about living a greener life.</p>
        </header>

        <div className="flex-1 glass border-white/5 rounded-[2rem] overflow-hidden flex flex-col mb-6">
          <ScrollArea className="flex-1 p-6 md:p-10">
            <div 
              className="space-y-8" 
              aria-live="polite" 
              aria-relevant="additions"
              role="log"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-primary'}`}
                      aria-hidden="true"
                    >
                      {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-4 rounded-3xl ${m.role === 'user' ? 'bg-primary/20 rounded-tr-none border border-primary/20' : 'bg-white/5 rounded-tl-none border border-white/5'}`}>
                      <p className="text-sm md:text-base leading-relaxed">
                        <span className="sr-only">{m.role === 'user' ? 'You' : 'Assistant'} said: </span>
                        {m.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 text-primary flex items-center justify-center shrink-0">
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 rounded-tl-none border border-white/5 flex items-center gap-1">
                      <span className="sr-only">Assistant is typing...</span>
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <footer className="p-6 border-t border-white/5 bg-white/5">
            <div className="relative max-w-3xl mx-auto flex gap-3">
              <label htmlFor="chat-input" className="sr-only">Type your question about sustainability</label>
              <Input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about reducing air travel, diet impact, or green alternatives..."
                className="h-14 rounded-2xl bg-black/40 border-white/10 focus-visible:ring-primary px-6 pr-14"
              />
              <Button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="h-14 w-14 rounded-2xl shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
