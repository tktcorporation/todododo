import { useRef, useEffect } from "react";

type UseDragProps = {
  onDrag: (position: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
};

export default function useDrag({ onDrag, initialPosition }: UseDragProps) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Prevent default only for touch events to avoid text selection issues
    if ('touches' in e) {
      e.preventDefault();
    }
    
    isDraggingRef.current = true;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX - (window.innerWidth * initialPosition.x) / 100,
      y: clientY - (window.innerHeight * initialPosition.y) / 100,
    };
    
    document.body.style.cursor = "grab";
    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;

      // Prevent default to stop scrolling
      e.preventDefault();

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
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.overflow = ""; // Restore scrolling
    };

    // Add touch event listeners with passive: false to allow preventDefault
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);

    return () => {
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
      document.removeEventListener("touchcancel", handleEnd);
    };
  }, [onDrag]);

  return { handleMouseDown };
}