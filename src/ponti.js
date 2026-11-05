// ---------- temi: per ogni tema classico, la rete fra ricerca sulle persone e analogie in natura ----------
let PONTI = [];
const TEMA = {k:null, pending:null};
function normPonte(d, id){
  const arr = v => Array.isArray(v) ? v.map(String) : [];
  return {k:id, tema:String(d.tema || id), domanda:String(d.domanda || ""), macro:MACRO.some(m => m.k === d.macro) ? d.macro : "tra", leva:String(d.leva || ""),
    meccanismo:String(d.meccanismo || ""), ricerca:String(d.ricerca || ""), strumento:String(d.strumento || ""), limite:String(d.limite || ""),
    natura:arr(d.natura), persone:arr(d.persone), temi:arr(d.temi), ordine:Number(d.ordine) || 99};
}
const ponteOf = k => PONTI.find(p => p.k === k);
const temiDiGruppo = ids => { const set = new Set(ids); return TEMI.map(t => [t, schedeDelTema(t.k).filter(s => set.has(s.id)).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 6).map(x => x[0]); };
const temaBtns = list => list.length ? `<div class="pbtns"><span class="ctl-label">Temi</span>${list.map(t => `<button class="pbtn" data-tema="${esc(t.k)}">${pontiDelTema(t.k).length ? '<span class="pdot"></span>' : ""}${esc(t.n)}</button>`).join("")}</div>` : "";
function wireTemaBtns(root){ root.querySelectorAll("[data-tema]").forEach(b => b.onclick = ev => { ev.stopPropagation(); ev.preventDefault(); if (!$("pHome").hidden) openTema(b.dataset.tema); else go("tema-" + b.dataset.tema); }); }
$("ponteClose").onclick = () => openTema(null);

function openTema(k, isPonte){
  if (k && isPonte) { const p = ponteOf(k); if (!p) { TEMA.pending = "ponte:" + k; return; } k = p.temi[0] || null; }
  const t = k ? temaOf(k) : null, box = $("ponte");
  if (k && (!t || !SCHEDE.length)) { TEMA.pending = k; return; }
  TEMA.k = t ? k : null;
  document.body.classList.toggle("ponteopen", !!t);
  box.hidden = !t; $("pathSel").value = TEMA.k || ""; $("ctxSel").value = TEMA.k || "";
  if (!t && /^#(tema|ponte)-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  if (!t) { if (ECO.focus && String(ECO.focus).startsWith("p:")) focusEco(null); ECO.fit && ECO.fit(); return; }
  renderTema(t);
  box.scrollTop = 0;
  focusEco("p:" + t.k);
  ECO.fit && ECO.fit();
}
function renderTema(t){
  const pp = pontiDelTema(t.k), all = schedeDelTema(t.k);
  const deg = s => (ADJ[s.id] ? ADJ[s.id].size : 0) + s.microtemi.filter(x => t.mt.includes(x)).length * 2;
  const persone = all.filter(s => !isNat(s)).sort((a, b) => deg(b) - deg(a));
  const natIds = [...new Set([...pp.flatMap(p => p.natura), ...all.filter(isNat).map(s => s.id)])].filter(i => byId[i]);
  const natura = natIds.map(i => byId[i]);
  $("ponteEye").textContent = "Contesto · livello " + LIVELLI[t.liv].n.toLowerCase();
  $("ponteTema").textContent = t.n;
  $("ponteMacro").innerHTML = citaLinks(t.s || t.d, all.map(s => s.id));
  $("ponteCap").textContent = natura.length
    ? "Come si legge: a sinistra gli studi su persone, organizzazioni e lavoro che l'archivio collega a questo tema, a destra i fenomeni naturali che mostrano lo stesso meccanismo. Tutte le linee portano al tema, al centro. Passa sopra un nome per vederlo sulla mappa, cliccalo per leggerne la scheda."
    : "Come si legge: a sinistra gli studi su persone, organizzazioni e lavoro che l'archivio collega a questo tema; a destra, quando esistono, i fenomeni naturali che mostrano lo stesso meccanismo. Passa sopra un nome per vederlo sulla mappa, cliccalo per leggerne la scheda.";
  drawRete(t, persone, natura);
  const sez = pp.map((p, i) => `<details class="pdet"${i === 0 ? " open" : ""}><summary><span class="pdot"></span>${esc(p.tema)}</summary>
      <p class="pq2">«${esc(p.domanda)}»</p>
      <h4>Il meccanismo in natura</h4><p>${citaLinks(p.meccanismo, [...p.natura, ...p.persone])}</p>
      <h4>Sulle persone</h4><p>${citaLinks(p.ricerca, [...p.persone, ...p.natura])}</p>
      <div class="adm"><h4>Lo strumento</h4><p>${citaLinks(p.strumento, [...p.persone, ...p.natura])}</p></div>
      <h4>Il limite dell'analogia</h4><p>${citaLinks(p.limite, [...p.natura, ...p.persone])}</p>
      ${riferimenti([...p.natura, ...p.persone])}</details>`).join("");
  $("ponteTesto").innerHTML = `
    <p class="pq">«${esc(t.q)}»</p>
    <p class="pstat">${persone.length} ricerche e casi sulle persone · ${natura.length} evidenze dalla natura</p>
    ${pp.length ? `<h4 class="ph">Analogie in natura</h4>${sez}` : `<p class="pgap">Per questo tema l'archivio non ha ancora un'analogia in natura documentata. Non è un difetto: non tutti i temi ne hanno una, e il metodo non ne inventa.</p>`}
    <div class="actions"><button class="btn ghost" id="temaList">Leggi le ${all.length} schede nell'archivio →</button></div>
    <p class="phelp">Apre l'archivio filtrato su questo contesto: per ogni ricerca la sinossi, che cosa significa in azienda e il link alla fonte originale.</p>`;
  $("temaList").onclick = () => apriArchivio({path:t.k});
}


// citazioni: ogni cognome citato nel testo diventa un link alla sua scheda; i riferimenti completi in fondo
const cognomeDi = s => (splitAuthors(s.autori)[0] || "").split(" ").pop();
const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function citaLinks(testo, ids){
  const pref = (ids || []).map(id => byId[id]).filter(Boolean);
  const visti = new Set(), cands = [];
  [...pref, ...SCHEDE].forEach(s => {
    const et = String(s.etichetta || "").replace(/\s+et al\.?$/i, "").trim(), c = cognomeDi(s);
    [et.includes(" e ") ? et : "", c].forEach(x => { if (x && x.length >= 4 && !visti.has(x)) { visti.add(x); cands.push([x, s]); } });
  });
  cands.sort((a, b) => b[0].length - a[0].length);
  // parti: testo semplice da linkare oppure link già fatti
  let parti = [{t:String(testo || "")}];
  cands.forEach(([c, s]) => {
    const re = new RegExp(`(^|[^\\p{L}])(${reEsc(c)})(?=[^\\p{L}]|$)`, "u");
    for (let k = 0; k < parti.length; k++) {
      const x = parti[k]; if (x.s) continue;
      const m = re.exec(x.t); if (!m) continue;
      const a = m.index + m[1].length, b = a + m[2].length;
      parti.splice(k, 1, {t:x.t.slice(0, a)}, {t:m[2], s}, {t:x.t.slice(b)});
      break;
    }
  });
  return parti.map(x => x.s ? `<a class="cit" href="#scheda-${encodeURIComponent(x.s.id)}" title="${esc(label(x.s) + (x.s.anno ? ", " + x.s.anno : "") + ". " + x.s.titolo)}">${esc(x.t)}</a>` : esc(x.t)).join("");
}
function riferimenti(ids){
  const ss = (ids || []).map(id => byId[id]).filter(Boolean);
  if (!ss.length) return "";
  const ext = s => s.url || (s.doi ? "https://doi.org/" + s.doi : "");
  return `<h4>Riferimenti</h4><ol class="prif">${ss.map(s => `<li><a href="#scheda-${encodeURIComponent(s.id)}">${esc(label(s))}${s.anno ? " (" + s.anno + ")" : ""}</a>, <i>${esc(s.titolo)}</i>${s.fonte ? ". " + esc(s.fonte) : ""}${ext(s) ? ` <a class="pext" href="${esc(ext(s))}" target="_blank" rel="noopener">fonte ↗</a>` : ""}</li>`).join("")}</ol>`;
}
// la rete: a sinistra la ricerca sulle persone, al centro il tema, a destra le analogie in natura
function drawRete(t, persone, natura){
  const svg = d3.select("#ponteNet"); svg.selectAll("*").remove();
  const W = Math.max(280, $("ponteBody").clientWidth - 4 || 400), MAX = 10;
  const L = persone.slice(0, MAX), R = natura.slice(0, MAX);
  const two = W < 560, top = 30 + (two ? 13 : 0);
  const row = 24, n = Math.max(L.length, R.length, 3), H = n * row + 50 + (two ? 13 : 0) + (persone.length > MAX || natura.length > MAX ? 14 : 0);
  svg.attr("viewBox", [0, 0, W, H]).attr("height", H);
  const xl = W * .3, xr = W * .7, xc = W / 2, yc = top + (n * row) / 2;
  const ys = (arr, i) => top + (n * row - arr.length * row) / 2 + i * row + row / 2;
  const nl = L.map((s, i) => ({s, x:xl, y:ys(L, i), side:-1})), nr = R.map((s, i) => ({s, x:xr, y:ys(R, i), side:1}));
  const hl = svg.append("text").attr("class", "nhead").attr("x", 0).attr("y", 13);
  if (two) { hl.append("tspan").attr("x", 0).text("Studi su persone,"); hl.append("tspan").attr("x", 0).attr("dy", 13).text(`organizzazioni e lavoro · ${persone.length}`); }
  else hl.text(`Studi su persone, organizzazioni e lavoro · ${persone.length}`);
  svg.append("text").attr("class", "nhead nat").attr("x", W).attr("y", 13).attr("text-anchor", "end").text(`Analogie in natura · ${natura.length}`);
  if (persone.length > MAX) svg.append("text").attr("class", "nmore").attr("x", 0).attr("y", H - 4).text(`e altre ${persone.length - MAX}`);
  if (natura.length > MAX) svg.append("text").attr("class", "nmore").attr("x", W).attr("y", H - 4).attr("text-anchor", "end").text(`e altre ${natura.length - MAX}`);
  const g = svg.append("g");
  [...nl, ...nr].forEach(a => g.append("path").attr("class", "ns " + (a.side > 0 ? "nsr" : "nsl")).attr("data-id", a.s.id).attr("d", `M${a.x},${a.y} C${(a.x + xc) / 2},${a.y} ${(a.x + xc) / 2},${yc} ${xc},${yc}`).style("stroke", a.side < 0 ? mcol(a.s.macro) : null));
  if (!R.length) g.append("text").attr("class", "nempty").attr("x", W).attr("y", yc).attr("dy", "0.35em").attr("text-anchor", "end").text("nessuna, per ora");
  const col = `var(--ink)`;
  g.append("circle").attr("class", "nc").attr("cx", xc).attr("cy", yc).attr("r", 11).style("fill", col);
  g.append("circle").attr("class", "nc2").attr("cx", xc).attr("cy", yc).attr("r", 17).style("stroke", col);
  g.append("text").attr("class", "nclbl").attr("x", xc).attr("y", yc + 30).attr("text-anchor", "middle").text("il tema");
  const N = g.selectAll("g.nn").data([...nl, ...nr]).join("g").attr("class", d => "nn" + (d.side > 0 ? " nat" : "")).attr("transform", d => `translate(${d.x},${d.y})`).attr("tabindex", 0).attr("role", "button").attr("aria-label", d => d.s.titolo);
  N.append("circle").attr("r", 6).style("fill", d => mcol(d.s.macro));
  N.append("text").attr("x", d => d.side * 10).attr("dy", "0.35em").attr("text-anchor", d => d.side > 0 ? "start" : "end").text(d => { const s = label(d.s) + (d.s.anno ? ", " + d.s.anno : ""), max = Math.max(8, Math.floor((d.side > 0 ? W - xr - 12 : xl - 12) / 5.6)); return s.length > max ? s.slice(0, max - 1) + "…" : s; });
  N.append("title").text(d => `${d.s.titolo} · ${d.s.autori}${d.s.anno ? ", " + d.s.anno : ""}`);
  const on = id => { g.selectAll(".ns").classed("on", function(){ return this.dataset.id === id; }); ECO.hl && ECO.hl(id || "p:" + t.k); };
  N.on("mouseenter", (e, d) => on(d.s.id)).on("mouseleave", () => on(null))
   .on("click", (e, d) => { e.stopPropagation(); focusEco(d.s.id); })
   .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focusEco(d.s.id); } });
}
