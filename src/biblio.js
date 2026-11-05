
// ---------- la mia biblioteca (ogni iscritto, dati privati) ----------
const BIB = {uid:null, col:null, docs:{}, ready:false};
const bibDoc = id => BIB.docs[id];
const bibRaccolte = () => (bibDoc("raccolte") && Array.isArray(bibDoc("raccolte").nomi) ? bibDoc("raccolte").nomi : []);
async function bibSet(id, data){ if (!BIB.col) return; try { await BIB.col.doc(id).set(data); } catch (e) { bibMsg("Non sono riuscito a salvare. Riprova."); } }
async function bibDel(id){ if (!BIB.col) return; try { await BIB.col.doc(id).delete(); } catch (e) { bibMsg("Non sono riuscito a togliere l'elemento. Riprova."); } }
function bibMsg(t){ const m = $("bibMsg"); if (m) { m.textContent = t; m.hidden = !t; } }
const bibIdS = sid => "s-" + sid, bibIdA = aid => "a-" + aid;

function bibBoxScheda(s){
  if (!BIB.ready) return "";
  const d = bibDoc(bibIdS(s.id)), rac = bibRaccolte();
  return `<div class="box bibbox"><h3>La mia biblioteca</h3>
    <button class="btn${d ? " ghost" : ""}" id="bibStar">${d ? "★ Salvata · togli" : "☆ Salva nella biblioteca"}</button>
    ${d ? `${rac.length ? `<p class="ctl-label" style="margin-top:10px">Raccolte</p><div class="minichips">${rac.map(n => `<button class="chip" data-rac="${esc(n)}" aria-pressed="${(d.raccolte || []).includes(n)}">${esc(n)}</button>`).join("")}</div>` : `<p class="bibhelp">Crea le raccolte nella pagina «La mia biblioteca».</p>`}
      <label class="ctl-label" for="bibNota" style="margin-top:10px;display:block">Nota personale</label>
      <textarea id="bibNota" rows="4" placeholder="Visibile solo a te">${esc(d.nota || "")}</textarea><span class="bibhelp" id="bibNotaSt"></span>` : `<p class="bibhelp">Le schede salvate, le note e le raccolte sono visibili solo a te.</p>`}
  </div>`;
}
function wireBibScheda(s){
  const b = $("bibStar"); if (!b) return;
  b.onclick = () => bibDoc(bibIdS(s.id)) ? bibDel(bibIdS(s.id)) : bibSet(bibIdS(s.id), {tipo:"scheda", ref:s.id, nota:"", raccolte:[], creata:new Date().toISOString()});
  document.querySelectorAll("#pScheda [data-rac]").forEach(c => c.onclick = () => {
    const d = bibDoc(bibIdS(s.id)); if (!d) return; const set = new Set(d.raccolte || []);
    set.has(c.dataset.rac) ? set.delete(c.dataset.rac) : set.add(c.dataset.rac);
    bibSet(bibIdS(s.id), {...d, raccolte:[...set]});
  });
  const t = $("bibNota");
  if (t) t.onchange = () => { const d = bibDoc(bibIdS(s.id)); if (!d) return; bibSet(bibIdS(s.id), {...d, nota:t.value}); $("bibNotaSt").textContent = "Nota salvata"; };
}
const _renderScheda = renderScheda;
renderScheda = function(id){
  _renderScheda(id);
  const s = byId[id], side = document.querySelector("#pScheda .side"); if (!s || !side) return;
  let extra = bibBoxScheda(s);
  if (canEdit) extra = `<div class="box"><h3>Stato redazionale</h3><p class="rmeta">${approvata(s) ? "Approvata per il sito" + (s.approvata ? " il " + esc(s.approvata.split("-").reverse().join("/")) : "") : "Da rivedere: non comparirà sul sito pubblico finché non la approvi."}</p><button class="btn ghost" id="redAppr">${approvata(s) ? "Ritira l'approvazione" : "Approva per il sito"}</button></div>` + extra;
  side.insertAdjacentHTML("afterbegin", extra);
  wireBibScheda(s);
  if ($("redAppr")) $("redAppr").onclick = ev => approva(s.id, !approvata(s), ev.currentTarget);
};
const _renderAutore = renderAutore;
renderAutore = function(id){
  _renderAutore(id);
  if (!BIB.ready || !AUT.get(id)) return;
  const h = document.querySelector("#pAutore h1"); if (!h) return;
  const seg = !!bibDoc(bibIdA(id));
  h.insertAdjacentHTML("afterend", `<button class="btn${seg ? " ghost" : ""}" id="bibFollow" style="margin-top:10px">${seg ? "✓ Segui già · smetti" : "+ Segui questo autore"}</button>`);
  $("bibFollow").onclick = () => seg ? bibDel(bibIdA(id)) : bibSet(bibIdA(id), {tipo:"autore", ref:id, creata:new Date().toISOString()});
};
function descriviRicerca(st){
  const p = [];
  if (st.q) p.push(`«${st.q}»`);
  if (st.path && temaOf(st.path)) p.push("contesto " + temaOf(st.path).n);
  if (st.lev != null && LIVELLI[st.lev]) p.push("livello " + LIVELLI[st.lev].n);
  if (st.macro) p.push(macroOf(st.macro).n);
  if (st.leva && levaOf(st.leva)) p.push("leva " + levaOf(st.leva).n);
  if (st.disc === "nat") p.push("evidenze dalla natura");
  if (st.topics && st.topics.length) p.push("micro-temi " + st.topics.join(", "));
  return p.join(" · ") || "tutto l'archivio";
}
function salvaRicerca(){
  const st = {q:state.q, macro:state.macro, leva:state.leva, lev:state.lev ?? null, disc:state.disc, topics:[...state.topics], path:state.path};
  const id = "r-" + new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
  bibSet(id, {tipo:"ricerca", nome:descriviRicerca(st), stato:st, n:SCHEDE.filter(matches).length, creata:new Date().toISOString()});
  const b = $("bibSaveQ"); if (b) { b.textContent = "Ricerca salvata ✓"; setTimeout(() => { b.textContent = "Salva questa ricerca"; }, 2500); }
}
function apriRicerca(st){
  Object.assign(state, {tag:null, tipo:"", q:st.q || "", macro:st.macro || null, leva:st.leva || null, lev:st.lev ?? null, disc:st.disc || "", topics:Array.isArray(st.topics) ? st.topics : [], path:st.path || null, shown:60});
  state.qm = state.q ? matcher(state.q) : null; $("q").value = state.q;
  setView("elenco"); go("archivio"); update();
}
function bibliografia(list){
  return list.map(s => `${s.autori || label(s)} (${s.anno || "s.d."}). ${s.titolo}. ${s.fonte}${s.doi ? ". https://doi.org/" + s.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "") : (s.url ? ". " + s.url : "")}`).sort((a, b) => a.localeCompare(b, "it")).join("\n");
}
function renderBiblio(){
  const box = $("bibBody"); if (!box) return;
  if (!BIB.ready) { box.innerHTML = `<p class="empty">La biblioteca personale è disponibile per chi è collegato con il proprio account.</p>`; return; }
  const all = Object.entries(BIB.docs).map(([id, d]) => ({id, ...d}));
  const ricerche = all.filter(d => d.tipo === "ricerca").sort((a, b) => String(b.creata).localeCompare(String(a.creata)));
  const autori = all.filter(d => d.tipo === "autore" && AUT.get(d.ref));
  const schede = all.filter(d => d.tipo === "scheda" && byId[d.ref]);
  const rac = bibRaccolte();
  const gruppo = n => schede.filter(d => n === null ? !(d.raccolte || []).length : (d.raccolte || []).includes(n));
  const rigaS = d => { const s = byId[d.ref]; return `<li class="rrow"><span class="dot${isNat(s) ? " natdot" : ""}" style="background:${mcol(s.macro)}"></span><div class="rtx"><a href="#scheda-${encodeURIComponent(s.id)}">${esc(label(s))}${s.anno ? ", " + s.anno : ""} · ${esc(s.titolo)}</a>${d.nota ? `<span class="bibnota">${esc(d.nota)}</span>` : ""}</div><div class="ract"><button class="linkbtn" data-bdel="${esc(d.id)}">togli</button></div></li>`; };
  const sezRac = (titolo, items, nome) => items.length || nome !== undefined ? `<div class="bibrac"><div class="bibrh"><h4>${esc(titolo)} · ${items.length}</h4>${items.length ? `<button class="linkbtn" data-bcopy="${nome === undefined ? "" : esc(nome ?? "__none")}">copia la bibliografia</button>` : ""}${typeof nome === "string" ? `<button class="linkbtn" data-rdel="${esc(nome)}">elimina raccolta</button>` : ""}</div><ul class="rlist">${items.map(rigaS).join("") || `<li class="empty">Nessuna scheda in questa raccolta: aggiungila dalla pagina della scheda.</li>`}</ul></div>` : "";
  box.innerHTML = `<p class="bibmsg" id="bibMsg" hidden></p>
    <section class="bsec2"><h3>Ricerche salvate · ${ricerche.length}</h3>
      ${ricerche.length ? `<ul class="rlist">${ricerche.map(r => `<li class="rrow"><div class="rtx"><button class="linkbtn big" data-bq="${esc(r.id)}">${esc(r.nome)}</button><span class="rmeta">Salvata il ${esc(String(r.creata).slice(0, 10).split("-").reverse().join("/"))} con ${Number(r.n) || 0} schede · oggi ${SCHEDE.filter(s => { const o = {...state}; Object.assign(state, {q:r.stato.q || "", qm:r.stato.q ? matcher(r.stato.q) : null, macro:r.stato.macro || null, leva:r.stato.leva || null, lev:r.stato.lev ?? null, disc:r.stato.disc || "", topics:r.stato.topics || [], path:r.stato.path || null}); const m = matches(s); Object.assign(state, o); return m; }).length}</span></div><div class="ract"><button class="linkbtn" data-bdel="${esc(r.id)}">togli</button></div></li>`).join("")}</ul>` : `<p class="bibhelp">Nell'archivio, dopo aver scelto parole e filtri, premi «Salva questa ricerca». Qui vedrai anche quante schede nuove sono arrivate da allora.</p>`}
    </section>
    <section class="bsec2"><h3>Autori seguiti · ${autori.length}</h3>
      ${autori.length ? `<div class="minichips">${autori.map(d => `<a class="chip" href="#autore-${encodeURIComponent(d.ref)}">${esc(AUT.get(d.ref).nome)} · ${AUT.get(d.ref).schede.length}</a>`).join("")}</div>` : `<p class="bibhelp">Nella pagina di un autore premi «Segui questo autore».</p>`}
    </section>
    <section class="bsec2"><h3>Schede salvate · ${schede.length}</h3>
      <form class="bibnew" id="bibNewRac"><input id="bibRacName" maxlength="60" placeholder="Nuova raccolta, per esempio «Tesi» o «Cliente Rossi»"><button class="btn ghost">Crea raccolta</button></form>
      ${rac.map(n => sezRac(n, gruppo(n), n)).join("")}
      ${sezRac(rac.length ? "Senza raccolta" : "Tutte le schede salvate", rac.length ? gruppo(null) : schede, rac.length ? null : undefined)}
      ${schede.length ? "" : `<p class="bibhelp">Nella pagina di una scheda premi «Salva nella biblioteca». Puoi aggiungere una nota personale e assegnarla a una o più raccolte.</p>`}
    </section>`;
  box.querySelectorAll("[data-bdel]").forEach(b => b.onclick = () => bibDel(b.dataset.bdel));
  box.querySelectorAll("[data-bq]").forEach(b => b.onclick = () => { const r = bibDoc(b.dataset.bq); if (r) apriRicerca(r.stato || {}); });
  box.querySelectorAll("[data-rdel]").forEach(b => b.onclick = async () => {
    const n = b.dataset.rdel;
    if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "conferma: le schede restano salvate"; return; }
    await bibSet("raccolte", {tipo:"raccolte", nomi:rac.filter(x => x !== n)});
  });
  box.querySelectorAll("[data-bcopy]").forEach(b => b.onclick = async () => {
    const n = b.dataset.bcopy, items = n === "" ? schede : n === "__none" ? gruppo(null) : gruppo(n);
    const txt = bibliografia(items.map(d => byId[d.ref]));
    try { await navigator.clipboard.writeText(txt); b.textContent = "bibliografia copiata ✓"; }
    catch (e) { bibMsg(txt); }
  });
  $("bibNewRac").onsubmit = ev => { ev.preventDefault(); const n = $("bibRacName").value.trim().slice(0, 60); if (!n || rac.includes(n)) return; bibSet("raccolte", {tipo:"raccolte", nomi:[...rac, n]}); };
}
async function avviaBiblio(userNs){
  try { BIB.uid = userNs ? await userNs.id() : null; } catch (e) { BIB.uid = null; }
  if (!BIB.uid || !db) { renderBiblio(); return; }
  BIB.col = db.collection("data/users/" + BIB.uid);
  BIB.col.onSnapshot(snap => {
    BIB.docs = {}; snap.docs.filter(d => d.exists).forEach(d => { BIB.docs[d.id] = d.data(); });
    BIB.ready = true; document.body.classList.add("iscritto");
    const h = decodeURIComponent((location.hash || "").slice(1));
    if (h === "biblioteca") renderBiblio();
    else if (h.startsWith("scheda-")) renderScheda(h.slice(7));
    else if (h.startsWith("autore-")) renderAutore(h.slice(7));
  }, () => { renderBiblio(); });
}
if ($("bibSaveQ")) $("bibSaveQ").onclick = salvaRicerca;
