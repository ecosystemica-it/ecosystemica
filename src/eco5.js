// ---------- mappa ad anelli: persona, gruppo, organizzazione, ambiente ----------
const ECO = {focus:null, svg:null, fit:null, timer:null, pending:false, k:1, pos:{}, decl:true, temi:true, nat:false};
function scheduleEco(){ if ($("pHome").hidden) { ECO.pending = true; return; } clearTimeout(ECO.timer); ECO.timer = setTimeout(buildEco, 120); }
window.addEventListener("resize", () => { clearTimeout(ECO.rs); ECO.rs = setTimeout(scheduleEco, 300); });
const isNat = s => s.area === "nat";

function relLinks(){
  const links = [], seen = new Map();
  const add = (a, b, kind, w, temi) => {
    const key = [a, b].sort().join("|"), cur = seen.get(key);
    if (cur) { if (kind === "d") cur.kind = "d"; cur.w = Math.max(cur.w, w); if (temi && temi.length) cur.temi = temi; return; }
    const l = {source:a, target:b, kind, w, temi:temi || []}; seen.set(key, l); links.push(l);
  };
  SCHEDE.forEach(s => ADJ[s.id].forEach(o => add(s.id, o, "d", 3)));
  SCHEDE.forEach(s => affini(s).slice(0, 4).forEach(([o, ts]) => add(s.id, o, "t", ts.length, ts)));
  return links;
}

function buildEco(){
  if (!window.d3 || !SCHEDE.length) return;
  const wrap = $("ecoWrap");
  const W = Math.max(320, wrap.clientWidth || 900), H = Math.max(360, wrap.clientHeight || 700);
  const svg = d3.select("#eco").attr("viewBox", [0, 0, W, H]);
  svg.selectAll("*").remove(); ECO.svg = svg;
  const C = 600, RR = 560, TAU = Math.PI * 2;
  const nodes = SCHEDE.map(s => ({id:s.id, s}));
  const byN = {}; nodes.forEach(n => byN[n.id] = n);
  const links = relLinks();
  const NB = {}; nodes.forEach(n => NB[n.id] = new Set());
  links.forEach(l => { NB[l.source].add(l.target); NB[l.target].add(l.source); });
  ECO.NB = NB;
  const R = d => Math.min(9, 3.5 + Math.sqrt(NB[d.id].size) * 1.2);
  const lev = k => Math.max(0, LIVELLI.findIndex(l => l.m.includes(k)));
  // fasce dei quattro livelli: la persona è il disco centrale
  const band = [[0, .2], [.24, .46], [.5, .77], [.81, 1]].map(([a, b]) => [a * RR, b * RR]);
  const GAP = 16 * Math.PI / 180, TOP = -Math.PI / 2;        // spazio in alto per il nome dell'anello
  // settori: ogni macro-area ha un arco della sua fascia, in proporzione alle schede
  const sectors = {};
  LIVELLI.forEach((l, L) => {
    const ms = l.m.map(k => ({k, n:nodes.filter(d => d.s.macro === k).length}));
    const w = ms.map(m => Math.sqrt(m.n) + 1.5), tot = d3.sum(w);
    const pad = ms.length > 1 ? 6 * Math.PI / 180 : 0;
    const span = TAU - GAP - pad * (ms.length - 1);
    let a = TOP + GAP / 2;
    ms.forEach((m, i) => { const da = span * w[i] / tot; sectors[m.k] = {L, a0:a, a1:a + da}; a += da + pad; });
  });
  const place = (list, sec) => {
    const [r0, r1] = band[sec.L];
    if (sec.L === 0) {             // disco centrale: spirale
      const g = Math.PI * (3 - Math.sqrt(5)), sp = Math.min(22, (r1 - 12) / Math.sqrt(Math.max(1, list.length)));
      list.forEach((n, i) => { const r = sp * Math.sqrt(i + .5), t = i * g + TOP; n.x = C + Math.cos(t) * r; n.y = C + Math.sin(t) * r; n.ang = t; });
      return;
    }
    let s = 26, used;
    const span = sec.a1 - sec.a0, n = list.length;
    for (;;) {                      // file concentriche nel settore, dalla mediana verso i bordi
      const rows = Math.max(1, Math.floor((r1 - r0 - 16) / s) + 1), mid = (r0 + r1) / 2;
      const rr = d3.range(rows).map(i => mid + (i - (rows - 1) / 2) * s).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
      used = []; let tot = 0;
      for (const r of rr) { if (tot >= n) break; const cap = Math.max(1, Math.floor(r * span / s)); used.push({r, cap}); tot += cap; }
      if (tot >= n || s < 9) break;
      s *= .88;
    }
    const capT = d3.sum(used, u => u.cap);
    used.forEach(u => u.m = Math.floor(n * u.cap / capT));
    let rest = n - d3.sum(used, u => u.m);
    for (let i = 0; rest > 0; i = (i + 1) % used.length) { if (used[i].m < used[i].cap) { used[i].m++; rest--; } }
    let slots = used.flatMap((u, i) => d3.range(u.m).map(j => ({r:u.r, t:sec.a0 + (j + .5 + (i % 2) * .25) * span / u.m})));
    slots.sort((a, b) => a.t - b.t || a.r - b.r);
    list.forEach((n, i) => { const p = slots[i % slots.length]; n.x = C + Math.cos(p.t) * p.r; n.y = C + Math.sin(p.t) * p.r; n.ang = p.t; });
  };
  const groups = {};
  nodes.forEach(n => (groups[n.s.macro] ||= []).push(n));
  Object.entries(groups).forEach(([k, list]) => { list.sort((a, b) => NB[b.id].size - NB[a.id].size || a.id.localeCompare(b.id)); place(list, sectors[k] || sectors.tra); });
  // secondo passaggio: dentro il settore, ogni scheda si avvicina al lato dove stanno le sue relazioni
  Object.entries(groups).forEach(([k, list]) => {
    const sec = sectors[k] || sectors.tra; if (sec.L === 0) return;
    const mid = (sec.a0 + sec.a1) / 2;
    const pull = n => { const o = [...NB[n.id]].map(id => byN[id]).filter(m => m && m.s.macro !== k); if (!o.length) return 0; const x = d3.mean(o, m => m.x - C), y = d3.mean(o, m => m.y - C); let d = Math.atan2(y, x) - mid; d = Math.atan2(Math.sin(d), Math.cos(d)); return d; };
    const key = new Map(list.map(n => [n, pull(n)]));
    list.sort((a, b) => key.get(a) - key.get(b));
    place(list, sec);
  });

  const g = svg.append("g");
  const gRing = g.append("g"), gL = g.append("g"), gN = g.append("g"), gLab = g.append("g");
  const ringR = [band[0][1] + 2, (band[1][1] + band[2][0]) / 2, (band[2][1] + band[3][0]) / 2, band[3][1] + 14];
  gRing.selectAll("circle").data(ringR.slice().reverse()).join("circle").attr("class", (d, i) => "ring r" + i).attr("cx", C).attr("cy", C).attr("r", d => d);
  const arcP = r => `M${C - r},${C} A${r},${r} 0 0 1 ${C + r},${C}`;
  const defs = svg.append("defs");
  ringR.forEach((r, i) => defs.append("path").attr("id", "ringp" + i).attr("d", arcP(r - 5)));
  gRing.selectAll("text").data(LIVELLI.slice(0, 4)).join("text").attr("class", "ringlbl").attr("dy", "0.35em")
    .append("textPath").attr("href", (d, i) => "#ringp" + i).attr("startOffset", "50%").attr("text-anchor", "middle").text(d => d.n.toUpperCase());
  // nomi delle macro-aree sul bordo esterno del loro settore
  const labs = Object.entries(sectors).filter(([k]) => groups[k]).map(([k, sec]) => {
    const m = macroOf(k), r = band[sec.L][1] + (sec.L === 3 ? 26 : 11);
    let a0 = sec.a0, a1 = sec.a1;
    if (sec.L === 0) { a0 = Math.PI * .1; a1 = Math.PI * .9; }          // la persona: in basso nel disco
    const mid = (a0 + a1) / 2, low = Math.sin(mid) > .05;
    const P = t => `${C + Math.cos(t) * r},${C + Math.sin(t) * r}`;
    const big = a1 - a0 > Math.PI ? 1 : 0;
    const d = low ? `M${P(a1)} A${r},${r} 0 ${big} 0 ${P(a0)}` : `M${P(a0)} A${r},${r} 0 ${big} 1 ${P(a1)}`;
    return {m, d, id:"macp-" + k, arc:{r:band[sec.L][1] + (sec.L === 3 ? 6 : 3), a0:sec.a0, a1:sec.a1}};
  });
  labs.forEach(l => defs.append("path").attr("id", l.id).attr("d", l.d));
  gRing.selectAll("path.secarc").data(labs.filter(l => l.arc.a1 - l.arc.a0 < 6)).join("path").attr("class", "secarc").style("stroke", d => mcol(d.m.k))
    .attr("d", d => d3.arc()({innerRadius:d.arc.r - 1.5, outerRadius:d.arc.r + 1.5, startAngle:d.arc.a0 + Math.PI / 2, endAngle:d.arc.a1 + Math.PI / 2})).attr("transform", `translate(${C},${C})`).style("fill", d => mcol(d.m.k));
  const macLbl = gLab.selectAll("text").data(labs).join("text").attr("class", "maclbl").attr("dy", "0.35em").style("fill", d => mcol(d.m.k))
    .append("textPath").attr("href", d => "#" + d.id).attr("startOffset", "50%").attr("text-anchor", "middle").text(d => d.m.n);

  links.forEach(l => { l.source = byN[l.source]; l.target = byN[l.target]; });
  const path = l => { const mx = (l.source.x + l.target.x) / 2, my = (l.source.y + l.target.y) / 2, f = .5; return `M${l.source.x},${l.source.y} Q${C + (mx - C) * f},${C + (my - C) * f} ${l.target.x},${l.target.y}`; };
  const L = gL.selectAll("path").data(links).join("path")
    .attr("class", l => "rl " + (l.kind === "d" ? "rd" : "rt") + (isNat(l.source.s) || isNat(l.target.s) ? " rn" : ""))
    .style("stroke", l => l.kind === "d" ? null : mcol(l.source.s.macro))
    .style("stroke-width", l => l.kind === "d" ? 1.2 : .5 + l.w * .3)
    .attr("d", path);
  const N = gN.selectAll("g").data(nodes, d => d.id).join("g").attr("class", d => "nd" + (isNat(d.s) ? " nat" : "")).attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", d => `${d.s.titolo}, ${d.s.autori}`).attr("transform", d => `translate(${d.x},${d.y})`);
  N.append("circle").attr("class", "ndc").attr("r", R).style("fill", d => mcol(d.s.macro));
  N.filter(d => d.s.tipo === "caso").append("path").attr("class", "ndcase").attr("d", d => d3.symbol().type(d3.symbolTriangle).size(R(d) * R(d) * 1.1)());
  N.append("title").text(d => `${d.s.titolo} · ${d.s.autori}${d.s.anno ? ", " + d.s.anno : ""}`);
  // etichette verso l'esterno: a destra del punto nella metà destra, a sinistra nella metà sinistra
  const side = d => (d.x >= C ? 1 : -1);
  const lbl = N.append("text").attr("class", "ndl").attr("dy", "0.35em").attr("text-anchor", d => side(d) > 0 ? "start" : "end").text(d => label(d.s));
  ECO.N = N; ECO.L = L;

  const order = nodes.slice().sort((a, b) => NB[b.id].size - NB[a.id].size);
  const refresh = k => {
    ECO.k = k;
    const f = ECO.focus, nb = f && NB[f] ? NB[f] : null, fs = 9.5 / k;
    lbl.style("font-size", fs + "px").attr("x", d => side(d) * (R(d) + 2.5));
    // le etichette non si sovrappongono: precedenza a chi ha più relazioni, al fuoco e ai vicini
    const placed = [], show = new Set(), cw = fs * .5;
    const want = order.slice().sort((a, b) => ((b.id === f) - (a.id === f)) || ((nb && nb.has(b.id)) - (nb && nb.has(a.id))));
    want.forEach(d => {
      const w = label(d.s).length * cw, h = fs * 1.15, x0 = side(d) > 0 ? d.x + R(d) + 2 : d.x - R(d) - 2 - w;
      const box = [x0, d.y - h / 2, x0 + w, d.y + h / 2];
      if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) return;
      placed.push(box); show.add(d.id);
    });
    lbl.style("display", d => show.has(d.id) ? null : "none");
    gLab.selectAll("text").style("font-size", (11 / k) + "px");
    gRing.selectAll("text").style("font-size", (8.5 / k) + "px");
  };
  ECO.refresh = refresh;
  const zoom = d3.zoom().scaleExtent([.2, 10]).on("zoom", e => { g.attr("transform", e.transform); refresh(e.transform.k); });
  svg.call(zoom).on("dblclick.zoom", null);
  const ease = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500;
  // la mappa prende il cerchio più grande che non tocca i riquadri sovrapposti:
  // gli angoli vuoti attorno al cerchio possono stare sotto il testo e i comandi
  ECO.fit = () => {
    const wr = wrap.getBoundingClientRect(), Wn = wr.width || W, Hn = wr.height || H;
    const els = [$("thesis"), $("ponte"), $("ecoStats"), ...document.querySelectorAll("#pHome .tools, #pHome .legend.ov")];
    const rects = els.filter(el => el && !el.hidden && el.getClientRects().length).map(el => { const r = el.getBoundingClientRect(); return [r.left - wr.left - 6, r.top - wr.top - 6, r.right - wr.left + 6, r.bottom - wr.top + 6]; }).filter(r => r[2] - r[0] > 12 && r[3] - r[1] > 12);
    const ok = (cx, cy, r) => rects.every(([x0, y0, x1, y1]) => { const dx = Math.max(x0 - cx, 0, cx - x1), dy = Math.max(y0 - cy, 0, cy - y1); return dx * dx + dy * dy >= r * r; });
    let best = null;
    for (let r = Math.min(Wn, Hn) / 2 - 4; r > 50 && !best; r -= 4) {
      for (let cy = r + 4; cy <= Hn - r - 4; cy += 6) for (let cx = r + 4; cx <= Wn - r - 4; cx += 6) {
        if (!ok(cx, cy, r)) continue;
        const d = Math.hypot(cx - Wn / 2, cy - Hn / 2);
        if (!best || d < best.d) best = {cx, cy, r, d};
      }
    }
    if (!best) best = {cx:Wn / 2, cy:Hn / 2, r:Math.min(Wn, Hn) / 2 - 8};
    const k = best.r / (RR + 34);
    svg.transition().duration(ease()).call(zoom.transform, d3.zoomIdentity.translate(best.cx - k * C, best.cy - k * C).scale(k));
  };
  const hl = id => {
    svg.classed("dim", !!id);
    const grp = groupOf(id), set = grp ? new Set(grp) : null;
    N.classed("hl", d => !!id && (set ? set.has(d.id) : (d.id === id || NB[id].has(d.id))));
    L.classed("hot", l => !!id && (set ? set.has(l.source.id) && set.has(l.target.id) : (l.source.id === id || l.target.id === id)));
  };
  ECO.hl = hl;
  N.on("mouseenter", (e, d) => hl(d.id)).on("mouseleave", () => hl(ECO.focus))
   .on("click", (e, d) => { e.stopPropagation(); focusEco(d.id); })
   .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focusEco(d.id); } });
  svg.on("click", () => focusEco(null));
  svg.call(zoom.transform, d3.zoomIdentity);
  ECO.fit();
  refresh(ECO.k);
  svg.classed("no-decl", !ECO.decl).classed("no-temi", !ECO.temi).classed("natmode", ECO.nat);
  applyEcoSearch();
  if (ECO.focus && !NB[ECO.focus] && !/^[tmpb]:/.test(String(ECO.focus))) ECO.focus = null;
  focusEco(ECO.focus);
}

// gruppi: micro-tema (t:), macro-area (m:), tema classico (p:)
function groupOf(id){
  if (!id || !/^[tmpb]:/.test(id)) return null;
  const k = id.slice(2);
  if (id[0] === "b") return (typeof BRIEF !== "undefined" && BRIEF.hl ? BRIEF.hl : []).filter(i => byId[i]);
  if (id[0] === "t") return TOPICS.get(k) || [];
  if (id[0] === "m") return SCHEDE.filter(s => s.macro === k).map(s => s.id);
  return schedeDelTema(k).map(s => s.id);
}
function focusEco(id){
  if (!id && typeof TEMA !== "undefined" && TEMA.k) id = "p:" + TEMA.k;
  ECO.focus = id;
  if (!ECO.N) return;
  ECO.N.classed("focus", d => d.id === id);
  ECO.hl(id); ECO.refresh(ECO.k);
  const box = $("ecoInfo");
  box.hidden = !id || /^[pb]:/.test(id);
  if (!id || /^[pb]:/.test(id)) { box.innerHTML = ""; return; }
  if (id.startsWith("m:")) {
    const k = id.slice(2), isM = true, ids = groupOf(id).sort((a, b) => byId[a].macro.localeCompare(byId[b].macro) || byId[a].anno - byId[b].anno);
    const nm = macroOf(k).n, ds = macroOf(k).d;
    const nat = ids.filter(i => isNat(byId[i])).length;
    box.innerHTML = `<div class="ihead"><span class="eyebrow">${isM ? "Macro-area · " + esc(LIVELLI[Math.max(0, LIVELLI.findIndex(l => l.m.includes(k)))].n) : "Percorso"}</span><button class="linkbtn" id="ecoClose">Chiudi ✕</button></div><h3>${isM ? `<span class="dot" style="background:${mcol(k)}"></span> ` : ""}${esc(nm)}</h3>
      <p>${esc(ds)}</p><p class="ra">${ids.length} schede${nat ? `, di cui ${nat} dalla natura` : ""}</p>
      <div class="links">${ids.map(i => `<button class="linkbtn" data-eco="${esc(i)}"><span class="dot${isNat(byId[i]) ? " natdot" : ""}" style="background:${mcol(byId[i].macro)}"></span>${esc(label(byId[i]))}</button>`).join("")}</div>
      ${temaBtns(temiDiGruppo(ids))}
      <div class="actions"><button class="btn ghost" id="ecoFilter">Leggi le ${ids.length} schede nell'archivio →</button></div>`;
    $("ecoFilter").onclick = () => apriArchivio(isM ? {macro:k} : {path:k});
  } else if (id.startsWith("t:")) {
    const t = id.slice(2), ids = TOPICS.get(t) || [];
    box.innerHTML = `<div class="ihead"><span class="eyebrow">Micro-tema</span><button class="linkbtn" id="ecoClose">Chiudi ✕</button></div><h3>${esc(t)}</h3>
      <p>${ids.length} schede lo trattano, evidenziate nella mappa.</p>
      <div class="links">${ids.map(i => `<button class="linkbtn" data-eco="${esc(i)}"><span class="dot" style="background:${mcol(byId[i].macro)}"></span>${esc(label(byId[i]))}</button>`).join("")}</div>
      ${temaBtns(TEMI.filter(x => x.mt.includes(t)))}
      <div class="actions"><button class="btn ghost" id="ecoFilter">Filtra l'archivio</button></div>`;
    $("ecoFilter").onclick = () => apriArchivio({topics:[t]});
  } else {
    const s = byId[id]; if (!s) return;
    const sin = s.sinossi;
    const rel = ECO.L.data().filter(l => l.source.id === id || l.target.id === id).map(l => ({o:l.source.id === id ? l.target.id : l.source.id, l})).sort((a, b) => b.l.w - a.l.w);
    box.innerHTML = `<div class="ihead"><span class="eyebrow" style="display:inline-flex;gap:6px;align-items:center"><span class="dot" style="background:${mcol(s.macro)}"></span>${esc(macroOf(s.macro).n)}${isNat(s) ? " · natura" : ""}</span><button class="linkbtn" id="ecoClose">Chiudi ✕</button></div>
      <h3>${esc(s.titolo)}</h3><p class="ra">${esc(s.autori)}${s.anno ? " · " + s.anno : ""}</p><p>${esc(sin)}</p>${canEdit && s.perche ? `<div class="iperche"><span class="ctl-label">Perché ci interessa</span><p>${esc(s.perche)}</p></div>` : ""}
      ${rel.length ? `<div><span class="ctl-label">Relazioni</span><ul class="rels">${rel.slice(0, 7).map(({o, l}) => `<li><button class="linkbtn" data-eco="${esc(o)}"><span class="dot" style="background:${mcol(byId[o].macro)}"></span>${esc(label(byId[o]))}</button> <small>${l.kind === "d" ? "citazione diretta" : "stessi temi: " + esc(l.temi.join(", "))}</small></li>`).join("")}</ul></div>` : ""}
      <div class="cloud">${s.microtemi.map(t => `<button class="topicbtn" data-eco="t:${esc(t)}">${esc(t)}</button>`).join("")}</div>
      ${temaBtns(temiDi(id))}
      <div class="actions"><button class="btn" id="ecoOpen">Apri la scheda</button>${s.authors && s.authors[0] ? `<a class="btn ghost" href="#autore-${encodeURIComponent(s.authors[0])}">Autore</a>` : ""}</div>`;
    $("ecoOpen").onclick = () => go("scheda-" + id);
  }
  $("ecoClose").onclick = () => focusEco(null);
  wireTemaBtns(box);
  box.querySelectorAll("[data-eco]").forEach(b => b.onclick = ev => { ev.stopPropagation(); focusEco(b.dataset.eco); });
}

function applyEcoSearch(){
  const raw = $("ecoQ").value, m = matcher(raw);
  renderSug(m);
  if (!ECO.N) return;
  ECO.svg.classed("searching", !!m);
  ECO.N.classed("match", d => !!m && m(hay(d.s)));
}
// suggerimenti mentre si scrive: macro-aree, percorsi, micro-temi, autori
function renderSug(m){
  const box = $("ecoSug");
  if (!m) { box.hidden = true; box.innerHTML = ""; return; }
  const hits = SCHEDE.filter(s => m(hay(s))).length;
  const mac = MACRO.filter(x => m(fold(x.n + " " + x.d)));
  const per = TEMI.filter(t => m(fold(t.n + " " + t.d + " " + t.mt.join(" "))));
  const tem = [...TOPICS.entries()].filter(([t]) => m(fold(t))).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
  const aut = [...AUT.values()].filter(a => fold(a.nome).includes(m.q)).slice(0, 4);
  const row = (h, items) => items.length ? `<div class="sg"><span class="ctl-label">${h}</span>${items.join("")}</div>` : "";
  box.innerHTML = `<p class="sgn">${hits ? `${hits} schede accese nella mappa` : "Nessuna scheda contiene questa parola"}</p>` +
    row("Macro-aree", mac.map(x => `<button class="sgb" data-g="m:${x.k}"><span class="dot" style="background:${mcol(x.k)}"></span>${esc(x.n)} · ${SCHEDE.filter(s => s.macro === x.k).length}</button>`)) +
    row("Temi", per.map(t => `<button class="sgb" data-tema="${t.k}">${pontiDelTema(t.k).length ? '<span class="pdot"></span>' : ""}${esc(t.n)} · ${schedeDelTema(t.k).length}</button>`)) +
    row("Micro-temi", tem.map(([t, ids]) => `<button class="sgb" data-g="t:${esc(t)}">${esc(t)} · ${ids.length}</button>`)) +
    row("Autori", aut.map(a => `<a class="sgb" href="#autore-${encodeURIComponent(a.id)}">${esc(a.nome)}</a>`));
  box.hidden = false;
  box.querySelectorAll("[data-g]").forEach(b => b.onclick = ev => { ev.stopPropagation(); focusEco(b.dataset.g); box.hidden = true; });
  wireTemaBtns(box); box.querySelectorAll("[data-tema]").forEach(b => b.addEventListener("click", () => box.hidden = true));
}
$("ecoQ").addEventListener("input", applyEcoSearch);
$("ecoQ").addEventListener("focus", () => { if ($("ecoQ").value.trim()) renderSug(matcher($("ecoQ").value)); });
$("ecoQ").addEventListener("keydown", ev => { if (ev.key === "Escape") { $("ecoSug").hidden = true; } });
document.addEventListener("click", ev => { if (!ev.target.closest(".sbox")) $("ecoSug").hidden = true; });
LIVELLI.forEach((l, i) => { const g = document.createElement("optgroup"); g.label = l.n; TEMI.filter(t => t.liv === i).forEach(t => { const o = document.createElement("option"); o.value = t.k; o.textContent = t.n; g.appendChild(o); }); $("pathSel").appendChild(g); $("ctxSel").appendChild(g.cloneNode(true)); });
$("pathSel").onchange = ev => openTema(ev.target.value || null);
$("ctxSel").onchange = ev => openTema(ev.target.value || null);
LIVELLI.forEach((l, i) => { const g = document.createElement("optgroup"); g.label = l.n; TEMI.filter(t => t.liv === i).forEach(t => { const o = document.createElement("option"); o.value = t.k; o.textContent = t.n; g.appendChild(o); }); $("ctxArch").appendChild(g); });
$("ctxArch").onchange = ev => { state.path = ev.target.value || null; state.shown = 60; update(); };
if ($("eFit")) $("eFit").onclick = () => ECO.fit && ECO.fit();
if ($("eD")) $("eD").onclick = ev => { ECO.decl = !ECO.decl; ev.currentTarget.setAttribute("aria-pressed", ECO.decl); ECO.svg && ECO.svg.classed("no-decl", !ECO.decl); };
if ($("eT")) $("eT").onclick = ev => { ECO.temi = !ECO.temi; ev.currentTarget.setAttribute("aria-pressed", ECO.temi); ECO.svg && ECO.svg.classed("no-temi", !ECO.temi); };
if ($("eN")) $("eN").onclick = ev => { ECO.nat = !ECO.nat; ev.currentTarget.setAttribute("aria-pressed", ECO.nat); ECO.svg && ECO.svg.classed("natmode", ECO.nat); };
function setThesis(min, salva){
  const t = $("thesis"), b = $("thesisToggle"); t.classList.toggle("min", min);
  b.textContent = min ? "Leggi tutto ▾" : "Riduci ▴"; b.title = min ? "Mostra il testo completo" : "Riduci al solo titolo"; b.setAttribute("aria-expanded", String(!min));
  if (salva) { try { localStorage.setItem("thesisMin", min ? "1" : "0"); } catch (e) {} }
  ECO.fit && ECO.fit();
}
$("thesisToggle").onclick = () => setThesis(!$("thesis").classList.contains("min"), true);
// la presentazione si può chiudere: i testi restano nella pagina Chi siamo
function chiudiThesis(salva){ $("thesis").hidden = true; if (salva) { try { localStorage.setItem("thesisChiusa", "1"); } catch (e) {} } ECO.fit && ECO.fit(); }
$("thesisClose").onclick = () => chiudiThesis(true);
(() => { let v = null; try { v = localStorage.getItem("thesisChiusa"); } catch (e) {} if (v === "1") chiudiThesis(false); })();
document.querySelector("#thesis h1").onclick = () => { if ($("thesis").classList.contains("min")) setThesis(false, true); };
(() => { let v = null; try { v = localStorage.getItem("thesisMin"); } catch (e) {} setThesis(v === "1" || (v === null && window.innerWidth < 560), false); })();
