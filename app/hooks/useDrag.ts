import { useRef, useEffect } from "react";

type UseDragProps = {
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
};

export function useDrag({ onDrag, initialPosition }: UseDragProps) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - (window.innerWidth * initialPosition.x) / 100,
      y: e.clientY - (window.innerHeight * initialPosition.y) / 100,
    };
    document.body.style.cursor = "grab";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const newX = ((e.clientX - dragStartRef.current.x) / window.innerWidth) * 100;
      const newY = ((e.clientY - dragStartRef.current.y) / window.innerHeight) * 100;

      onDrag({
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY)),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onDrag]);

  return { handleMouseDown };
}