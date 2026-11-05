
// ---------- il pannello del tema, più corto, e la pagina di ogni analogia in natura ----------
const primaFrase = t => { t = String(t || ""); const m = t.match(/^.+?[.!?](\s|$)/); return (m ? m[0] : t).trim(); };

renderTema = function(t){
  const pp = pontiDelTema(t.k), all = schedeDelTema(t.k);
  const deg = s => (ADJ[s.id] ? ADJ[s.id].size : 0) + s.microtemi.filter(x => t.mt.includes(x)).length * 2;
  const persone = all.filter(s => !isNat(s)).sort((a, b) => deg(b) - deg(a));
  const natIds = [...new Set([...pp.flatMap(p => p.natura), ...all.filter(isNat).map(s => s.id)])].filter(i => byId[i]);
  const natura = natIds.map(i => byId[i]);
  const tagliato = persone.length > 10 || natura.length > 10;
  $("ponteEye").textContent = "Contesto · livello " + LIVELLI[t.liv].n.toLowerCase();
  $("ponteTema").textContent = t.n;
  $("ponteMacro").innerHTML = citaLinks(t.s || t.d, all.map(s => s.id));
  // i numeri prima del grafico, così si sa che cosa si sta guardando
  $("ponteCap").innerHTML = `<span class="pstat2"><b>${persone.length}</b> studi su persone, organizzazioni e lavoro · <b class="natc">${natura.length}</b> evidenze dalla natura</span>
    <span class="pcap2">Al centro il tema. A sinistra gli studi su persone e organizzazioni, a destra i fenomeni naturali che mostrano lo stesso meccanismo.${tagliato ? " Il grafico mostra i dieci più collegati per parte: l'elenco completo è nell'archivio." : ""} ${window.matchMedia("(max-width:760px)").matches ? "Tocca un nome per aprire la scheda." : "Passa sopra un nome per vederlo sulla mappa, cliccalo per aprire la scheda."}</span>`;
  drawRete(t, persone, natura);
  $("ponteTesto").innerHTML = `
    ${canEdit && t.q ? `<div class="tq"><span class="ctl-label">La domanda da cui partire · area di lavoro</span><p>«${esc(t.q)}»</p><span class="tqh">È la prima domanda da porre in azienda per capire se il problema è questo: chiede di raccontare che cosa accade davvero, prima di cercare soluzioni.</span></div>` : ""}
    ${pp.length ? `<h4 class="ph">Le analogie in natura su questo tema</h4><div class="pcards">${pp.map(p => `<a class="pcard" href="#analogia-${encodeURIComponent(p.k)}"><b>${esc(p.tema)}</b><span>${esc(primaFrase(p.meccanismo))}</span><span class="pgo">Apri l'analogia →</span></a>`).join("")}</div>`
      : `<p class="pgap">Per questo tema l'archivio non ha ancora un'analogia in natura documentata. Non è un difetto: non tutti i temi ne hanno una, e il metodo non ne inventa.</p>`}
    <div class="actions"><button class="btn" id="temaList">Leggi le ${all.length} schede nell'archivio →</button></div>
    <p class="phelp">Nell'archivio le trovi divise in due gruppi: gli studi su persone, organizzazioni e lavoro, e le evidenze dalla natura.</p>`;
  $("temaList").onclick = () => apriArchivio({path:t.k});
};

function schedaCard(s){
  const ext = s.url || (s.doi ? "https://doi.org/" + s.doi : "");
  return `<li class="ancard"><span class="dot${isNat(s) ? " natdot" : ""}" style="background:${mcol(s.macro)}"></span><div><a href="#scheda-${encodeURIComponent(s.id)}"><b>${esc(label(s))}${s.anno ? ", " + s.anno : ""}</b> · ${esc(s.titolo)}</a>${s.fonte ? `<span class="rmeta">${esc(s.fonte)}</span>` : ""}${ext ? `<a class="pext" href="${esc(ext)}" target="_blank" rel="noopener">fonte ↗</a>` : ""}</div></li>`;
}
function renderAnalogia(k){
  const box = $("pAnalogia"), p = ponteOf(k);
  if (!p) { box.innerHTML = `<a class="back" href="#">← La mappa</a><p class="empty">${PONTI.length ? "Questa analogia non c'è più." : "Carico l'analogia…"}</p>`; return; }
  const tema = p.temi.map(temaOf).filter(Boolean), nat = p.natura.map(i => byId[i]).filter(Boolean), per = p.persone.map(i => byId[i]).filter(Boolean);
  const ids = [...p.natura, ...p.persone], lv = levaOf(p.leva);
  box.innerHTML = `<a class="back" href="${tema[0] ? "#tema-" + encodeURIComponent(tema[0].k) : "#"}">← ${tema[0] ? "Il tema «" + esc(tema[0].n) + "» sulla mappa" : "La mappa"}</a>
    <header class="anhead"><p class="eyebrow">Analogia in natura${lv ? " · leva " + esc(lv.n.toLowerCase()) : ""}</p><h2>${esc(p.tema)}</h2>
      ${canEdit && p.domanda ? `<div class="tq"><span class="ctl-label">La domanda da cui partire · area di lavoro</span><p>«${esc(p.domanda)}»</p><span class="tqh">Si pone al gruppo per aprire il tema: invita a descrivere che cosa accade davvero in azienda, prima di cercare soluzioni. L'analogia arriva dopo, per far vedere il meccanismo.</span></div>` : ""}</header>
    <div class="angrid">
      <section class="ansec nat"><h3>Che cosa succede in natura</h3><p>${citaLinks(p.meccanismo, ids)}</p></section>
      <section class="ansec"><h3>Che cosa dice la ricerca sulle persone</h3><p>${citaLinks(p.ricerca, ids)}</p></section>
      ${canEdit && p.strumento ? `<section class="ansec"><h3>Come si usa in azienda · area di lavoro</h3><p>${citaLinks(p.strumento, ids)}</p></section>` : ""}
      <section class="ansec lim"><h3>Dove l'analogia smette di valere</h3><p>${citaLinks(p.limite, ids)}</p></section>
    </div>
    <div class="anrefs">
      <section><h3 class="natc">Le evidenze dalla natura · ${nat.length}</h3><ul class="anlist">${nat.map(schedaCard).join("")}</ul></section>
      <section><h3>Gli studi su persone, organizzazioni e lavoro · ${per.length}</h3><ul class="anlist">${per.map(schedaCard).join("")}</ul></section>
    </div>
    ${tema.length ? `<p class="antemi"><span class="ctl-label">Temi in cui si usa</span>${tema.map(t => `<a class="chip" href="#tema-${encodeURIComponent(t.k)}">${esc(t.n)} →</a>`).join("")}</p>` : ""}`;
}
