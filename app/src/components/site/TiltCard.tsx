import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 14;
    const rx = (0.5 - py) * 14;
    el.style.setProperty("--tilt-rx", `${rx}deg`);
    el.style.setProperty("--tilt-ry", `${ry}deg`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  }

  return (
    <div className="tilt-3d" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div ref={ref} className={`tilt-3d-inner ${className}`}>
        {children}
      </div>
    </div>
  );
}
