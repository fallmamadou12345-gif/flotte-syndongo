
export default function Toast({ events }: { events: any[] }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {events.map(ev => (
        <div
          key={ev.id}
          style={{
            background: "#1e3a5f", color: "#fff", borderRadius: 12, padding: "12px 18px",
            fontSize: 13, fontWeight: 700, boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            animation: "slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            display: "flex", alignItems: "center", gap: 10
          }}
        >
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={{ fontWeight: 800 }}>{ev.driverNom}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>
              Appel #{ev.count} · <strong>{ev.agent}</strong> · {ev.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
