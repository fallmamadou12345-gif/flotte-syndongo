import React, { useState } from "react";
import { motion } from "motion/react";

interface LoginModalProps {
  users: any[];
  onLogin: (user: any) => void;
  loading?: boolean;
}

export default function LoginModal({ users, onLogin, loading }: LoginModalProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoggingIn(true);

    const cleanName = name.trim().toUpperCase();
    const cleanPass = password.trim();

    const user = users.find(u => 
      u.name.trim().toUpperCase() === cleanName && 
      u.code.trim() === cleanPass
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Nom ou code d'accès incorrect.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "#fff", padding: 40, borderRadius: 24,
          width: "100%", maxWidth: 400, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e3a5f", marginBottom: 8 }}>Accès Sécurisé</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          {loading ? "Chargement des accès..." : "Identifiez-vous pour accéder à la plateforme."}
        </p>

        {loading ? (
          <div style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ 
              width: 40, height: 40, border: "4px solid #e2e8f0", 
              borderTopColor: "#1d4ed8", borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>Récupération des comptes...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            autoFocus
            type="text"
            placeholder="Votre Nom (ex: THOMAS)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              border: "2px solid #e2e8f0", fontSize: 16, outline: "none",
              textAlign: "center", fontWeight: 600
            }}
          />
          <input
            type="password"
            placeholder="Code d'accès"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              border: "2px solid #e2e8f0", fontSize: 16, outline: "none",
              textAlign: "center", fontWeight: 600
            }}
          />
          
          {error && <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 600 }}>{error}</div>}

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: isLoggingIn ? "#94a3b8" : "#1d4ed8",
              color: "#fff", fontWeight: 700, fontSize: 16, border: "none",
              cursor: isLoggingIn ? "not-allowed" : "pointer", marginTop: 8,
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {isLoggingIn ? (
              <>
                <span style={{ 
                  width: 16, height: 16, border: "2px solid #fff", 
                  borderTopColor: "transparent", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></span>
                Vérification...
              </>
            ) : "Connexion →"}
          </button>
        </form>
        )}
        <div style={{ marginTop: 20, fontSize: 11, color: "#94a3b8" }}>
          Demandez votre code d'accès à l'administrateur.
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
