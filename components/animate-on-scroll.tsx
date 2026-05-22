"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale" | "none";

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transition = `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`;

    switch (animation) {
      case "fade-up":
        el.style.transform = "translateY(24px)";
        break;
      case "fade-left":
        el.style.transform = "translateX(-24px)";
        break;
      case "fade-right":
        el.style.transform = "translateX(24px)";
        break;
      case "scale":
        el.style.transform = "scale(0.92)";
        break;
      case "none":
        el.style.transition = "none";
        el.style.opacity = "1";
        return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) translateX(0) scale(1)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
