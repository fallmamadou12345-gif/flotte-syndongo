
export function waUrl(tel: string, message: string) {
  const clean = tel.replace(/\s+/g, "").replace(/^00/, "+");
  return `https://wa.me/${clean.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

export function generateSampleDrivers() {
  const names = ["Moussa Diallo", "Fatou Ndiaye", "Ibrahima Seck", "Aissatou Ba", "Mamadou Diop", "Rokhaya Fall", "Cheikh Mbaye", "Ndéye Sarr", "Alioune Diagne", "Mariama Sy", "Oumar Cissé", "Bineta Diouf", "Lamine Gaye", "Sokhna Thiaw", "Abdoulaye Niang", "Adja Kane", "Pape Faye", "Khady Mbaye", "Seydou Drame", "Ramatoulaye Barry"];
  const vehicles = ["Toyota Corolla", "Hyundai Elantra", "KIA Picanto", "Renault Logan", "Peugeot 301", "Daewoo Matiz", "Toyota Camry", "Nissan Sentra", "Honda Civic", "Suzuki Swift"];
  const responsables = ["Ndeye Khady", "RAMATA GAYE", "ALIOU CISSE", "ADAMA MBAYE", "COUMBA BA", "NDONGO GAYE", "MAISSA SALL"];
  const zones = ["ROUGE", "ROUGE", "ROUGE", "ORANGE", "ORANGE", "NOUVEAU", "NOUVEAU", "NOUVEAU", "OK", "OK", "OK", "OK"];
  const commentaires = ["INJOIGNABLE", "", "[PANNE] Sortie prévue vendredi", "[SOLDE] Recharge en cours", "[RAPPEL] Rappeler cet après-midi", "", "[MALADE] Retour lundi", "", "Bon chauffeur", "[DOCS] Permis expiré", "", ""];
  const fleetIds = ["diagne", "ndongo", "sy", "autres"];
  
  return Array.from({ length: 200 }, (_, i) => {
    const zone = zones[i % zones.length];
    const jours = zone === "ROUGE" ? 7 + (i % 6) : zone === "ORANGE" ? 3 + (i % 4) : zone === "OK" ? (i % 2) : null;
    const solde = Math.round((Math.random() * 1200 - 600) * 100) / 100;
    const limite = [-600, -100, 100][i % 3];
    
    return {
      id: `driver-${i}`,
      nom: names[i % names.length] + (i > 19 ? ` ${i}` : ""),
      tel: `+221${7}${String(60000000 + i * 13).slice(0, 8)}`,
      solde,
      limite,
      derniere_commande: jours ? new Date(Date.now() - (jours as number) * 86400000).toISOString().slice(0, 10) : "",
      jours_inactif: jours,
      commandes: zone === "NOUVEAU" ? 0 : 10 + i * 3,
      zone,
      responsable: responsables[i % responsables.length],
      commentaire: commentaires[i % commentaires.length],
      vehicule: vehicles[i % vehicles.length],
      plaque: `AA${String(100 + i).slice(1)}JF`,
      note: (3.5 + Math.random() * 1.5).toFixed(1),
      date_ajout: new Date(Date.now() - (30 + i) * 86400000).toISOString().slice(0, 10),
      fin_bloque: limite < 0 && solde <= limite,
      ville: ["Dakar", "Pikine", "Guédiawaye", "Thiès", "Saint-Louis"][i % 5],
      fleetId: fleetIds[i % fleetIds.length],
      _called: false,
      _callCount: 0,
      _callLog: [],
    };
  });
}
