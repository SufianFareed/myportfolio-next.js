"use client";

import { useEffect, useRef } from "react";

const STATUSES = ['"open to work"', '"shipping..."', '"debugging with coffee"'];

export default function TypedStatus() {
  const spanRef = useRef(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    let statusIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const current = STATUSES[statusIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          statusIndex = (statusIndex + 1) % STATUSES.length;
        }
      }
      timeoutId = setTimeout(tick, deleting ? 35 : 65);
    };

    timeoutId = setTimeout(tick, 600);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <span ref={spanRef} className="typed-line"></span>
      <span className="cursor">|</span>
    </>
  );
}
