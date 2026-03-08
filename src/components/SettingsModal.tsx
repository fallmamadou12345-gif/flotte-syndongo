import React, { useState, useRef } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  fleets: { id: string; name: string; phone?: string }[];
  setFleets: (fleets: { id: string; name: string; phone?: string }[]) => void;
  storageMode: string;
  onSyncToCloud: () => void;
}

export default function SettingsModal({ onClose, fleets, setFleets, storageMode, onSyncToCloud }: SettingsModalProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newFleetName, setNewFleetName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFleet = () => {
    if (!newFleetName.trim()) return;
    const id = newFleetName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (fleets.some(f => f.id === id)) {
      alert("Une flotte avec ce nom existe déjà (ID similaire).");
      return;
    }
    setFleets([...fleets, { id, name: newFleetName.trim() }]);
    setNewFleetName("");
  };

  const handleDeleteFleet = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette flotte ? Les chauffeurs associés ne seront pas supprimés mais pourraient ne plus être filtrables correctement.")) {
      setFleets(fleets.filter(f => f.id !== id));
    }
  };

  const handleBackup = () => {
    // Trigger download
    const link = document.createElement('a');
    link.href = '/api/backup';
    link.download = 'flotte_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage("Sauvegarde lancée ! Vérifiez vos téléchargements.");
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("ATTENTION : Cette action va remplacer les données actuelles par celles du fichier. Êtes-vous sûr ?")) {
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });

      if (!res.ok) throw new Error("Erreur lors de la restauration");

      const data = await res.json();
      setMessage(`Succès ! ${data.count} éléments restaurés. Veuillez rafraîchir la page.`);
      
      // Force reload after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Erreur : Le fichier semble invalide ou corrompu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "90%", maxWidth: 500,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#f9fafb"
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>⚙️ Paramètres & Sauvegarde</h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: 24, cursor: "pointer",
              color: "#6b7280", padding: 4, display: "flex", alignItems: "center"
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
          
          {storageMode === "local" && (
            <div style={{ background: "#fff1f2", padding: 16, borderRadius: 8, border: "1px solid #fecdd3" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700, color: "#9f1239" }}>
                ☁️ Migration vers le Cloud
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "#881337", lineHeight: 1.5 }}>
                Vous êtes actuellement en <strong>Mode Local</strong>. Vos données ne sont pas sauvegardées en ligne. 
                Si vous avez configuré Firebase, cliquez ci-dessous pour envoyer vos données vers le cloud.
              </p>
              <button
                onClick={onSyncToCloud}
                style={{
                  marginTop: 12, padding: "10px 16px", background: "#e11d48", color: "#fff",
                  border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8, fontSize: 14
                }}
              >
                🚀 Envoyer vers le Cloud
              </button>
            </div>
          )}
          
          <div style={{ background: "#f0fdf4", padding: 16, borderRadius: 8, border: "1px solid #bbf7d0" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 15, fontWeight: 700, color: "#166534" }}>
              🏢 Gestion des Flottes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fleets.map(f => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "8px 12px", borderRadius: 6, border: "1px solid #dcfce7" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</span>
                  {f.id !== "autres" && (
                    <button 
                      onClick={() => handleDeleteFleet(f.id)}
                      style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input 
                  value={newFleetName}
                  onChange={e => setNewFleetName(e.target.value)}
                  placeholder="Nom de la nouvelle flotte..."
                  style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13 }}
                />
                <button 
                  onClick={handleAddFleet}
                  disabled={!newFleetName.trim()}
                  style={{ padding: "8px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", opacity: !newFleetName.trim() ? 0.5 : 1 }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div style={{ background: "#eff6ff", padding: 16, borderRadius: 8, border: "1px solid #bfdbfe" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
              1. Sauvegarder vos données
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#1e3a5f", lineHeight: 1.5 }}>
              Téléchargez une copie complète de votre base de données (chauffeurs, historique, etc.) sur votre ordinateur.
              Faites ceci <strong>avant chaque mise à jour</strong>.
            </p>
            <button
              onClick={handleBackup}
              style={{
                marginTop: 12, padding: "10px 16px", background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, fontSize: 14
              }}
            >
              📥 Télécharger la sauvegarde
            </button>
          </div>

          <div style={{ background: "#fff7ed", padding: 16, borderRadius: 8, border: "1px solid #fed7aa" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700, color: "#9a3412" }}>
              2. Restaurer une sauvegarde
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#7c2d12", lineHeight: 1.5 }}>
              Si vous avez perdu vos données après une mise à jour, utilisez ce bouton pour réimporter votre fichier de sauvegarde.
            </p>
            <button
              onClick={handleRestoreClick}
              disabled={uploading}
              style={{
                marginTop: 12, padding: "10px 16px", background: uploading ? "#9ca3af" : "#ea580c", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 600, cursor: uploading ? "wait" : "pointer",
                display: "flex", alignItems: "center", gap: 8, fontSize: 14
              }}
            >
              📤 {uploading ? "Restauration..." : "Importer une sauvegarde"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: "none" }}
            />
          </div>

          {message && (
            <div style={{
              padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 500, textAlign: "center",
              background: message.includes("Succès") ? "#dcfce7" : "#f3f4f6",
              color: message.includes("Succès") ? "#166534" : "#374151"
            }}>
              {message}
            </div>
          )}

        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb", textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px", background: "#fff", border: "1px solid #d1d5db",
              borderRadius: 6, color: "#374151", fontWeight: 500, cursor: "pointer"
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
