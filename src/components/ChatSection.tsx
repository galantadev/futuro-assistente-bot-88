import { Button } from "@/components/ui/button";
import { Chat } from "@/components/ui/chat";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Home } from "lucide-react";

interface ChatSectionProps {
  onBack: () => void;
}

export function ChatSection({ onBack }: ChatSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 max-w-4xl py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
            
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Centro de Inovação Tecnológica</span>
            </div>
          </div>

          {/* Chat Component */}
          <div className="animate-fade-in">
            <Chat className="mx-auto" />
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Pergunte sobre nossos serviços: desenvolvimento de software, consultoria digital, 
              incubação de startups, treinamentos em tecnologia e muito mais.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}