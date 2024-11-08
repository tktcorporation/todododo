import { useRef, useEffect } from "react";

type UseDragProps = {
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
};

export default function useDrag({ onDrag, initialPosition }: UseDragProps) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    isDraggingRef.current = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX - (window.innerWidth * initialPosition.x) / 100,
      y: clientY - (window.innerHeight * initialPosition.y) / 100,
    };
    
    document.body.style.cursor = "grab";
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = ((clientX - dragStartRef.current.x) / window.innerWidth) * 100;
      const newY = ((clientY - dragStartRef.current.y) / window.innerHeight) * 100;

      onDrag({
        x: Math.max(0, Math.min(100, newX)),
        y: Math.max(0, Math.min(100, newY)),
      });
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    // Add both mouse and touch event listeners
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
    };
  }, [onDrag]);

  return { handleMouseDown };
}