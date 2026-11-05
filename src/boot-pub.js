
// ---------- avvio del sito pubblico: i dati sono dentro la pagina, nessuna funzione di redazione ----------
(() => {
  const D = window.__DATA || {schede:[], autori:[], ponti:[], vocabolario:[]};
  db = null; sample = null; canEdit = false; ruoloNoto = true;
  document.body.classList.remove("admin");
  if ($("newBtn")) $("newBtn").hidden = true;
  SCHEDE = D.schede.map(d => norm(d, d.id));
  PONTI = D.ponti.map(d => normPonte(d, d.id)).sort((a, b) => a.ordine - b.ordine || a.tema.localeCompare(b.tema));
  VOCAB = {}; D.vocabolario.forEach(x => { if (x && x.nome) VOCAB[String(x.nome)] = x; });
  AUTDOCS = {};
  D.autori.forEach(x => { AUTDOCS[x.id] = {id:x.id, nome:String(x.nome || ""), anni:String(x.anni || ""), sintesi:String(x.sintesi || ""), teoria:String(x.teoria || ""), url:String(x.url || ""), temi:Array.isArray(x.temi) ? x.temi : [], paroleChiave:Array.isArray(x.paroleChiave) ? x.paroleChiave : [], altreOpere:Array.isArray(x.altreOpere) ? x.altreOpere.map(String) : []}; });
  rebuild(); scheduleEco(); fillTagSelects();
  route();
  if (TEMA.pending) { const k = TEMA.pending; TEMA.pending = null; if (k.startsWith("ponte:")) openTema(k.slice(6), true); else openTema(k); }
})();
