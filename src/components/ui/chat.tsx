import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatProps {
  className?: string;
}

export function Chat({ className }: ChatProps) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou o assistente virtual do Centro de Inovação Tecnológica de Tarumã. Como posso ajudá-lo hoje?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const webhookUrl = "https://webhook.weeego.com.br/webhook/cit";

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Send message to N8n webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          timestamp: new Date().toISOString(),
          user_id: "web_user_" + Date.now(),
          session_id: "session_" + Date.now()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Resposta do webhook:", data); // Debug
        
        // Use a resposta do webhook N8n (campo "output")
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.output || "Desculpe, não recebi uma resposta válida.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      } else {
        console.error("Erro na resposta do webhook:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error("Error sending message to N8n:", error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col h-[600px] bg-card/80 backdrop-blur-sm border-border/50 shadow-elegant overflow-hidden", className)}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-6 border-b border-border/30 bg-gradient-primary/90 backdrop-blur-sm">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary-foreground/20"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-foreground text-lg">CIT | Tarumã</h3>
          <p className="text-sm text-primary-foreground/70">Centro de Inovação Tecnológica • Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-sm">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                {/* Online status for assistant */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[75%] sm:max-w-[65%] rounded-2xl p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md",
                message.role === "user"
                  ? "bg-gradient-primary text-primary-foreground ml-8 sm:ml-14"
                  : "bg-card/60 border border-border/40 text-foreground mr-8 sm:mr-14"
              )}
            >
              <p className="text-sm leading-relaxed mb-2">{message.content}</p>
              <span className="text-xs opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.role === "user" && (
              <Avatar className="w-10 h-10 border-2 border-accent/20 shadow-sm">
                <AvatarFallback className="bg-accent/10 text-accent">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in">
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-sm">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
            </div>
            <div className="bg-card/60 border border-border/40 text-foreground rounded-2xl p-4 mr-8 sm:mr-14 backdrop-blur-sm">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta sobre nossos serviços..."
            className="flex-1 bg-card/50 border-border/40 focus:border-primary focus:ring-primary/20 rounded-2xl px-4 py-3 backdrop-blur-sm transition-all duration-200"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-primary-glow transition-all duration-300 rounded-2xl px-4 py-3 min-w-[48px] h-auto"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </Card>
  );
}