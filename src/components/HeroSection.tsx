import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { ArrowRight, Zap, Brain, Sparkles } from "lucide-react";
import heroLogo from "@/assets/hero-logo.png";

interface HeroSectionProps {
  onStartChat: () => void;
}

export function HeroSection({ onStartChat }: HeroSectionProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative flex-1 flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-xl bg-gradient-primary p-4 shadow-primary-glow animate-glow-pulse">
              <img 
                src={heroLogo} 
                alt="Centro de Inovação Tecnológica" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Centro de
            </span>
            <br />
            <span className="text-foreground">Inovação</span>
            <br />
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Tecnológica
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Descubra todos os nossos serviços através de uma experiência interativa com
            <span className="text-primary font-semibold"> inteligência artificial</span>
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">IA Avançada</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm text-foreground">Respostas Instantâneas</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border">
              <Sparkles className="w-5 h-5 text-secondary-glow" />
              <span className="text-sm text-foreground">Interface Intuitiva</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={onStartChat}
              size="lg"
              className="bg-gradient-primary hover:shadow-primary-glow text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 group"
            >
              Iniciar Conversa
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            Tire suas dúvidas sobre desenvolvimento, consultoria, incubação e treinamentos
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}