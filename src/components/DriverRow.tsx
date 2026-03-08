
import React, { useState, useRef, useEffect, useMemo } from "react";
import ZoneBadge from "./ZoneBadge";
import SoldeBar from "./SoldeBar";
import CallBtn from "./CallBtn";
import RippleBtn from "./RippleBtn";
import { CODES_COMMENTAIRE, INITIAL_FLEETS } from "../constants";

interface DriverRowProps {
  driver: any;
  onComment: (id: string, comment: string) => void;
  onCallClick: (id: string) => void;
  onWaClick: (id: string) => void;
  currentAgent?: string;
  fleets?: any[];
}

const DriverRow: React.FC<DriverRowProps> = ({ driver, onComment, onCallClick, onWaClick, currentAgent, fleets = INITIAL_FLEETS }) => {
  const [expanded, setExpanded] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [localComment, setLocalComment] = useState(driver.commentaire || "");
  const [flash, setFlash] = useState(false);
  const prevCount = useRef(driver._callCount);

  const fleetName = useMemo(() => {
    const f = fleets.find(fl => fl.id === driver.fleetId);
    return f ? f.name : "Yango";
  }, [fleets, driver.fleetId]);

  const personalizedSms = useMemo(() => {
    const agentName = currentAgent || "Votre Agent";
    const msg = `Bonjour ${driver.nom}, c'est ${agentName} de la flotte ${fleetName}. Nous avons remarqué que vous n'avez pas roulé depuis ${driver.jours_inactif || 0} jours. Y a-t-il un problème que nous pouvons aider à résoudre ?`;
    return encodeURIComponent(msg);
  }, [driver.nom, driver.jours_inactif, currentAgent, fleetName]);

  useEffect(() => {
    if (driver._callCount > prevCount.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
      prevCount.current = driver._callCount;
    }
  }, [driver._callCount]);

  const saveComment = (e: any) => {
    e.stopPropagation();
    onComment(driver.id, localComment);
    setEditComment(false);
  };

  return (
    <>
      <tr
        onClick={() => setExpanded(v => !v)}
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #f3f4f6",
          background: flash ? "#dbeafe" : driver._called ? "#f0fdf4" : driver.fin_bloque ? "#fff0f0" : "#fff",
          transition: "background 0.5s"
        }}
      >
        <td style={{ padding: "10px 12px", width: 38, textAlign: "center" }}>
          <div
            style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: driver._callCount > 0 ? "#1d4ed8" : "#f3f4f6",
              color: driver._callCount > 0 ? "#fff" : "#9ca3af",
              fontSize: 12, fontWeight: 800,
              transform: flash ? "scale(1.4)" : "scale(1)",
              transition: "transform 0.2s",
              boxShadow: driver._callCount > 0 ? "0 0 0 3px rgba(29,78,216,0.18)" : "none"
            }}
          >
            {driver._callCount}
          </div>
        </td>
        <td style={{ padding: "10px 12px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{driver.nom}</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{driver.tel}</div>
        </td>
        <td style={{ padding: "10px 12px" }}>
          <ZoneBadge zone={driver.zone} />
        </td>
        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: driver.jours_inactif >= 7 ? "#ef4444" : driver.jours_inactif >= 3 ? "#f97316" : "#374151" }}>
          {driver.jours_inactif != null ? `${driver.jours_inactif}j` : "—"}
        </td>
        <td style={{ padding: "10px 12px" }}>
          <SoldeBar solde={driver.solde} limite={driver.limite} />
        </td>
        <td
          style={{
            padding: "10px 12px", fontSize: 13, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: driver.commentaire?.startsWith("[") ? "#1d4ed8" : "#6b7280",
            fontStyle: driver.commentaire?.startsWith("[") ? "normal" : "italic"
          }}
        >
          {driver.commentaire || <span style={{ color: "#d1d5db" }}>—</span>}
        </td>
        <td style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280" }}>{driver.responsable || "—"}</td>
        <td style={{ padding: "10px 12px" }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", gap: 4 }}>
            <CallBtn driver={driver} onCallClick={onCallClick} compact />
            <button
              onClick={e => { e.stopPropagation(); onWaClick(driver.id); }}
              style={{
                padding: "5px 8px", borderRadius: 8, border: "none", background: "#25d366", color: "#fff",
                fontSize: 14, cursor: "pointer", fontWeight: 700, lineHeight: 1
              }}
              title="WhatsApp"
            >
              💬
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
          <td colSpan={9} style={{ padding: "16px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {/* Info + historique */}
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>INFOS CHAUFFEUR</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {driver.vehicule || "—"} <span style={{ color: "#6b7280", fontWeight: 400 }}>· {driver.plaque || "—"}</span>
                </div>
                {[
                  ["Ville", driver.ville || "—"],
                  ["Note", `⭐ ${driver.note || "—"}`],
                  ["Courses", driver.commandes],
                  ["Dernière course", driver.derniere_commande || "Jamais"]
                ].map(([l, v]) => (
                  <div key={l as string} style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                    <span style={{ color: "#374151", fontWeight: 600 }}>{l} :</span> {v}
                  </div>
                ))}

                {driver._callLog.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>HISTORIQUE DES APPELS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 130, overflowY: "auto" }}>
                      {[...driver._callLog].reverse().map((entry: any, i: number) => (
                        <div
                          key={i}
                          style={{
                            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
                            padding: "7px 10px", fontSize: 12,
                            borderLeft: `3px solid ${entry.outcome ? "#1d4ed8" : "#d1d5db"}`
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, color: entry.via === "wa" ? "#25d366" : "#1d4ed8" }}>
                              {entry.via === "wa" ? "💬 WhatsApp #" : "📞 Appel #"}{driver._callLog.length - i}
                            </span>
                            <span style={{ color: "#9ca3af", fontSize: 11 }}>{entry.time}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, alignItems: "center" }}>
                            <span style={{ color: "#374151", fontWeight: 600, fontSize: 12 }}>👤 {entry.agent}</span>
                            {entry.outcome && (
                              <span style={{ fontSize: 11, color: "#1d4ed8", fontFamily: "monospace", fontWeight: 700 }}>{entry.outcome}</span>
                            )}
                          </div>
                          {entry.comment && entry.comment !== entry.outcome + " " && (
                            <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2, fontStyle: "italic" }}>{entry.comment}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Commentaire */}
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em" }}>COMMENTAIRE</div>
                {editComment ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {CODES_COMMENTAIRE.map(code => (
                        <button
                          key={code}
                          onClick={e => { e.stopPropagation(); setLocalComment(prev => prev + code + " "); }}
                          style={{
                            fontSize: 11, padding: "3px 8px", background: "#eff6ff", color: "#1d4ed8",
                            border: "1px solid #bfdbfe", borderRadius: 6, cursor: "pointer", fontWeight: 700
                          }}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={localComment}
                      onChange={e => setLocalComment(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 8,
                        fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={saveComment}
                        style={{
                          padding: "5px 14px", background: "#1d4ed8", color: "#fff", border: "none",
                          borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700
                        }}
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setEditComment(false); }}
                        style={{
                          padding: "5px 14px", background: "#f3f4f6", color: "#374151", border: "none",
                          borderRadius: 6, cursor: "pointer", fontSize: 13
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={e => { e.stopPropagation(); setEditComment(true); }}
                    style={{
                      padding: "10px 12px", background: "#fff", border: "1px dashed #d1d5db",
                      borderRadius: 8, cursor: "text", fontSize: 13,
                      color: localComment ? "#111827" : "#9ca3af", minHeight: 48
                    }}
                  >
                    {localComment || "Cliquer pour ajouter..."}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 8, letterSpacing: "0.08em" }}>ACTIONS</div>
                <RippleBtn
                  onClick={e => { 
                    e.stopPropagation(); 
                    onCallClick(driver.id);
                    window.location.href = `tel:${driver.tel}`;
                  }}
                  style={{
                    width: "100%", padding: "10px", background: "#1d4ed8", color: "#fff", border: "none",
                    borderRadius: 8, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  📞 Appeler (Mobile Connect)
                </RippleBtn>
                <RippleBtn
                  onClick={e => { 
                    e.stopPropagation(); 
                    onWaClick(driver.id); 
                  }}
                  style={{
                    marginTop: 8, width: "100%", padding: "10px", background: "#25d366", color: "#fff", border: "none",
                    borderRadius: 8, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}
                >
                  <span style={{ fontSize: 18 }}>💬</span> WhatsApp
                </RippleBtn>
                <a
                  href={`sms:${driver.tel}?body=${personalizedSms}`}
                  onClick={e => {
                    e.stopPropagation();
                    onWaClick(driver.id); // Also log as a contact attempt
                  }}
                  style={{
                    marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac",
                    borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700
                  }}
                >
                  ✉️ SMS Personnalisé
                </a>
                <div style={{ marginTop: 8, padding: "8px 10px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151" }}>
                  {driver._callCount === 0 ? (
                    <span style={{ color: "#9ca3af" }}>Aucun appel aujourd'hui</span>
                  ) : (
                    <>
                      <strong style={{ color: "#1d4ed8" }}>{driver._callCount}</strong> appel{driver._callCount > 1 ? "s" : ""} · dernier par <strong>{driver._callLog[driver._callLog.length - 1]?.agent || "—"}</strong>
                    </>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default DriverRow;
