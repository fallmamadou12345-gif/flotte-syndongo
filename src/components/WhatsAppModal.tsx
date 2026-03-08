
import { useState, useMemo } from "react";
import { WA_TEMPLATES, MESSAGE_TONES } from "../constants";
import { waUrl } from "../utils";
import RippleBtn from "./RippleBtn";

export default function WhatsAppModal({ driver, onClose, fleetName, fleetPhone, agentName }: { driver: any, onClose: () => void, fleetName: string, fleetPhone: string, agentName: string }) {
  const [tone, setTone] = useState<keyof typeof MESSAGE_TONES>("PRO");
  const [mode, setMode] = useState<"WA" | "SMS">("WA");
  const [currentFleetPhone, setCurrentFleetPhone] = useState(fleetPhone);
  
  const defaultMsg = useMemo(() => {
    const templateKey = driver.fin_bloque ? "SOLDE" : driver.zone;
    const template = WA_TEMPLATES[templateKey as keyof typeof WA_TEMPLATES] || WA_TEMPLATES.OK;
    return template(driver.nom, fleetName, tone, agentName, currentFleetPhone);
  }, [driver.nom, driver.zone, driver.fin_bloque, fleetName, tone, agentName, currentFleetPhone]);

  const [msg, setMsg] = useState(defaultMsg);
  const [sent, setSent] = useState(false);

  // Update msg when tone or phone changes
  const updateMessage = (newTone: keyof typeof MESSAGE_TONES, newPhone: string) => {
    const templateKey = driver.fin_bloque ? "SOLDE" : driver.zone;
    const template = WA_TEMPLATES[templateKey as keyof typeof WA_TEMPLATES] || WA_TEMPLATES.OK;
    setMsg(template(driver.nom, fleetName, newTone, agentName, newPhone));
  };

  const handleToneChange = (newTone: keyof typeof MESSAGE_TONES) => {
    setTone(newTone);
    updateMessage(newTone, currentFleetPhone);
  };

  const handlePhoneChange = (newPhone: string) => {
    setCurrentFleetPhone(newPhone);
    updateMessage(tone, newPhone);
  };

  const templates = [
    { label: "Zone Rouge 🚨", key: "ROUGE" },
    { label: "Zone Orange ⚠️", key: "ORANGE" },
    { label: "Nouveau 🎉", key: "NOUVEAU" },
    { label: "Objectif Gold 🏆", key: "GOLD" },
    { label: "Solde bloqué 💰", key: "SOLDE" },
    { label: "Général 🌟", key: "OK" },
  ];

  const handleSend = () => {
    if (mode === "WA") {
      window.open(waUrl(driver.tel, msg), "_blank");
    } else {
      window.location.href = `sms:${driver.tel}?body=${encodeURIComponent(msg)}`;
    }
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 10001, display: "flex",
        alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: 500, maxWidth: "95vw", maxHeight: "90vh",
          overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex", flexDirection: "column"
        }}
      >
        {/* Header */}
        <div style={{ background: mode === "WA" ? "linear-gradient(135deg,#075e54,#25d366)" : "linear-gradient(135deg,#1e3a5f,#1d4ed8)", padding: "18px 24px", color: "#fff", flexShrink: 0 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2, letterSpacing: "0.06em", fontWeight: 600 }}>{mode === "WA" ? "WHATSAPP" : "SMS"} · {driver.tel}</div>
          <div style={{ fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{mode === "WA" ? "💬" : "✉️"}</span> {driver.nom}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <a href={`tel:${driver.tel}`} style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 20, color: "#fff", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
                📞 Appeler
              </a>
              <div style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 20 }}>
                {fleetName}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
            Envoi en tant que : <strong>{agentName}</strong>
          </div>
        </div>

        <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          
          {/* Mode Switcher */}
          <div style={{ display: "flex", gap: 8, background: "#f3f4f6", padding: 4, borderRadius: 12 }}>
            <button 
              onClick={() => setMode("WA")}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: mode === "WA" ? "#fff" : "transparent", color: mode === "WA" ? "#075e54" : "#6b7280", boxShadow: mode === "WA" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
            >
              WhatsApp
            </button>
            <button 
              onClick={() => setMode("SMS")}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: mode === "SMS" ? "#fff" : "transparent", color: mode === "SMS" ? "#1e3a5f" : "#6b7280", boxShadow: mode === "SMS" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
            >
              SMS
            </button>
          </div>

          {/* Personality / Tone & Fleet Phone */}
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>🎭 Personnalité (Ton)</div>
              <div style={{ display: "flex", gap: 6 }}>
                {(Object.keys(MESSAGE_TONES) as Array<keyof typeof MESSAGE_TONES>).map(t => (
                  <button
                    key={t}
                    onClick={() => handleToneChange(t)}
                    style={{
                      flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      background: tone === t ? "#eff6ff" : "#f9fafb",
                      color: tone === t ? "#1d4ed8" : "#6b7280",
                      border: `2px solid ${tone === t ? "#3b82f6" : "#e5e7eb"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {MESSAGE_TONES[t]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ width: 160 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>📞 Contact Parc</div>
              <input
                type="text"
                value={currentFleetPhone}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="Numéro du parc"
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: "2px solid #e5e7eb", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Templates */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>📋 Modèles de message</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {templates.map(t => {
                const template = WA_TEMPLATES[t.key as keyof typeof WA_TEMPLATES] || WA_TEMPLATES.OK;
                const templateMsg = template(driver.nom, fleetName, tone, agentName, currentFleetPhone);
                return (
                  <button
                    key={t.key}
                    onClick={() => setMsg(templateMsg)}
                    style={{
                      padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: msg === templateMsg ? "#dcfce7" : "#f9fafb",
                      color: msg === templateMsg ? "#15803d" : "#374151",
                      border: `2px solid ${msg === templateMsg ? "#22c55e" : "#e5e7eb"}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message editor */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" }}>✏️ Message personnalisé</div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              style={{
                width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: 10,
                fontSize: 13, resize: "vertical", minHeight: 100, lineHeight: 1.6,
                boxSizing: "border-box", fontFamily: "inherit", outline: "none"
              }}
            />
          </div>

          {/* Preview bubble */}
          <div style={{
            background: mode === "WA" ? "#dcfce7" : "#f0fdfa", 
            borderRadius: "12px 12px 0 12px", padding: "12px 14px",
            fontSize: 13, color: "#111827", lineHeight: 1.6, 
            border: mode === "WA" ? "1px solid #bbf7d0" : "1px solid #99f6e4", 
            position: "relative"
          }}>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>APERÇU {mode}</div>
            {msg}
            <div style={{ fontSize: 10, color: "#6b7280", textAlign: "right", marginTop: 4 }}>
              {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} ✓✓
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <RippleBtn
              onClick={handleSend}
              style={{
                flex: 1, padding: "13px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 800, 
                background: sent ? "#15803d" : (mode === "WA" ? "#25d366" : "#1d4ed8"), 
                color: "#fff",
                transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {sent ? "✅ Envoyé !" : <><span style={{ fontSize: 18 }}>{mode === "WA" ? "💬" : "✉️"}</span> Envoyer via {mode === "WA" ? "WhatsApp" : "SMS"}</>}
            </RippleBtn>
            <button
              onClick={onClose}
              style={{
                padding: "13px 16px", background: "#f3f4f6", color: "#6b7280", border: "none",
                borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 600
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
