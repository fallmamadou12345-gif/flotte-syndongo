
export default function SoldeBar({ solde, limite }: { solde: number, limite: number }) {
  if (limite >= 0) return (
    <span style={{ fontSize: 13, color: solde >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
      {solde.toFixed(0)} XOF
    </span>
  );

  const pct = Math.min(100, Math.max(0, ((solde - limite) / (-limite)) * 100));
  const col = pct < 20 ? "#ef4444" : pct < 50 ? "#f97316" : "#22c55e";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>
        {solde.toFixed(0)} / {limite} XOF
      </span>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", width: 80 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}
