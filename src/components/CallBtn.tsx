
import { useState } from "react";
import RippleBtn from "./RippleBtn";

export default function CallBtn({ driver, onCallClick, compact }: { driver: any, onCallClick: (id: string) => void, compact?: boolean }) {
  const [state, setState] = useState("idle");

  const handle = (e: any) => {
    e.stopPropagation();
    if (state === "ringing") return;
    setState("ringing");
    setTimeout(() => setState("idle"), 600);
    onCallClick(driver.id);
  };

  const bg = state === "ringing" ? "#1e40af" : "#1d4ed8";

  return (
    <RippleBtn
      onClick={(e) => {
        handle(e);
        window.location.href = `tel:${driver.tel}`;
      }}
      style={{
        padding: compact ? "5px 10px" : "8px 14px",
        borderRadius: 8,
        border: "none",
        background: bg,
        color: "#fff",
        fontSize: compact ? 12 : 13,
        fontWeight: 700,
        transition: "background 0.2s",
        animation: state === "ringing" ? "pulsate 0.6s ease-in-out" : "none",
      }}
    >
      📞 {compact ? driver._callCount : `Appeler (${driver._callCount})`}
    </RippleBtn>
  );
}
