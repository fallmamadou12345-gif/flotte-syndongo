
import { ZONE_CONFIG } from "../constants";

export default function ZoneBadge({ zone }: { zone: string }) {
  const c = ZONE_CONFIG[zone] || ZONE_CONFIG.INCONNU;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 700,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`
      }}
    >
      {c.label}
    </span>
  );
}
