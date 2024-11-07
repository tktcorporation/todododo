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
          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={t("settings")}
        >
          <Settings2 className="h-3 w-3 text-gray-400" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              {t("showCompletedTasks")}
            </label>
            <button
              onClick={() => onShowCompletedChange(!showCompleted)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showCompleted ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showCompleted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              {t("language")}
            </label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              {t("backgroundImage")}
            </label>
            <BackgroundUpload onImageSet={onImageSet} language={language} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}