"use client";

import { useEffect, useRef } from "react";

export function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const smoothing = 0.08;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const draw = () => {
      currentX += (mouseX - currentX) * smoothing;
      currentY += (mouseY - currentY) * smoothing;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 背景渐变
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      bgGradient.addColorStop(0, "#1e293b");
      bgGradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 鼠标位置凹进去效果
      const gradient = ctx.createRadialGradient(
        currentX, currentY, 0,
        currentX, currentY, 400
      );
      gradient.addColorStop(0, "rgba(14, 165, 233, 0.15)");
      gradient.addColorStop(0.3, "rgba(14, 165, 233, 0.08)");
      gradient.addColorStop(0.6, "rgba(14, 165, 233, 0.03)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 内凹暗边效果
      const innerGradient = ctx.createRadialGradient(
        currentX, currentY, 50,
        currentX, currentY, 300
      );
      innerGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
      innerGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.1)");
      innerGradient.addColorStop(1, "transparent");

      ctx.fillStyle = innerGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
