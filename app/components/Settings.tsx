import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Settings2 } from "lucide-react";
import BackgroundUpload from "./BackgroundUpload";
import type { Language } from "~/lib/i18n";
import { useTranslation } from "~/lib/i18n";

type SettingsProps = {
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
  onImageSet: (imageUrl: string) => void;
  backgroundImage: string;
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export default function Settings({ 
  showCompleted, 
  onShowCompletedChange,
  onImageSet,
  backgroundImage,
  language,
  onLanguageChange,
}: SettingsProps) {
  const { t } = useTranslation(language);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="touch-manipulation rounded-md bg-gray-100/80 p-2.5 text-gray-500 hover:bg-gray-200/80 active:bg-gray-300/80 dark:bg-gray-700/80 dark:text-gray-400 dark:hover:bg-gray-600/80 dark:active:bg-gray-500/80"
          title={t("settings")}
        >
          <Settings2 className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-base text-gray-700 dark:text-gray-300">
              {t("showCompletedTasks")}
            </label>
            <button
              onClick={() => onShowCompletedChange(!showCompleted)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showCompleted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-base text-gray-700 dark:text-gray-300">
              {t("language")}
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-base dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-base text-gray-700 dark:text-gray-300">
              {t("backgroundImage")}
            </label>
            <BackgroundUpload onImageSet={onImageSet} language={language} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}