
import { useState, useEffect, useRef } from "react";

export default function AnimatedNumber({ value, color, size = 28 }: { value: number, color?: string, size?: number }) {
  const [d, setD] = useState(value);
  const p = useRef(value);

  useEffect(() => {
    if (p.current === value) return;
    const diff = value - p.current;
    const steps = 14;
    let step = 0;
    const start = p.current;
    
    const id = setInterval(() => {
      step++;
      setD(Math.round(start + diff * (step / steps)));
      if (step >= steps) {
        clearInterval(id);
        p.current = value;
      }
    }, 25);
    
    return () => clearInterval(id);
  }, [value]);

  return <span style={{ color, fontSize: size, fontWeight: 800, lineHeight: 1 }}>{d}</span>;
}
