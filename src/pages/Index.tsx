import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ChatSection } from "@/components/ChatSection";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleBackToHome = () => {
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {!showChat ? (
        <HeroSection onStartChat={handleStartChat} />
      ) : (
        <ChatSection onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default Index;
