import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './CustomCursor.css';

export default function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isHovered = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    if (prefersReduced || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let isVisible = false;

    const handleMouseMove = (e) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        mousePos.current.x = e.clientX;
        mousePos.current.y = e.clientY;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.glass-card') ||
        target.closest('.interest-tag') ||
        target.getAttribute('role') === 'button'
      ) {
        if (!isHovered.current) {
          isHovered.current = true;
          dot.classList.add('hovered');
          ring.classList.add('hovered');
        }
      } else {
        if (isHovered.current) {
          isHovered.current = false;
          dot.classList.remove('hovered');
          ring.classList.remove('hovered');
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    // 60-120fps Smooth RAF loop with lerp (0 React re-renders)
    const renderLoop = () => {
      const { targetX, targetY } = mousePos.current;
      mousePos.current.x += (targetX - mousePos.current.x) * 0.25;
      mousePos.current.y += (targetY - mousePos.current.y) * 0.25;

      const x = mousePos.current.x;
      const y = mousePos.current.y;

      dot.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0) scale(${isHovered.current ? 1.5 : 1})`;
      ring.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0) scale(${isHovered.current ? 1.5 : 1})`;

      rafId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} />
    </>
  );
}
