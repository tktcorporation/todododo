import { useState, useCallback } from "react";

type BackgroundUploadProps = {
  onImageSet: (imageUrl: string) => void;
};

export default function BackgroundUpload({ onImageSet }: BackgroundUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルのみアップロードできます。");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onImageSet(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSet]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], "pasted-image.png", { type });
            handleFileUpload(file);
            return;
          }
        }
      }
    } catch (err) {
      console.error("クリップボードからの読み込みに失敗しました:", err);
    }
  }, [handleFileUpload]);

  return (
    <div className="mb-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          クリックまたはドラッグ＆ドロップで背景画像をアップロード
        </p>
      </div>
      <button
        onClick={handlePaste}
        className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        クリップボードから画像を貼り付け (Ctrl+V)
      </button>
    </div>
  );
}