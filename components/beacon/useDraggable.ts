import { useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

// Pointer-driven dragging that writes `transform` straight to the DOM (no React
// re-render per mouse move) for a smooth, GPU-composited drag. Returns a ref to
// attach to the draggable element and an onMouseDown handler for its drag handle.
export function useDraggable(initial: Point, onDragEnd?: () => void) {
  const modalRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<Point>(initial);
  const anchorRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keep the latest onDragEnd without re-binding the listeners every render
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const applyTransform = (x: number, y: number) => {
    if (modalRef.current) modalRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  useEffect(() => {
    applyTransform(posRef.current.x, posRef.current.y);

    const onMouseMove = (e: MouseEvent) => {
      if (!anchorRef.current) return;
      const x = anchorRef.current.startX + (e.clientX - anchorRef.current.mouseX);
      const y = anchorRef.current.startY + (e.clientY - anchorRef.current.mouseY);
      posRef.current = { x, y };
      applyTransform(x, y);
    };

    const onMouseUp = () => {
      if (!anchorRef.current) return;
      anchorRef.current = null;
      setIsDragging(false);
      if (modalRef.current) modalRef.current.style.cursor = "";
      onDragEndRef.current?.();
    };

    // passive: true — browser doesn't wait for JS before painting the next frame
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onDragStart = (e: { clientX: number; clientY: number }) => {
    anchorRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: posRef.current.x,
      startY: posRef.current.y,
    };
    setIsDragging(true);
    if (modalRef.current) modalRef.current.style.cursor = "grabbing";
  };

  return { modalRef, isDragging, onDragStart };
}
