
import React, { useState } from "react";

export default function RippleBtn({ onClick, children, style, disabled }: { onClick?: (e: any) => void, children: React.ReactNode, style?: React.CSSProperties, disabled?: boolean }) {
  const [rps, setRps] = useState<{ id: number, x: number, y: number }[]>([]);

  const h = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRps(v => [...v, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRps(v => v.filter(x => x.id !== id)), 600);
    onClick && onClick(e);
  };

  return (
    <button
      onClick={h}
      disabled={disabled}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style
      }}
    >
      {rps.map(r => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            left: r.x - 40,
            top: r.y - 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            pointerEvents: "none",
            animation: "ripple 0.6s ease-out forwards"
          }}
        />
      ))}
      {children}
    </button>
  );
}
