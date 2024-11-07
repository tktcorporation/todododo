import type { Position } from "~/types";

type PositionSelectorProps = {
  position: Position;
  onChange: (position: Position) => void;
};

const positionIcons: Record<Position, JSX.Element> = {
  center: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="8" y="8" width="8" height="8" strokeWidth="2" />
    </svg>
  ),
  top: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="8" y="4" width="8" height="8" strokeWidth="2" />
    </svg>
  ),
  bottom: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="8" y="12" width="8" height="8" strokeWidth="2" />
    </svg>
  ),
  left: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="8" width="8" height="8" strokeWidth="2" />
    </svg>
  ),
  right: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="12" y="8" width="8" height="8" strokeWidth="2" />
    </svg>
  ),
};

export default function PositionSelector({ position, onChange }: PositionSelectorProps) {
  return (
    <div className="flex justify-center gap-1.5">
      {(Object.keys(positionIcons) as Position[]).map((pos) => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          title={pos.charAt(0).toUpperCase() + pos.slice(1)}
          className={`rounded-md p-2 transition-colors ${
            position === pos
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {positionIcons[pos]}
        </button>
      ))}
    </div>
  );
}