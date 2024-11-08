import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import TodoContainer from "~/components/TodoContainer";
import Settings from "~/components/Settings";
import { loadState, savePosition, saveShowCompleted, saveBackgroundImage, saveLanguage } from "~/lib/storage";
import type { Language } from "~/lib/i18n";
import { DEFAULT_LANGUAGE } from "~/lib/i18n";
import { useClipboardImage } from "~/hooks/useClipboardImage";

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
  const { handlePaste } = useClipboardImage();

  useEffect(() => {
    const state = loadState();
    setPosition(state.position);
    setShowCompleted(state.showCompleted);
    setBackgroundImage(state.backgroundImage);
    setLanguage(state.language);
  }, []);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!backgroundImage) {
        handlePaste((imageUrl) => {
          setBackgroundImage(imageUrl);
          saveBackgroundImage(imageUrl);
        });
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [backgroundImage, handlePaste]);

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
      {!backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 dark:text-gray-600">
          <p className="max-w-xs text-base">
            {language === 'ja' ? 
              '画像をペーストして背景を設定 (Ctrl+V)' : 
              'Paste an image to set background (Ctrl+V)'}
          </p>
        </div>
      )}
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