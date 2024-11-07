import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import TodoContainer from "~/components/TodoContainer";
import Settings from "~/components/Settings";
import { loadState, savePosition, saveShowCompleted, saveBackgroundImage, saveLanguage } from "~/lib/storage";
import type { Language } from "~/lib/i18n";
import { DEFAULT_LANGUAGE } from "~/lib/i18n";

export const meta: MetaFunction = () => {
  return [
    { title: "Floating Todo - Minimalist Task Manager" },
    { 
      name: "description", 
      content: "A minimalist, draggable todo app with background customization and multi-language support" 
    },
  ];
};

export default function Index() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [showCompleted, setShowCompleted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const state = loadState();
    setPosition(state.position);
    setShowCompleted(state.showCompleted);
    setBackgroundImage(state.backgroundImage);
    setLanguage(state.language);
  }, []);

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
    savePosition(newPosition);
  };

  const handleShowCompletedChange = (show: boolean) => {
    setShowCompleted(show);
    saveShowCompleted(show);
  };

  const handleBackgroundImageChange = (image: string) => {
    setBackgroundImage(image);
    saveBackgroundImage(image);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  return (
    <div 
      className="relative min-h-screen bg-gray-50 dark:bg-gray-900"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      <TodoContainer
        position={position}
        onPositionChange={handlePositionChange}
        showCompleted={showCompleted}
        language={language}
      >
        <Settings
          showCompleted={showCompleted}
          onShowCompletedChange={handleShowCompletedChange}
          onImageSet={handleBackgroundImageChange}
          backgroundImage={backgroundImage}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </TodoContainer>
    </div>
  );
}