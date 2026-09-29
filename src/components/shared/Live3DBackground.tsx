"use client";
import { useEffect, useRef } from "react";

export default function Live3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Gradient mesh: flowing blobs
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.4, speedX: 0.0003, speedY: 0.0002, color: [255, 100, 80] },
      { x: 0.7, y: 0.6, r: 0.5, speedX: -0.00025, speedY: 0.00015, color: [80, 150, 255] },
      { x: 0.5, y: 0.2, r: 0.35, speedX: 0.0002, speedY: -0.0003, color: [255, 200, 50] },
    ];

    let animId: number;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.0005;

      // Draw moving gradient blobs
      blobs.forEach((b) => {
        const bx = (b.x + Math.sin(t * b.speedX * 1000) * 0.1 + 1) % 1;
        const by = (b.y + Math.cos(t * b.speedY * 1000) * 0.1 + 1) % 1;
        const grad = ctx.createRadialGradient(
          bx * w, by * h, 0,
          bx * w, by * h, b.r * Math.min(w, h)
        );
        grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.15)`);
        grad.addColorStop(0.5, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.05)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Subtle moving lines
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = ((t * 0.2 + i * 0.25) % 1) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(w * 0.3, y + 40, w * 0.7, y - 40, w, y);
        ctx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}
