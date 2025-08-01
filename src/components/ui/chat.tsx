import { useState } from "react";
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
        
        // Use apenas a resposta do webhook N8n
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
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
    <Card className={cn("flex flex-col h-[600px] bg-card border-border shadow-card", className)}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-primary rounded-t-lg">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-glow-pulse">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-primary-foreground">CIT | Tarumã</h3>
          <p className="text-sm text-primary-foreground/80">Centro de Inovação Tecnológica</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="w-8 h-8 border border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "max-w-[80%] rounded-xl p-3 shadow-sm",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-12"
                  : "bg-muted text-muted-foreground mr-12"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.role === "user" && (
              <Avatar className="w-8 h-8 border border-accent/30">
                <AvatarFallback className="bg-accent/10 text-accent">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <Avatar className="w-8 h-8 border border-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted text-muted-foreground rounded-xl p-3 mr-12">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta sobre nossos serviços..."
            className="flex-1 bg-muted border-border focus:border-primary focus:ring-primary/20"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-primary-glow transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}