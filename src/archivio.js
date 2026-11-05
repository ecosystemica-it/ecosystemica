
// ---------- l'archivio: filtri attivi sempre visibili, pannello dei filtri, nessun risultato spiegato ----------
function filtriAttivi(){
  const F = [], tm = state.path && temaOf(state.path);
  if (tm) F.push({k:"Contesto", v:tm.n, d:tm.d, off:() => { state.path = null; }});
  if (state.lev != null) F.push({k:"Livello", v:LIVELLI[state.lev].n, pan:true, off:() => { state.lev = null; }});
  if (state.macro) F.push({k:"Macro-area", v:macroOf(state.macro).n, pan:true, off:() => { state.macro = null; }});
  if (state.disc) F.push({k:state.disc === "nat" ? "Solo" : "Disciplina", v:state.disc === "nat" ? "evidenze dalla natura" : (AREE.find(a => a.k === state.disc) || {}).n, pan:true, off:() => { state.disc = ""; }});
  if (state.leva) F.push({k:"Leva", v:levaOf(state.leva).n, pan:true, off:() => { state.leva = null; }});
  if (state.tipo) F.push({k:"Tipo", v:state.tipo === "caso" ? "casi studio" : "libri e ricerche", pan:true, off:() => { state.tipo = ""; }});
  if (state.tag) F.push({k:TAGFAM[state.tag.f], v:state.tag.v, d:state.tag.f === "concetti" && VOCAB[state.tag.v] ? VOCAB[state.tag.v].definizione : "", pan:true, off:() => { state.tag = null; }});
  if (state.q) F.push({k:"Ricerca", v:"«" + state.q + "»", off:() => { state.q = ""; state.qm = null; }});
  state.topics.forEach(t => F.push({k:"Micro-tema", v:t, off:() => { state.topics = state.topics.filter(x => x !== t); }}));
  return F;
}
// riallinea i controlli allo stato dopo che un filtro è stato tolto
function allineaControlli(){
  if ($("q")) $("q").value = state.q || ""; if ($("discSel")) $("discSel").value = state.disc || ""; if ($("tipoSel")) $("tipoSel").value = state.tipo || "";
  fillTagSelects();
}
function renderAttivi(list){
  const box = $("attivi"); if (!box) return;
  const F = filtriAttivi(), nPan = F.filter(f => f.pan).length;
  $("filtNum").textContent = nPan ? ` · ${nPan}` : "";
  box.hidden = !F.length;
  box.innerHTML = F.length ? `<div class="attrow"><span class="ctl-label">Filtri attivi</span>${F.map((f, i) => `<button class="chip on" data-foff="${i}" title="Togli questo filtro"><span class="fk">${esc(f.k)}</span>${esc(f.v)} ✕</button>`).join("")}${F.length > 1 ? `<button class="linkbtn" id="fAll">Azzera tutto</button>` : ""}</div>${F.filter(f => f.d).map(f => `<p class="fdef"><b>${esc(f.v)}.</b> ${esc(f.d)}</p>`).join("")}` : "";
  box.querySelectorAll("[data-foff]").forEach(b => b.onclick = () => { F[+b.dataset.foff].off(); state.shown = 60; allineaControlli(); update(); });
  if ($("fAll")) $("fAll").onclick = () => { azzeraFiltri(); update(); };
  if (!list.length && F.length && SCHEDE.length) zeroRisultati(F);
}
// nessuna scheda: per ogni filtro attivo, quante schede tornerebbero togliendo solo quello
function zeroRisultati(F){
  const snap = () => ({...state, topics:[...state.topics], tag:state.tag ? {...state.tag} : null});
  const conti = F.map((f, i) => { const s0 = snap(); f.off(); const n = SCHEDE.filter(matches).length; Object.assign(state, s0); return [i, n]; }).sort((a, b) => b[1] - a[1]);
  $("results").innerHTML = `<div class="zero"><p><b>Nessuna scheda soddisfa tutti questi filtri insieme.</b> Spesso succede quando resta acceso un filtro scelto prima. Togline uno:</p>
    <ul>${conti.map(([i, n]) => `<li><button class="chip" data-zoff="${i}">Togli ${esc(F[i].k.toLowerCase())}: ${esc(F[i].v)}</button><span class="rmeta">${n ? `torneranno ${n} schede` : "non basta da solo"}</span></li>`).join("")}</ul>
    <button class="btn" id="zAll">Azzera tutti i filtri</button></div>`;
  $("results").querySelectorAll("[data-zoff]").forEach(b => b.onclick = () => { F[+b.dataset.zoff].off(); state.shown = 60; allineaControlli(); update(); });
  $("zAll").onclick = () => { azzeraFiltri(); update(); };
  $("moreBtn").hidden = true;
}
$("filtBtn").onclick = () => { const p = $("filtPanel"); p.hidden = !p.hidden; $("filtBtn").setAttribute("aria-expanded", String(!p.hidden)); };
const _updateA = update;
update = function(){ _updateA(); if (!$("pArchivio").hidden) renderAttivi(state.view === "elenco" ? SCHEDE.filter(matches) : [1]); };
// sul telefono i livelli e le aree stanno chiusi sotto un pulsante, così le schede restano in vista
if ($("archlevTog")) $("archlevTog").onclick = () => { const box = $("archlevTog").parentElement, ap = !box.classList.contains("aperto"); box.classList.toggle("aperto", ap); $("archlevTog").setAttribute("aria-expanded", String(ap)); $("archlevTog").textContent = "Dove si trova il problema: livelli e aree " + (ap ? "▴" : "▾"); };
