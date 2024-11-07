import { useCallback } from "react";

export function useClipboardImage() {
  const handlePaste = useCallback(async (callback: (imageUrl: string) => void) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (typeof e.target?.result === "string") {
                callback(e.target.result);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch (err) {
      console.error("クリップボードからの読み込みに失敗しました:", err);
    }
  }, []);

  return { handlePaste };
}