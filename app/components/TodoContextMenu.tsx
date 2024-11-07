type TodoContextMenuProps = {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
};

export default function TodoContextMenu({
  x,
  y,
  onDelete,
  onClose,
}: TodoContextMenuProps) {
  return (
    <div
      className="fixed z-50 min-w-[120px] overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
      style={{
        left: `${Math.min(x, window.innerWidth - 120)}px`,
        top: `${Math.min(y, window.innerHeight - 40)}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onDelete}
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
      >
        削除
      </button>
    </div>
  );
}