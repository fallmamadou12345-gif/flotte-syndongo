
export const INITIAL_FLEETS = [
  { id: "diagne", name: "Diagne Transport", phone: "+221 77 123 45 67" },
  { id: "ndongo", name: "Transport Ndongo Fall", phone: "+221 78 987 65 43" },
  { id: "sy", name: "Sy Transport", phone: "+221 70 111 22 33" },
  { id: "autres", name: "Autres Parcs", phone: "+221 33 800 00 00" }
];

export const CODES_COMMENTAIRE = ["[PANNE]", "[SOLDE]", "[DOCS]", "[MALADE]", "[RAPPEL]", "[RÉSOLU]"];

export const AGENTS = [
  "Ndeye Khady", "RAMATA GAYE", "ALIOU CISSE", "ADAMA MBAYE", "COUMBA BA", 
  "NDONGO GAYE", "MAISSA SALL", "Thierno sadou Diallo", "COUMBA NIANG", "NDÉYE FALL"
];

export const MESSAGE_TONES = {
  PRO: "Professionnel",
  FRIENDLY: "Amical",
  URGENT: "Urgent",
  GOLD: "Félicitations Gold"
};

export const WA_TEMPLATES = {
  ROUGE: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller", fleetPhone: string = "") => {
    const intro = `Bonjour ${nom}, c'est ${agent} de ${fleet}.`;
    const contact = fleetPhone ? ` Vous pouvez nous joindre au ${fleetPhone}.` : "";
    const signature = `\n\nCordialement,\nL'équipe ${fleet}`;
    
    if (tone === "FRIENDLY") return `Salut ${nom} 👋, c'est ${agent} de ${fleet}. On s'inquiète un peu car on ne te voit plus sur la route. Tout va bien ? N'hésite pas à me faire signe si tu as besoin d'aide ! 🤝${signature}`;
    if (tone === "URGENT") return `ALERTE ${nom} 🚨! Ici ${agent} (${fleet}). Votre compte risque d'être archivé sous 24h. Contactez-nous d'urgence au ${fleetPhone || "votre agence"} pour éviter le blocage définitif. 📞${signature}`;
    return `${intro} Nous constatons une inactivité prolongée. Merci de nous contacter pour faire le point sur votre situation.${contact}${signature}`;
  },
  ORANGE: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller", fleetPhone: string = "") => {
    const intro = `Bonjour ${nom}, c'est ${agent} de ${fleet}.`;
    const signature = `\n\nCordialement,\nL'équipe ${fleet}`;
    if (tone === "FRIENDLY") return `Coucou ${nom} ! 😊 C'est ${agent}. Des nouveaux bonus t'attendent chez ${fleet} cette semaine. Ne les laisse pas passer, on compte sur toi ! 🚕${signature}`;
    if (tone === "URGENT") return `Attention ${nom} ⚠️, votre activité chez ${fleet} est en baisse. Reprenez la route aujourd'hui pour sécuriser vos revenus. Besoin d'aide ? Appelez-moi au ${fleetPhone || "l'agence"}.${signature}`;
    return `${intro} Nous vous informons que des opportunités de gains sont disponibles. Nous vous encourageons à reprendre votre activité rapidement.${signature}`;
  },
  NOUVEAU: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller") => {
    const signature = `\n\nBienvenue chez ${fleet} !`;
    if (tone === "FRIENDLY") return `Bienvenue dans la famille ${fleet}, ${nom} ! 🎉 C'est ${agent}, je suis ravi de t'accompagner. Si tu as la moindre question pour tes premières courses, je suis là ! 🚀${signature}`;
    return `Bonjour ${nom}, bienvenue chez ${fleet}. Je suis ${agent}, votre interlocuteur dédié. Votre compte est prêt, n'hésitez pas à me solliciter pour vos débuts.${signature}`;
  },
  GOLD: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller") => {
    const signature = `\n\nL'équipe ${fleet}`;
    return `Félicitations ${nom} ! 🏆 Vous avez atteint l'objectif Gold chez ${fleet}. Votre recrutement est officiellement validé. Continuez sur cette lancée ! 🚀${signature}`;
  },
  SOLDE: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller", fleetPhone: string = "") => 
    `Bonjour ${nom}, c'est ${agent} (${fleet}). Votre solde est insuffisant pour continuer. Merci de recharger ou de nous appeler au ${fleetPhone || "l'agence"}.\n\nL'équipe ${fleet}`,
  OK: (nom: string, fleet: string, tone: string = "PRO", agent: string = "Votre conseiller") => 
    `Bonjour ${nom}, c'est ${agent} de ${fleet}. Merci pour votre excellent travail ! 🌟\n\nL'équipe ${fleet}`,
};

export const ZONE_CONFIG: Record<string, any> = {
  ROUGE: {
    label: "Zone Rouge", color: "#ef4444", bg: "#fef2f2", border: "#fca5a5", priority: 1,
    icon: "🚨", joursMin: 7, joursMax: 12,
    risque: "Archivage automatique imminent (J+15)",
    action: "Appel téléphonique OBLIGATOIRE dans la journée",
    causes: ["Panne véhicule", "Accident", "Départ vers la concurrence", "Problème personnel", "Document expiré"],
    conseil: "Proposer une solution concrète : avance sur solde, aide document, mise en relation garage partenaire.",
    urgence: "CRITIQUE",
  },
  ORANGE: {
    label: "Zone Orange", color: "#f97316", bg: "#fff7ed", border: "#fed7aa", priority: 2,
    icon: "⚠️", joursMin: 3, joursMax: 6,
    risque: "Glissement possible vers Zone Rouge si pas de contact sous 48h",
    action: "Appel ou SMS groupé — rappeler les avantages actifs",
    causes: ["Démotivation passagère", "Solde insuffisant", "Problème technique mineur", "Manque de courses dans la zone"],
    conseil: "Rappeler les bonus en cours. Vérifier le solde et proposer un rechargement si nécessaire.",
    urgence: "MODÉRÉE",
  },
  NOUVEAU: {
    label: "Nouveau", color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd", priority: 3,
    icon: "🎉", joursMin: null, joursMax: null,
    risque: "Abandon avant la 1ère course — taux d'activation faible",
    action: "Appel de bienvenue dans les 48h suivant l'inscription",
    causes: ["Problème de connexion à l'app", "Documents non validés", "Ne comprend pas le fonctionnement", "Peur de commencer"],
    conseil: "Guider pas à pas : connexion app, première zone recommandée, heure de pointe, premier bonus débloqué.",
    urgence: "IMPORTANT",
  },
  OK: {
    label: "Actif", color: "#22c55e", bg: "#f0fdf4", border: "#86efac", priority: 4,
    icon: "✅", joursMin: 0, joursMax: 2,
    risque: "Aucun risque immédiat",
    action: "Maintenir la relation — appel de fidélisation mensuel recommandé",
    causes: [],
    conseil: "Informer des nouveaux bonus, recueillir les retours terrain, valoriser les bons chauffeurs.",
    urgence: "FAIBLE",
  },
  INCONNU: {
    label: "Inconnu", color: "#6b7280", bg: "#f9fafb", border: "#d1d5db", priority: 5,
    icon: "❓", joursMin: null, joursMax: null,
    risque: "Données manquantes — impossible d'évaluer le risque",
    action: "Vérifier les données dans Yango Admin",
    causes: ["Date de dernière course absente", "Compte jamais activé", "Erreur de synchronisation CSV"],
    conseil: "Mettre à jour les données et reclassifier manuellement.",
    urgence: "À VÉRIFIER",
  },
};
