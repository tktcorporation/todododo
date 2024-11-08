import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import TodoContainer from "~/components/TodoContainer";
import Settings from "~/components/Settings";
import { loadState, savePosition, saveShowCompleted, saveBackgroundImage, saveLanguage } from "~/lib/storage";
import type { Language } from "~/lib/i18n";
import { DEFAULT_LANGUAGE } from "~/lib/i18n";
import { useClipboardImage } from "~/hooks/useClipboardImage";
import { extractColors } from "~/lib/color";
import { compressImage } from "~/lib/image";
import { useTranslation } from "~/lib/i18n";

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
  const [colors, setColors] = useState({ 
    primary: 'rgb(37, 99, 235)',
    text: 'rgb(0, 0, 0)',
    background: 'rgba(255, 255, 255, 0.9)'
  });
  const [error, setError] = useState<string | null>(null);
  const { handlePaste } = useClipboardImage();
  const { t } = useTranslation(language);

  useEffect(() => {
    const state = loadState();
    setPosition(state.position);
    setShowCompleted(state.showCompleted);
    setBackgroundImage(state.backgroundImage);
    setLanguage(state.language);
  }, []);

  useEffect(() => {
    const updateColors = async () => {
      if (backgroundImage) {
        try {
          const newColors = await extractColors(backgroundImage);
          setColors(newColors);
        } catch (err) {
          console.error('Failed to extract colors:', err);
        }
      } else {
        setColors({
          primary: 'rgb(37, 99, 235)',
          text: 'rgb(0, 0, 0)',
          background: 'rgba(255, 255, 255, 0.9)'
        });
      }
    };
    updateColors();
  }, [backgroundImage]);

  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      if (!backgroundImage) {
        handlePaste(async (imageUrl) => {
          try {
            const compressedImage = await compressImage(imageUrl);
            setBackgroundImage(compressedImage);
            saveBackgroundImage(compressedImage);
            setError(null);
          } catch (err) {
            setError(t("clipboardError") + " " + (err instanceof Error ? err.message : String(err)));
          }
        });
      }
    };

    document.addEventListener('paste', handleGlobalPaste);
    return () => document.removeEventListener('paste', handleGlobalPaste);
  }, [backgroundImage, handlePaste, t]);

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
    savePosition(newPosition);
  };

  const handleShowCompletedChange = (show: boolean) => {
    setShowCompleted(show);
    saveShowCompleted(show);
  };

  const handleBackgroundImageChange = async (image: string) => {
    try {
      const compressedImage = await compressImage(image);
      setBackgroundImage(compressedImage);
      saveBackgroundImage(compressedImage);
      setError(null);
    } catch (err) {
      setError(t("uploadError") + " " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all duration-300"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {error && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {error}
        </div>
      )}
      
      {!backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 dark:text-gray-600">
          <p className="max-w-xs text-base">
            {t("pasteFromClipboard")}
          </p>
        </div>
      )}

      <TodoContainer
        position={position}
        onPositionChange={handlePositionChange}
        showCompleted={showCompleted}
        language={language}
        colors={colors}
      >
        <Settings
          showCompleted={showCompleted}
          onShowCompletedChange={handleShowCompletedChange}
          onImageSet={handleBackgroundImageChange}
          backgroundImage={backgroundImage}
          language={language}
          onLanguageChange={handleLanguageChange}
          colors={colors}
        />
      </TodoContainer>
    </div>
  );
}