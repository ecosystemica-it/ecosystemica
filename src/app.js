const AREE = [
  {k:"sis", c:"SIS", n:"Sistemi convergenti", d:"Teoria dei sistemi, cibernetica e complessità."},
  {k:"soc", c:"SOC", n:"Psicologia sociale", d:"Gruppi, identità, influenza, silenzio."},
  {k:"lav", c:"LAV", n:"Psicologia del lavoro", d:"Carichi, risorse, motivazione, logorio e recupero."},
  {k:"lea", c:"LEA", n:"Leadership e decisione", d:"Chi guida, chi decide, quando distribuire la guida."},
  {k:"cam", c:"CAM", n:"Cambiamento dei sistemi sociali", d:"Come un cambiamento attecchisce, si diffonde o viene rigettato."},
  {k:"evo", c:"EVO", n:"Evoluzione organizzativa", d:"Strutture, culture e apprendimento delle organizzazioni."},
  {k:"nat", c:"NAT", n:"Natura come evidenza", d:"Ecologia ed etologia che spiegano i concetti organizzativi."}
];
const DOMINI = [{k:"org", n:"Organizzazioni"}, {k:"nat", n:"Natura"}];
const MACRO = [
  {k:"ind", n:"Il singolo e il gruppo", d:"Identità, motivazione, aspettative, appartenenza."},
  {k:"com", n:"Comunicazione e voce", d:"Informazione, silenzio, fiducia, influenza."},
  {k:"lea", n:"Leadership e decisione", d:"Chi guida, chi decide, quando decentrare."},
  {k:"cul", n:"Cultura", d:"Valori dichiarati e cultura vissuta, riti, assunti."},
  {k:"cam", n:"Cambiamento", d:"Come un cambiamento attecchisce, si diffonde o viene rigettato."},
  {k:"tra", n:"Trasformazione e adattamento", d:"Organizzazione e ambiente esterno, tecnologia, crisi, resilienza."},
  {k:"app", n:"Apprendimento", d:"Come persone e organizzazioni imparano dall'esperienza."},
  {k:"ben", n:"Benessere e rigenerazione", d:"Carichi, logorio, recupero; ambienti che rigenerano: luce, suoni, odori, verde."},
];
MACRO.forEach(m => m.dom ||= "org");
const AREA2MACRO = {sis:"tra", soc:"ind", lav:"ben", lea:"lea", cam:"cam", evo:"cul", nat:"tra"};
const OLDMACRO = {nuo:"ben", amb:"ben", bio:"tra"};
const LIVELLI = [
  {n:"Persona", d:"Identità, motivazione, aspettative.", m:["ind"]},
  {n:"Gruppo", d:"Comunicazione, fiducia, guida, decisioni.", m:["com","lea"]},
  {n:"Organizzazione", d:"Cultura, apprendimento, cambiamento, benessere.", m:["cul","app","cam","ben"]},
  {n:"Ambiente", d:"Mercati, tecnologia, crisi: ciò a cui l'organizzazione deve adattarsi.", m:["tra"]}
];
const macroOf = k => MACRO.find(m => m.k === k) || MACRO[0];
const mcol = k => `var(--m-${k})`;
const LEVE = [
  {k:"rel", n:"Relazioni e informazione", q:"Chi parla con chi, e dove si ferma l'informazione?", legge:"Interrelazione", da:"Kelly: interdipendenza",
   cosa:"La qualità dei legami fra persone e reparti: quanto si parlano, si fidano, si dicono le cose scomode, e dove l'informazione si ferma prima di arrivare a chi decide.",
   segni:"Comunicazione solo scritta e sempre con qualcuno in copia; reparti che non si parlano; riunioni silenziose e corridoi pieni.",
   uno:"la fiducia che la persona sa costruire e il coraggio di parlare", sis:"la densità dei legami e i canali per cui le notizie risalgono", origine:"Viene dal principio di interdipendenza di James G. Kelly: in un sistema ogni parte dipende dalle altre, e ciò che cambia in un punto si propaga a tutto il resto.", fonti:"Kelly 1966; Edmondson 1999; Hirschman 1970"},
  {k:"car", n:"Energie e carichi", q:"Dove si accumula il lavoro, e dove resta ferma una risorsa?", legge:"Distribuzione delle risorse", da:"Kelly: ciclicità delle risorse",
   cosa:"Come si distribuiscono lavoro, tempo, informazioni e decisioni: dove si formano i colli di bottiglia e dove una risorsa resta inutilizzata.",
   segni:"Sempre le stesse persone sovraccariche; attese per un'approvazione; lavoro fatto due volte da chi non lo sa.",
   uno:"energie, tempo e confini del proprio ruolo", sis:"flussi di lavoro e decisioni senza sprechi né sovraccarichi", origine:"Viene dal principio di ciclicità delle risorse di Kelly: in un sistema le risorse circolano, e dove il giro si interrompe una parte si sovraccarica mentre un'altra resta ferma.", fonti:"Kelly 1966; Meadows 2008; Bakker e Demerouti 2007"},
  {k:"gui", n:"Guida e decisione", q:"Chi decide davvero cosa, e chi crede di decidere?", legge:"Guida distribuita", da:"aggiunta del metodo",
   cosa:"Chi guida e chi decide, e se la guida si sposta verso chi ha l'informazione, dentro una cornice in cui la responsabilità finale resta chiara.",
   segni:"Tutto passa da una persona, oppure nessuno decide; deleghe solo sulla carta; il capo parla per primo e tutti si allineano.",
   uno:"saper prendere la guida e saperla cedere", sis:"una guida che circola dentro confini scritti", origine:"È un'aggiunta del metodo ai principi di Kelly. Poggia sulla ricerca sulla guida condivisa: la guida passa a chi ha l'informazione, mentre la responsabilità finale resta di qualcuno.", fonti:"Pearce e Conger 2003; Bienefeld e Grote 2014; Simon 1947"},
  {k:"app", n:"Apprendimento e adattamento", q:"Che cosa succede qui quando cambia qualcosa fuori?", legge:"Adattamento ai cambiamenti esterni", da:"Kelly: adattamento",
   cosa:"La capacità di imparare da ciò che succede e di rispondere al mercato e alle crisi senza irrigidirsi e senza disgregarsi.",
   segni:"Gli stessi errori che ritornano; davanti a un cambiamento, rigidità o caos; «si è sempre fatto così».",
   uno:"la tenuta davanti all'imprevisto e la fiducia di farcela", sis:"la riflessione sugli errori e la velocità di risposta", origine:"Viene dal principio di adattamento di Kelly: un sistema dura se cambia insieme all'ambiente in cui vive.", fonti:"Kelly 1966; Argyris e Schön 1978; Lawrence e Lorsch 1967"},
  {k:"cul", n:"Cultura e senso", q:"Che cosa impara qui un nuovo arrivato nella prima settimana, senza che nessuno glielo dica?", legge:"Identità e cultura", da:"Kelly: successione",
   cosa:"Gli assunti che il gruppo ha imparato nel tempo e dà per scontati, i valori vissuti, i riti e le storie che dicono che cosa conta davvero.",
   segni:"Valori scritti sul sito e mai visti nei comportamenti; nuovi assunti che si adeguano in fretta o se ne vanno; fusioni che funzionano sulla carta e non nei corridoi.",
   uno:"il senso che la persona dà al lavoro e la coerenza fra i suoi valori e quelli vissuti", sis:"gli assunti condivisi e lo scarto fra ciò che si dichiara e ciò che si fa", origine:"Viene dal principio di successione di Kelly: ogni sistema ha una storia che orienta il suo presente, e in un'organizzazione quel deposito si chiama cultura.", fonti:"Kelly 1966; Schein 1985; Cameron e Quinn 1999"},
  {k:"rig", n:"Recupero e rigenerazione", q:"Che cosa consuma le persone, e che cosa le rimette in piedi?", legge:"Rigenerazione", da:"aggiunta del metodo",
   cosa:"Il bilancio fra ciò che consuma le persone e ciò che le rimette in piedi: pause, ritmi, spazi, contatto con la natura. Senza recupero nessun'altra leva si muove, perché un sistema esausto non impara e non si fida.",
   segni:"Stanchezza che non passa nel fine settimana; irritabilità e assenze; i migliori che se ne vanno; pause che non sono pause.",
   uno:"la prevenzione del logorio", sis:"la capacità di rinnovarsi invece di consumarsi", origine:"È un'aggiunta del metodo ai principi di Kelly. Poggia sulla ricerca sul recupero dalla fatica del lavoro e su quella sugli effetti rigenerativi degli ambienti naturali.", fonti:"Sonnentag e Fritz 2007; Kaplan e Kaplan 1989; Kellert e Calabrese 2015"}
];
const TIPI = ["articolo","libro","capitolo","rapporto","caso"];
const TIPO_N = {articolo:"articolo", libro:"libro", capitolo:"capitolo", rapporto:"rapporto", caso:"caso studio"};
const EVID = ["formale","funzionale","didattica","diretta"];
const EVCOL = {formale:"var(--accent)", funzionale:"var(--c-cam)", didattica:"var(--c-lav)", diretta:"var(--c-nat)"};
const col = k => `var(--c-${k})`;
const areaOf = k => AREE.find(a => a.k === k) || AREE[0];
const levaOf = k => LEVE.find(l => l.k === k);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $ = id => document.getElementById(id);
const slug = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "voce";
const safeUrl = u => /^https?:\/\//i.test(u || "") ? u : "";
const scholar = q => "https://scholar.google.com/scholar?q=" + encodeURIComponent(q);

let SCHEDE = [], byId = {}, TOPICS = new Map(), ADJ = {}, AUT = new Map(), AUTDOCS = {}, LASTRUN = null;
const state = {macro:null, disc:"", leva:null, q:"", qm:null, path:null, topics:[], view:"elenco", tipo:"", sort:"recenti", shown:60};
let db = null, sample = null, canEdit = false;

// ---------- dati ----------
function norm(d, id){
  const arr = v => Array.isArray(v) ? v.map(x => String(x)) : [];
  const motivi = d.motivi && typeof d.motivi === "object" && !Array.isArray(d.motivi) ? Object.fromEntries(Object.entries(d.motivi).map(([k, v]) => [k.toLowerCase(), String(v)])) : {};
  return {id, titolo:String(d.titolo || "Senza titolo"), autori:String(d.autori || ""), etichetta:String(d.etichetta || ""),
    anno:Number(d.anno) || 0, fonte:String(d.fonte || ""), tipo:TIPI.includes(d.tipo) ? d.tipo : "articolo",
    area:AREE.some(a => a.k === d.area) ? d.area : "sis", macro:MACRO.some(m => m.k === d.macro) ? d.macro : (OLDMACRO[d.macro] || AREA2MACRO[d.area] || "tra"), sinossi:String(d.sinossi || ""), inAzienda:String(d.inAzienda || ""), perche:String(d.perche || ""),
    microtemi:[...new Set(arr(d.microtemi).map(t => t.trim().toLowerCase()).filter(Boolean))], motivi,
    leve:arr(d.leve).filter(k => levaOf(k)), collegamenti:arr(d.collegamenti), evidenza:EVID.includes(d.evidenza) ? d.evidenza : "",
    verificare:!!d.verificare, stato:String(d.stato || ""), approvata:String(d.approvata || ""), richiesta:String(d.richiesta || ""), url:safeUrl(String(d.url || "")), doi:String(d.doi || ""), creata:String(d.creata || ""),
    settore:String(d.settore || ""), problema:String(d.problema || ""), intervento:String(d.intervento || ""), esito:String(d.esito || ""),
    composto:!!d.composto, autoriIds:arr(d.autoriIds), concetti:arr(d.concetti), prova:String(d.prova || ""), contesto:arr(d.contesto), organizzazioni:arr(d.organizzazioni)};
}
const splitAuthors = a => String(a).replace(/\(a cura di\)/gi, "").replace(/\s+(e|et)\s+(colleghi|al\.?)\s*$/i, "").split(/\s*,\s*|\s*;\s*|\s+e\s+|\s+&\s+/).map(x => x.trim()).filter(x => x && !/^(colleghi|et al\.?)$/i.test(x));
const label = s => s.etichetta || (splitAuthors(s.autori)[0] || "").split(" ").pop() || s.titolo;
const doiUrl = s => s.url || (s.doi ? "https://doi.org/" + s.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, "") : "");

function rebuild(){
  byId = Object.fromEntries(SCHEDE.map(s => [s.id, s]));
  TOPICS = new Map();
  SCHEDE.forEach(s => s.microtemi.forEach(t => { if (!TOPICS.has(t)) TOPICS.set(t, []); TOPICS.get(t).push(s.id); }));
  ADJ = {}; SCHEDE.forEach(s => ADJ[s.id] = new Set());
  SCHEDE.forEach(s => s.collegamenti.forEach(t => { if (byId[t] && t !== s.id) { ADJ[s.id].add(t); ADJ[t].add(s.id); } }));
  AREE.forEach(a => SCHEDE.filter(s => s.area === a.k).sort((x, y) => x.anno - y.anno).forEach((s, i) => s.code = `${a.c} ${String(i + 1).padStart(3, "0")}`));
  AUT = new Map();
  SCHEDE.forEach(s => {
    const names = splitAuthors(s.autori);
    s.authors = names.map((n, i) => { const id = s.autoriIds[i] || slug(n); if (!AUT.has(id)) AUT.set(id, {id, nome:n, schede:[]}); AUT.get(id).schede.push(s.id); return id; });
  });
  Object.values(AUTDOCS).forEach(d => { if (!AUT.has(d.id)) AUT.set(d.id, {id:d.id, nome:d.nome, schede:[]}); else if (d.nome) AUT.get(d.id).nome = d.nome; });
  $("n-schede").textContent = SCHEDE.length;
  $("n-temi").textContent = TOPICS.size;
  $("n-autori").textContent = AUT.size;
  renderLivelli();
  renderLeve();
  renderNatura();
}
function affini(s){
  const counts = {};
  s.microtemi.forEach(t => (TOPICS.get(t) || []).forEach(id => { if (id !== s.id) (counts[id] ||= []).push(t); }));
  return Object.entries(counts).sort((a, b) => b[1].length - a[1].length || byId[a[0]].anno - byId[b[0]].anno).slice(0, 8);
}

// ---------- instradamento ----------
const PAGES = ["pHome","pModello","pArchivio","pAutori","pScheda","pAutore","pBrief","pApprof","pAnalogia","pInterventi","pAzienda","pRedazione","pBiblio"];
function show(p){
  PAGES.forEach(x => $(x).hidden = x !== p);
  document.body.classList.toggle("home", p === "pHome");
  const nav = {pHome:"home", pModello:"modello", pArchivio:"archivio", pAutori:"autori", pScheda:"archivio", pAutore:"autori", pBrief:"brief", pApprof:"brief", pAnalogia:"home", pInterventi:"interventi", pAzienda:"interventi", pRedazione:"redazione", pBiblio:"biblioteca"}[p];
  document.querySelectorAll("[data-nav]").forEach(a => { if (a.dataset.nav === nav) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
}
// pagine riservate all'amministratore: per chiunque altro non esistono
const SOLO_ADMIN = ["brief", "approfondimento", "interventi", "redazione", "nuova"];
let ruoloNoto = false;
function route(){
  const h = decodeURIComponent((location.hash || "").slice(1));
  if ((SOLO_ADMIN.includes(h) || h.startsWith("azienda-")) && !canEdit) {
    if (ruoloNoto) { location.hash = ""; return; }
    show("pHome"); return;
  }
  if (h === "modello") { show("pModello"); window.scrollTo(0, 0); return; }
  if (h === "archivio") { show("pArchivio"); update(); window.scrollTo(0, 0); return; }
  if (h === "brief") {
    show("pBrief");
    // di ritorno da un approfondimento: si riparte dalla voce da cui si era usciti
    const k = typeof BRIEF !== "undefined" && BRIEF.scrollTo, el = k && document.getElementById("ak-" + k);
    if (el) { BRIEF.scrollTo = null; el.scrollIntoView({block:"center"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); } else window.scrollTo(0, 0);
    return;
  }
  if (h === "interventi") { show("pInterventi"); renderInterventi(); window.scrollTo(0, 0); return; }
  if (h.startsWith("azienda-")) { show("pAzienda"); renderAzienda(h.slice(8)); window.scrollTo(0, 0); return; }
  if (h === "approfondimento") { if (typeof APPROF === "undefined" || !APPROF.cur) { location.hash = "brief"; return; } show("pApprof"); renderApprof(); window.scrollTo(0, 0); return; }
  if (h === "redazione") { show("pRedazione"); if (typeof renderRedazione === "function") renderRedazione(); window.scrollTo(0, 0); return; }
  if (h === "biblioteca") { show("pBiblio"); if (typeof renderBiblio === "function") renderBiblio(); window.scrollTo(0, 0); return; }
  if (h === "autori") { show("pAutori"); renderAutori(); window.scrollTo(0, 0); return; }
  if (h === "nuova") { show("pScheda"); openForm(null); window.scrollTo(0, 0); return; }
  if (h.startsWith("scheda-")) { show("pScheda"); renderScheda(h.slice(7)); window.scrollTo(0, 0); return; }
  if (h.startsWith("autore-")) { show("pAutore"); renderAutore(h.slice(7)); window.scrollTo(0, 0); return; }
  if (h.startsWith("analogia-") || h.startsWith("ponte-")) { show("pAnalogia"); renderAnalogia(h.slice(h.indexOf("-") + 1)); window.scrollTo(0, 0); return; }
  if (h.startsWith("tema-")) { show("pHome"); if (ECO.pending) { ECO.pending = false; scheduleEco(); } openTema(h.slice(h.indexOf("-") + 1), h.startsWith("ponte-")); window.scrollTo(0, 0); return; }
  show("pHome");
  if (ECO.pending) { ECO.pending = false; scheduleEco(); }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
const go = h => { if (location.hash.slice(1) === h) route(); else location.hash = h; };

// ---------- archivio ----------
// dopo un clic sui filtri la pagina scende all'elenco delle schede corrispondenti
// ogni ingresso nell'archivio da un altro punto del sito parte da zero: niente filtri rimasti da prima
function azzeraFiltri(){
  Object.assign(state, {macro:null, disc:"", leva:null, q:"", qm:null, path:null, topics:[], tipo:"", lev:null, tag:null, shown:60});
  if ($("q")) $("q").value = ""; if ($("discSel")) $("discSel").value = ""; if ($("tipoSel")) $("tipoSel").value = "";
  if (typeof fillTagSelects === "function") fillTagSelects();
}
function apriArchivio(patch){
  azzeraFiltri(); Object.assign(state, patch || {});
  if (typeof fillTagSelects === "function") fillTagSelects();
  if ($("discSel")) $("discSel").value = state.disc || "";
  state.view = "elenco";
  if (location.hash.slice(1) === "archivio") setView("elenco"); else { setView("elenco"); go("archivio"); }
  setTimeout(vaiAiRisultati, 80);
}
function vaiAiRisultati(){ const el = $("status"); if (el && !$("pArchivio").hidden) el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start"}); }
// le macro-aree in colonna sotto i quattro livelli del modello, più la natura che li attraversa tutti
const areaChips = $("areaChips");
const allBtn = document.createElement("button");
allBtn.className = "chip"; allBtn.textContent = "Tutte"; allBtn.setAttribute("aria-pressed", "true");
allBtn.onclick = () => { state.macro = null; state.lev = null; if (state.disc === "nat") { state.disc = ""; $("discSel").value = ""; } state.shown = 60; update(); };
const col0 = document.createElement("div"); col0.className = "lvcol lvall"; col0.appendChild(allBtn); areaChips.appendChild(col0);
LIVELLI.forEach((l, i) => {
  const c = document.createElement("div"); c.className = "lvcol";
  c.innerHTML = `<button class="lvh" data-lev="${i}" title="Tutte le schede del livello ${esc(l.n.toLowerCase())}"><span class="lvn">${i + 1}</span>${esc(l.n)} <span class="cnt" data-cl="${i}"></span></button>`;
  c.querySelector(".lvh").onclick = () => { state.lev = state.lev === i ? null : i; state.macro = null; state.shown = 60; update(); vaiAiRisultati(); };
  l.m.forEach(k => {
    const a = macroOf(k), b = document.createElement("button");
    b.className = "chip"; b.dataset.area = a.k; b.title = a.d; b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span class="dot" style="background:${mcol(a.k)}"></span>${a.n}`;
    b.innerHTML += ` <span class="cnt" data-cm="${a.k}"></span>`;
    b.onclick = () => { state.macro = state.macro === a.k ? null : a.k; state.lev = null; state.shown = 60; update(); vaiAiRisultati(); };
    c.appendChild(b);
  });
  areaChips.appendChild(c);
});
{
  const c = document.createElement("div"); c.className = "lvcol lvnat";
  c.innerHTML = `<h4>In tutti i livelli</h4>`;
  const b = document.createElement("button");
  b.className = "chip nat"; b.id = "natArch"; b.title = "Solo le evidenze tratte dalla natura, in qualunque livello"; b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<span class="dot" style="background:var(--nat)"></span>Evidenze dalla natura`;
  b.innerHTML += ` <span class="cnt" data-cn="1"></span>`;
  b.onclick = () => { state.disc = state.disc === "nat" ? "" : "nat"; $("discSel").value = state.disc; state.shown = 60; update(); vaiAiRisultati(); };
  c.appendChild(b);
  areaChips.appendChild(c);
}
$("discSel").innerHTML = `<option value="">tutte</option>` + AREE.map(a => `<option value="${a.k}">${a.n}</option>`).join("");
$("discSel").onchange = ev => { state.disc = ev.target.value; state.shown = 60; update(); };
LEVE.forEach(l => {
  const b = document.createElement("button");
  b.className = "chip"; b.dataset.leva = l.k; b.textContent = l.n; if (canEdit && l.q) b.title = l.q; b.setAttribute("aria-pressed", "false");
  b.onclick = () => { state.leva = state.leva === l.k ? null : l.k; state.shown = 60; update(); vaiAiRisultati(); };
  $("levaChips").appendChild(b);
});
$("q").addEventListener("input", ev => { state.q = ev.target.value.trim(); state.qm = matcher(state.q); state.shown = 60; update(); });
$("tipoSel").onchange = ev => { state.tipo = ev.target.value; state.shown = 60; update(); };
$("sortSel").onchange = ev => { state.sort = ev.target.value; update(); };
$("moreBtn").onclick = () => { state.shown += 60; update(); };
function toggleTopic(t){
  const i = state.topics.indexOf(t);
  if (i >= 0) state.topics.splice(i, 1); else state.topics.push(t);
  if (state.view === "temi" && i < 0) setView("elenco");
  state.shown = 60;
  if (location.hash !== "#archivio") go("archivio"); else update();
}
const fold = t => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const hay = s => s._h ||= fold([s.titolo, s.autori, s.fonte, s.sinossi, s.inAzienda, s.perche, s.microtemi.join(" "), (s.concetti || []).join(" "), (s.organizzazioni || []).join(" "), (s.contesto || []).join(" "), s.prova || "", s.settore, s.problema, s.intervento, s.esito, macroOf(s.macro).n, macroOf(s.macro).d].join(" "));
// parole italiane e inglesi che la ricerca considera equivalenti
const ALIAS = [["trasform", "transform"], ["cambiam", "change"], ["apprend", "learning"], ["benesser", "well-being", "wellbeing"], ["natur", "nature", "natural"],
  ["comunica", "communicat"], ["decision", "decid"], ["fiduci", "trust"], ["organizza", "organiz"], ["lavor", "work"], ["grupp", "group", "team"],
  ["tecnolog", "technolog"], ["intelligenza artificiale", "artificial intelligence", "machine learning"], ["digital", "digitale"], ["ambient", "environment"],
  ["spazi", "space", "office", "ufficio"], ["guida", "lead"], ["recuper", "recover", "restorat"], ["voce", "voice"], ["silenzi", "silence"],
  ["motivaz", "motivat"], ["identit", "identity"], ["innovaz", "innovat"], ["resilien", "resilience"], ["biomim", "biomimicry"], ["biofil", "biophil"],
  ["stormo", "flock"], ["api", "honeybee", "honey bee", "bees"], ["formich", "ant colon"], ["cultur", "culture"], ["stress", "strain"],
  ["talent", "turnover", "uscita", "retention"], ["dimission", "uscita", "turnover"], ["fuoriusc", "uscita", "turnover"], ["licenzia", "downsizing", "ridimension", "crisi"],
  ["liquidit", "crisi", "incertezza"], ["chiusur", "crisi", "cambiamento"], ["fusion", "merger", "acquisizion"], ["famiglia", "familiar", "passaggio generazionale"],
  ["giovan", "generazion"], ["conflitt", "conflict"], ["riorganizz", "cambiamento", "struttura"]];
function matcher(q){
  q = fold(q).trim(); if (!q) return null;
  const vars = w => {
    const out = new Set([w.length > 6 ? w.slice(0, w.length - 3) : w]);
    ALIAS.forEach(g => { if (g.some(k => w.startsWith(k) || (w.length >= 4 && k.startsWith(w)))) g.forEach(k => out.add(k)); });
    return [...out];
  };
  const test = v => v.length <= 4 ? (re => h => re.test(h))(new RegExp("\\b" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))) : h => h.includes(v);
  const whole = vars(q).map(test), per = q.split(/\s+/).filter(w => w.length > 1).map(w => vars(w).map(test));
  const m = h => whole.some(t => t(h)) || (per.length > 1 && per.every(ts => ts.some(t => t(h))));
  m.q = q; return m;
}
// i temi classici del coaching e della consulenza organizzativa, per livello del modello
const TEMI = [
  {k:"motivazione", liv:0, n:"Motivazione e coinvolgimento", d:"Persone che fanno il minimo indispensabile, impegno che cala dopo i primi mesi, collaboratori capaci che non propongono nulla.", s:"Una persona può lavorare bene per ottenere un premio, per evitare una punizione o perché il lavoro le interessa, e le tre motivazioni non durano allo stesso modo: le prime due cessano quando cessano il premio o il controllo, la terza no. Deci e Ryan, con la teoria dell'autodeterminazione, hanno mostrato che la motivazione che nasce dall'interesse dipende da tre bisogni, l'autonomia, la competenza e la relazione con gli altri, e che premi e controlli troppo stretti possono ridurla, perché spostano il motivo del lavoro dall'interesse alla ricompensa. Bandura ha mostrato che la fiducia nelle proprie capacità cresce soprattutto con le esperienze di riuscita. Per questo, prima di cercare nuovi incentivi, il lavoro sulla motivazione verifica quale dei tre bisogni il lavoro attuale lascia scoperto.", q:"Che cosa ti fa venire voglia di lavorare bene, e che cosa te la toglie?",
    mt:["motivazione intrinseca", "autonomia", "competenza", "coinvolgimento", "autoefficacia", "fiducia in sé", "esperienze di successo", "relazione"]},
  {k:"cambiamento-personale", liv:0, n:"Crescita e cambiamento personale", d:"Obiettivi dichiarati e mai raggiunti, abitudini che restano nonostante i buoni propositi, decisioni rimandate.", s:"Molte persone vogliono sinceramente cambiare un comportamento e non ci riescono, anche quando sanno che cosa dovrebbero fare. Kegan e Lahey spiegano questo fallimento con quella che chiamano immunità al cambiamento: il comportamento vecchio serve a un impegno che la persona non dichiara, per esempio non deludere nessuno o non perdere il controllo, e finché quell'impegno resta nascosto ogni proposito si scontra con lui. Il coaching individuale porta alla luce l'impegno nascosto e la convinzione che lo sostiene, e la mette alla prova con piccoli esperimenti concreti invece di aggiungere altri propositi. Bandura ha mostrato che la fiducia nel poter cambiare cresce con le prime riuscite e osservando persone simili che ci sono riuscite.", q:"Che cosa proteggi, senza dirlo, continuando a fare come prima?",
    mt:["immunità al cambiamento", "impegni nascosti", "cambiamento personale", "assunzioni", "modellamento", "cambiamento di comportamento"]},
  {k:"stress", liv:0, n:"Stress, burnout ed energia", d:"Stanchezza che non passa nel fine settimana, assenze in aumento, cinismo verso il lavoro, persone competenti che rendono sempre meno.", s:"Lo stress da lavoro diventa dannoso quando, per lungo tempo, le richieste superano il margine di controllo e le risorse di chi lavora: è il modello di Karasek, ripreso e ampliato da Bakker e Demerouti. Se a questa condizione non segue un recupero sufficiente, si arriva al burnout, che Maslach descrive con tre segni: esaurimento delle energie, distacco cinico dal lavoro e sensazione di non essere più efficaci. Sonnentag e Fritz hanno mostrato che il recupero richiede soprattutto distacco psicologico, cioè smettere di pensare al lavoro, e le ricerche di Rachel e Stephen Kaplan indicano che gli ambienti naturali favoriscono il recupero dell'attenzione. Il metodo interviene quindi su due fronti: riequilibra richieste e risorse e crea condizioni reali di recupero.", q:"Dove e quando recuperi davvero, in una settimana di lavoro?",
    mt:["burnout", "esaurimento", "cinismo", "stress lavorativo", "recupero", "distacco psicologico", "rilassamento", "recupero dallo stress", "recupero dell'attenzione", "fatica mentale", "domanda-controllo", "richieste-risorse", "pause rigenerative", "micro-pause", "ruminazione"]},
  {k:"leadership", liv:1, n:"Leadership e stile di guida", d:"Responsabili che controllano ogni dettaglio oppure non sono mai presenti, nuovi capi lasciati senza preparazione, collaboratori che non crescono.", s:"Il comportamento di un responsabile determina in gran parte ciò che le persone fanno quando lui non è presente, perché insegna che cosa conta davvero e che cosa viene premiato. Bass distingue la guida transazionale, che ottiene prestazioni scambiando premi e correzioni, da quella trasformazionale, che dà un senso al lavoro e sviluppa i collaboratori, e la ricerca successiva lega la seconda a risultati migliori. Heifetz separa i problemi tecnici, che un esperto può risolvere, da quelli adattivi, che richiedono alle persone di cambiare abitudini e priorità e che nessun capo può risolvere al posto loro. L'idea del capo dominante modellata sul lupo alfa nasce da osservazioni su lupi in cattività, che lo stesso Mech ha poi corretto: in natura il branco è una famiglia guidata dai genitori.", q:"Che cosa fanno le tue persone quando non ci sei?",
    mt:["stile di guida", "leadership trasformazionale", "leadership transazionale", "leadership adattiva", "ispirazione", "comportamento del capo", "dominanza", "sviluppo dei collaboratori", "sfide adattive", "problemi tecnici"]},
  {k:"decisioni", liv:1, n:"Decisioni, delega e decentralizzazione", d:"Ogni decisione passa dal titolare, scelte rimandate, riunioni che si chiudono senza decidere nulla.", s:"Quando tutte le decisioni passano da una persona sola, l'azienda decide alla velocità di quella persona e sulla base delle sole informazioni che le arrivano. Ashby ha dimostrato che un sistema governa un ambiente vario solo se dispone di altrettanta varietà di risposte al suo interno, e questo significa portare alcune decisioni vicino a chi ha l'informazione. Pearce e Conger e Bienefeld e Grote mostrano che la guida condivisa migliora i risultati a una condizione: deve restare chiaro chi risponde in ultima istanza. Janis ha descritto il pensiero di gruppo, che porta un gruppo coeso a decidere male quando l'accordo arriva prima delle valutazioni indipendenti. Seeley ha mostrato che le api scelgono il nuovo nido confrontando opzioni in parallelo e decidendo solo al raggiungimento di una soglia di consenso, senza che nessuna ape abbia il quadro completo.", q:"Quali decisioni prendi tu che potrebbe prendere chi è più vicino al problema?",
    mt:["decisione", "decisione collettiva", "decisione di gruppo", "delega", "decentralizzazione", "quando decentrare", "guida distribuita", "leadership condivisa", "responsabilità finale", "empowerment", "margine decisionale", "pensiero di gruppo", "razionalità limitata", "soglia di quorum", "coordinamento senza capo", "decisioni sbagliate"]},
  {k:"comunicazione", liv:1, n:"Comunicazione, feedback e voce", d:"Le notizie negative arrivano in ritardo alla direzione, le proposte dei collaboratori non vengono ascoltate, mail con molti destinatari in copia al posto di conversazioni.", s:"In molte aziende le notizie negative arrivano alla direzione quando ormai è tardi per intervenire, e le proposte dei collaboratori non arrivano affatto. Morrison e Milliken chiamano questo fenomeno silenzio organizzativo e mostrano che nasce dalle convinzioni dei dirigenti, per esempio che i dipendenti pensino solo al proprio interesse o che il dissenso vada evitato, più che dal carattere delle persone. Detert e Burris hanno trovato che i collaboratori parlano di più quando il responsabile è disponibile ad ascoltare e chi segnala un problema non viene penalizzato. Hirschman ha mostrato che, quando protestare non serve, alle persone resta solo la scelta di andarsene. Il lavoro sulla comunicazione individua dove l'informazione si ferma e cambia le occasioni e le regole con cui si parla, non soltanto il tono.", q:"Che cosa sanno le tue persone che tu non sai ancora?",
    mt:["voce", "silenzio organizzativo", "informazione che non risale", "porta aperta", "comunicazione", "informazione", "comunicazione in copia", "sapere tacito", "proposte di miglioramento", "ordine di parola", "risposta rapida"]},
  {k:"fiducia", liv:1, n:"Fiducia e sicurezza psicologica", d:"Nessuno ammette un errore, il disaccordo si esprime solo fuori dalle riunioni, si approva in riunione e si contesta dopo.", s:"In un gruppo dove ammettere un errore costa, gli errori vengono nascosti e quindi si ripetono, perché nessuno può imparare da ciò che non viene detto. Edmondson chiama sicurezza psicologica la convinzione condivisa che nel gruppo si possa parlare apertamente senza essere umiliati o puniti, e ha mostrato che i gruppi che la possiedono segnalano più errori e imparano di più. Asch ha dimostrato che la pressione di un gruppo compatto spinge molte persone a negare ciò che vedono, ma che basta un solo alleato perché la conformità diminuisca drasticamente. Rousseau ha mostrato che la fiducia verso l'azienda si incrina quando vengono violate promesse mai scritte ma date per certe, e si ricostruisce solo con impegni mantenuti nel tempo.", q:"Che cosa succede qui a chi dice ad alta voce che qualcosa non va?",
    mt:["fiducia", "sicurezza psicologica", "errori", "dissenso", "conformità", "pressione del gruppo", "alleato", "avvocato del diavolo", "violazione"]},
  {k:"conflitti", liv:1, n:"Conflitti e collaborazione fra reparti", d:"Reparti che non collaborano, responsabilità rimpallate fra uffici, commerciale e produzione in contrasto, sedi che si ignorano.", s:"Tajfel e Turner hanno mostrato che basta dividere le persone in due gruppi, anche con un criterio arbitrario, perché ciascuno cominci a favorire il proprio gruppo e a diffidare dell'altro, perché una parte della stima di sé dipende dai gruppi a cui si appartiene. Sherif, negli esperimenti con due gruppi di ragazzi messi in competizione, ottenne la riconciliazione solo proponendo obiettivi che nessun gruppo poteva raggiungere da solo, mentre il semplice contatto non era bastato. Ostrom ha documentato che le comunità gestiscono bene risorse condivise quando definiscono insieme le regole, controllano che vengano rispettate e applicano sanzioni graduali. Le stesse condizioni valgono per i reparti che si contendono budget, persone e priorità, e il lavoro parte da qui: dagli scambi reali fra gli uffici e da uno scopo che nessuno raggiunge da solo.", q:"Che cosa dovreste ottenere insieme che nessuno dei due reparti può ottenere da solo?",
    mt:["conflitto fra gruppi", "noi e loro", "identità sociale", "favoritismo", "obiettivi sovraordinati", "cooperazione", "competizione", "reciprocità", "scambi ripetuti", "condivisione delle risorse", "beni comuni", "regole condivise"]},
  {k:"team", liv:1, n:"Lavoro di squadra e coordinamento", d:"Gruppi di persone capaci che non lavorano come una squadra, informazioni perse nei passaggi di consegne.", s:"Un gruppo di persone capaci non è ancora una squadra: lo diventa quando le persone coordinano il proprio lavoro, si passano le informazioni senza perderle e imparano insieme dagli errori. Mintzberg ha mostrato che, quando il lavoro è incerto, il coordinamento avviene soprattutto per adattamento reciproco fra colleghi, perché le regole scritte non possono prevedere ogni situazione. Bienefeld e Grote hanno osservato che negli equipaggi che affrontano un'emergenza la guida passa da una persona all'altra senza che venga meno la responsabilità del comandante. Ballerini e colleghi hanno misurato che negli stormi di storni ogni uccello regola il volo su sei o sette vicini, e che questa regola mantiene compatti migliaia di individui anche quando lo stormo cambia forma e densità. Il lavoro con le squadre parte quindi dalla mappa di chi deve comunicare con chi.", q:"Quando qualcosa cambia all'improvviso, chi deve parlare con chi perché funzioni?",
    mt:["team", "coordinamento", "adattamento reciproco", "sistemi multi-team", "apprendimento di team", "apprendimento di gruppo", "intelligenza collettiva", "divisione del lavoro", "interazioni locali", "ruoli", "coesione"]},
  {k:"cultura", liv:2, n:"Cultura e valori aziendali", d:"Valori dichiarati che nessuno pratica, fusioni fra aziende con abitudini diverse, regole non scritte che contano più di quelle scritte.", s:"La cultura di un'azienda non coincide con i valori pubblicati sul sito: Schein la definisce come l'insieme degli assunti che un gruppo ha imparato risolvendo i propri problemi e che ormai dà per scontati. Si osserva negli artefatti, come gli spazi e i riti, e si dichiara nei valori, ma orienta i comportamenti attraverso gli assunti, ed è per questo che un documento di valori non basta a cambiarla. Argyris e Schön hanno descritto lo scarto fra la teoria che un'organizzazione dichiara e quella che applica davvero, e il lavoro sulla cultura comincia dal misurare quello scarto. Cameron e Quinn offrono uno strumento per descriverla lungo due assi, flessibilità o controllo e attenzione all'interno o all'esterno, e per confrontare la cultura attuale con quella desiderata.", q:"Che cosa impara qui un nuovo assunto nella prima settimana, senza che nessuno glielo dica?",
    mt:["cultura", "cultura organizzativa", "valori", "valori dichiarati", "assunti di base", "artefatti", "misura della cultura", "valori in competizione", "norme", "cambiamento culturale", "teoria dichiarata", "teoria in uso", "fusioni"]},
  {k:"cambiamento", liv:2, n:"Gestione del cambiamento", d:"Riorganizzazioni che non producono i risultati attesi, resistenze diffuse, novità approvate e mai applicate.", s:"Molti progetti di cambiamento falliscono non perché il progetto sia sbagliato, ma per il modo in cui vengono introdotti. Nel 1948 Coch e French mostrarono, in una fabbrica di abbigliamento americana, che i gruppi di operai coinvolti nel definire i nuovi metodi di lavoro raggiungevano la produttività precedente più in fretta e lasciavano l'azienda meno spesso dei gruppi a cui i metodi erano stati imposti. Lewin descrisse il cambiamento come un processo in tre fasi: rendere discutibili le abitudini esistenti, introdurre il nuovo comportamento e consolidarlo. Rogers ha mostrato che le innovazioni si diffondono attraverso le relazioni personali, a partire da pochi primi adottanti, e Moscovici che una minoranza coerente e costante può cambiare l'opinione della maggioranza. Per questo il metodo individua prima le persone che hanno già cambiato e fa passare il nuovo attraverso di loro.", q:"Chi in azienda ha già cambiato modo di lavorare senza che glielo chiedessero?",
    mt:["resistenza", "resistenza al cambiamento", "partecipazione", "scongelamento", "ricerca-azione", "diffusione delle innovazioni", "primi adottanti", "opinion leader", "diffusione per relazioni", "cambiamento", "influenza minoritaria", "adozione", "punti di leva"]},
  {k:"apprendimento", liv:2, n:"Apprendimento e sviluppo delle persone", d:"Formazione che non modifica il modo di lavorare, errori che si ripetono, competenze che escono dall'azienda con chi va in pensione.", s:"Un'organizzazione impara quando modifica il proprio modo di lavorare, non quando aumenta le ore di formazione. Argyris e Schön distinguono l'apprendimento a ciclo singolo, che corregge un errore lasciando intatte le regole che lo hanno prodotto, da quello a ciclo doppio, che rimette in discussione quelle regole, e descrivono le routine difensive con cui le persone evitano l'imbarazzo e così impediscono il secondo. March ha mostrato che un'organizzazione tende a preferire lo sfruttamento di ciò che sa già fare, perché dà risultati immediati, e così perde gradualmente la capacità di esplorare alternative. Il lavoro sull'apprendimento parte dagli errori che si ripetono e dal sapere che le persone portano via quando lasciano l'azienda.", q:"Qual è l'ultimo errore da cui l'azienda ha imparato davvero, e come ve ne siete accorti?",
    mt:["apprendimento organizzativo", "organizzazione che apprende", "doppio ciclo", "routine difensive", "modelli mentali", "livelli di apprendimento", "esplorazione", "sfruttamento", "retroazione", "visione condivisa"]},
  {k:"carichi", liv:2, n:"Carichi di lavoro, processi e priorità", d:"Picchi di lavoro sempre negli stessi reparti, straordinari diventati abituali, ritardi che nessuno prevede.", s:"Quando il lavoro si accumula sempre negli stessi punti, la causa raramente è la scarsa volontà di chi ci lavora: più spesso nessuno vede il flusso nel suo insieme e nessuno riceve in tempo il segnale che qualcosa si sta bloccando. Wiener e Meadows hanno mostrato che un sistema si regola solo se l'effetto di un'azione torna come informazione a chi può correggerla, e che i ritardi in questo ritorno producono oscillazioni e accumuli. Karasek ha mostrato che le persone sostengono carichi elevati senza ammalarsi solo se hanno controllo sul proprio lavoro. Seeley ha documentato che nell'alveare le bottinatrici regolano il proprio lavoro sul tempo che devono aspettare per scaricare il nettare: se l'attesa si allunga, richiamano altre api alla lavorazione con la danza del tremito, senza che nessuna conti le scorte. Il lavoro sui carichi rende visibili le attese e stabilisce insieme chi si sposta e quando.", q:"Dove si forma la coda, e chi se ne accorge per primo?",
    mt:["carico di lavoro", "colli di bottiglia", "flusso di lavoro", "costi nascosti", "turni", "controllo del tempo", "stock e flussi", "regolazione", "danza del tremito", "produttività", "regolazione distribuita"]},
  {k:"benessere-spazi", liv:2, n:"Benessere organizzativo e spazi di lavoro", d:"Clima di lavoro teso, valutazione dello stress lavoro-correlato da svolgere, uffici che affaticano.", s:"Il benessere organizzativo dipende dal clima, dal carico di lavoro, dalle relazioni e anche dal luogo fisico in cui si lavora. In Italia il Testo unico sulla sicurezza del lavoro obbliga le aziende a valutare lo stress lavoro-correlato, e Bakker e Demerouti mostrano che le condizioni dell'ambiente di lavoro sono fra le risorse che proteggono dall'esaurimento. La luce naturale, la vista sul verde, i suoni e i materiali naturali hanno effetti misurati su sonno, attenzione e stress: Ulrich osservò che i pazienti operati con la finestra verso gli alberi lasciavano l'ospedale prima e chiedevano meno analgesici, e Boubekri e colleghi hanno trovato che gli impiegati vicini alle finestre dormono più a lungo. Molti di questi studi hanno campioni piccoli, per questo il metodo misura ogni intervento sugli spazi prima e dopo averlo realizzato.", q:"Da quale postazione di questo ufficio si vede un albero?",
    mt:["benessere organizzativo", "benessere", "spazi di lavoro", "design biofilico", "luce naturale", "vista sul verde", "suoni naturali", "piante indoor", "odori e fitoncidi", "materiali naturali", "acqua", "ritmi circadiani", "clima", "rumore", "psicologia ambientale"]},
  {k:"retention", liv:2, n:"Appartenenza, turnover e retention", d:"Dimissioni nei primi mesi dall'assunzione, giovani che non restano, aspettative deluse da entrambe le parti.", s:"Molte dimissioni avvengono nei primi mesi, quando la persona scopre che il lavoro non corrisponde a ciò che le era stato fatto credere. Rousseau chiama contratto psicologico l'insieme delle promesse implicite che persona e azienda ritengono di essersi scambiate, e mostra che la violazione di queste promesse produce delusione e disimpegno quanto quella di un accordo scritto. Hirschman ha descritto le due reazioni possibili di chi è insoddisfatto, protestare o andarsene, e ha mostrato che la lealtà verso l'organizzazione tiene aperta la protesta solo finché protestare produce qualche effetto. Il lavoro sulla retention parte quindi dalle aspettative create al momento dell'assunzione e dal calcolo del costo reale di ogni dimissione.", q:"Che cosa vi aspettavate l'uno dall'altro quando questa persona è stata assunta?",
    mt:["turnover", "uscita", "lealtà", "contratto psicologico", "aspettative", "onboarding", "appartenenza"]},
  {k:"passaggio-generazionale", liv:2, n:"Passaggio generazionale e impresa familiare", d:"Il fondatore che non delega, figli e manager esterni in disaccordo, ruoli familiari e ruoli aziendali confusi.", s:"La grande maggioranza delle imprese italiane è a controllo familiare, e il passaggio dal fondatore alla generazione successiva è uno dei momenti più delicati della loro vita. Le difficoltà sono raramente tecniche: in famiglia valgono l'affetto e la parità fra figli, in azienda la competenza e la responsabilità, e quando le due logiche si confondono le decisioni si bloccano o diventano conflitti personali. Il fondatore detiene spesso, oltre alla proprietà, la rete di clienti e il sapere che nessuno ha messo per iscritto. L'archivio non contiene ancora studi su questo tema e li sta raccogliendo dalla ricerca sulle imprese familiari. Il metodo lo tratta come un cambiamento della guida e della cultura, con tempi lunghi e decisioni esplicitate per tempo.", q:"Quali decisioni prende oggi solo il fondatore, e chi le prenderà fra cinque anni?",
    mt:["passaggio generazionale", "impresa familiare", "successione familiare", "family business"]},
  {k:"diversita", liv:2, n:"Diversità, inclusione e generazioni", d:"Generazioni con attese diverse sul lavoro, persone escluse dalle decisioni, gruppi composti da profili tutti simili.", s:"I gruppi composti da persone diverse per età, formazione o provenienza possono decidere meglio, perché dispongono di più informazioni e punti di vista, ma non accade automaticamente. Le rassegne di van Knippenberg e Schippers mostrano che la diversità migliora i risultati quando le differenze vengono discusse ed elaborate, e li peggiora quando il gruppo si divide in sottogruppi che si percepiscono come estranei. Tajfel e Turner hanno spiegato perché questa divisione è così facile: basta una categoria qualsiasi perché nasca la logica del noi contro loro. Nelle aziende italiane il tema oggi più sentito è la convivenza fra generazioni con aspettative diverse sul lavoro, e l'archivio sta raccogliendo le ricerche per dire con precisione a quali condizioni la diversità aiuta.", q:"Chi in questa stanza non dice quello che pensa perché è diverso dagli altri?",
    mt:["diversità", "inclusione", "generazioni", "pregiudizi", "stereotipi", "equità"]},
  {k:"resilienza", liv:3, n:"Resilienza e gestione delle crisi", d:"Crisi che paralizzano l'attività, aziende efficienti ma vulnerabili, persone chiave che nessuno sa sostituire.", s:"Un'azienda organizzata per la massima efficienza tende a eliminare tutto ciò che in condizioni normali sembra superfluo: scorte di sicurezza, fornitori alternativi, persone in grado di sostituirsi a vicenda, tempo non assegnato. Quando un fornitore si ferma o una persona chiave se ne va, sono proprio quelle riserve a permettere di continuare a lavorare, e la loro assenza trasforma un imprevisto in un blocco. Holling ha distinto, negli ecosistemi, la stabilità, cioè la capacità di tornare in fretta all'equilibrio, dalla resilienza, cioè la capacità di assorbire un disturbo senza perdere le proprie funzioni, e ha mostrato che un sistema gestito solo per la resa massima diventa fragile. Ashby ha dimostrato che un sistema può governare un ambiente vario solo se dispone di altrettante risposte possibili, e Weick che nelle crisi la tenuta di un gruppo dipende dalla capacità di dare un senso comune a ciò che accade. Il lavoro sulla resilienza individua le funzioni che l'azienda non può perdere e conta quante alternative le proteggono.", q:"Se domani manca la persona chiave di questo processo, che cosa smette di funzionare?",
    mt:["resilienza", "crisi", "costruzione di senso", "incertezza", "organizzazioni ad alta affidabilità", "efficienza e fragilità", "disturbo", "stabilità", "segnali di declino", "turbolenza ambientale"]},
  {k:"innovazione", liv:3, n:"Innovazione e adattamento al mercato", d:"Mercato che cambia più velocemente dell'azienda, proposte nuove bloccate dalle procedure esistenti.", s:"Un'organizzazione è un sistema aperto, che sopravvive grazie agli scambi con il proprio ambiente, come hanno mostrato Bertalanffy e poi Katz e Kahn: quando il mercato cambia più in fretta di lei, i suoi prodotti e le sue procedure perdono valore anche se continuano a funzionare bene. Lawrence e Lorsch hanno dimostrato che non esiste una struttura migliore in assoluto e che le aziende più efficaci adattano il proprio grado di differenziazione e di integrazione all'incertezza dell'ambiente. March ha mostrato che chi investe solo nello sfruttamento di ciò che sa già fare ottiene risultati immediati ma perde la capacità di esplorare alternative, e che per innovare bisogna proteggere una quota di esplorazione. Benyus propone la biomimesi, cioè lo studio di soluzioni già sperimentate dai sistemi viventi, come fonte di innovazione.", q:"Quanta parte del vostro tempo è dedicata a cose che oggi non rendono ancora?",
    mt:["innovazione", "contingenza", "ambiente esterno", "incertezza ambientale", "complessità", "varietà necessaria", "sistema aperto", "adattamento", "biomimesi", "complessità ambientale"]},
  {k:"digitale", liv:3, n:"Trasformazione digitale e intelligenza artificiale", d:"Strumenti digitali acquistati e poco usati, timore di essere sostituiti, lavoro ibrido senza regole condivise.", s:"Gli strumenti digitali e l'intelligenza artificiale modificano prima i compiti e solo dopo i ruoli, e spesso vengono introdotti senza cambiare l'organizzazione del lavoro, con il risultato che i benefici attesi non arrivano. Trist e Bamforth mostrarono già negli anni Cinquanta, nelle miniere di carbone inglesi, che una nuova tecnologia introdotta senza riprogettare i gruppi di lavoro non produceva l'aumento di produttività atteso e faceva crescere assenze e conflitti. Le prime ricerche sul campo sull'intelligenza artificiale generativa, come quelle di Brynjolfsson e colleghi sull'assistenza clienti e di Dell'Acqua e colleghi sui consulenti, indicano che lo strumento aiuta molto i lavoratori meno esperti e nei compiti adatti, e può peggiorare i risultati nei compiti per cui non è adatto. L'archivio sta raccogliendo queste ricerche, e per ora le schede sul tema sono poche.", q:"Quale parte del lavoro di questa squadra cambierà per prima con l'intelligenza artificiale?",
    mt:["trasformazione digitale", "intelligenza artificiale", "automazione", "sociotecnico", "lavoro ibrido", "lavoro a distanza", "piattaforme"]}
];
const temaOf = k => TEMI.find(t => t.k === k);
const pontiDelTema = k => (typeof PONTI === "undefined" ? [] : PONTI).filter(p => p.temi.includes(k));
const inTema = (t, s) => t.mt.some(x => s.microtemi.includes(x)) || pontiDelTema(t.k).some(p => p.persone.includes(s.id) || p.natura.includes(s.id));
const schedeDelTema = k => { const t = temaOf(k); return t ? SCHEDE.filter(s => inTema(t, s)) : []; };
const temiDi = id => { const s = byId[id]; return s ? TEMI.filter(t => inTema(t, s)) : []; };
const matches = s => (!state.macro || s.macro === state.macro) && (state.lev == null || LIVELLI[state.lev].m.includes(s.macro)) && (!state.disc || s.area === state.disc) && (!state.leva || s.leve.includes(state.leva)) &&
  (!state.tipo || (state.tipo === "caso" ? s.tipo === "caso" : s.tipo !== "caso")) &&
  state.topics.every(t => s.microtemi.includes(t)) && (typeof tagMatch !== "function" || tagMatch(s)) && (!state.qm || state.qm(hay(s))) && (!state.path || !temaOf(state.path) || inTema(temaOf(state.path), s));
function setView(v){
  state.view = v;
  ["elenco","temi"].forEach(k => { $("v" + k[0].toUpperCase() + k.slice(1)).hidden = k !== v; $("t-" + k).setAttribute("aria-selected", k === v); });
  update();
}
["elenco","temi"].forEach(k => $("t-" + k).onclick = () => setView(k));

function renderResults(list){
  const box = $("results"); box.innerHTML = "";
  const sorters = {recenti:(a, b) => (b.creata || "").localeCompare(a.creata || "") || b.anno - a.anno, anno:(a, b) => a.anno - b.anno, titolo:(a, b) => a.titolo.localeCompare(b.titolo, "it")};
  list.sort(sorters[state.sort]);
  // due gruppi distinti: prima gli studi su persone e organizzazioni, poi le evidenze dalla natura
  const org = list.filter(s => !isNat(s)), nat = list.filter(isNat), due = org.length && nat.length;
  const testa = (txt, cls) => { const h = document.createElement("h3"); h.className = "rgroup " + cls; h.textContent = txt; box.appendChild(h); };
  const gruppi = due ? [[org, "Studi su persone, organizzazioni e lavoro · " + org.length, "org"], [nat, "Evidenze dalla natura · " + nat.length, "nat"]] : [[list, "", ""]];
  gruppi.forEach(([g, titolo, cls]) => { if (titolo) testa(titolo, cls); g.slice(0, state.shown).forEach(s => {
    const a = document.createElement("a");
    a.className = "row"; a.href = "#scheda-" + encodeURIComponent(s.id); a.style.textDecoration = "none";
    a.innerHTML = `<span class="dot" style="background:${mcol(s.macro)}"></span>
      <span><span class="rt">${s.tipo === "caso" ? "Caso · " : ""}${esc(s.titolo)}${s.verificare ? " *" : ""}</span><span class="ra" style="display:block">${esc(s.autori)}</span>
      <span class="rtags">${s.microtemi.slice(0, 5).map(t => `<span class="tg">${esc(t)}</span>`).join("")}</span></span>
      <span class="ry">${s.anno || ""}</span>`;
    box.appendChild(a);
  }); });
  $("moreBtn").hidden = gruppi.every(([g]) => g.length <= state.shown);
}
function renderCloud(list){
  const counts = new Map();
  list.forEach(s => s.microtemi.forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
  const max = Math.max(1, ...counts.values());
  const box = $("cloud"); box.innerHTML = "";
  [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "it")).slice(0, 400).forEach(([t, n]) => {
    const b = document.createElement("button");
    b.className = "topicbtn"; b.setAttribute("aria-pressed", state.topics.includes(t));
    b.style.fontSize = (13 + 7 * (n - 1) / Math.max(1, max - 1)).toFixed(1) + "px";
    b.innerHTML = `${esc(t)} <small>${n}</small>`;
    b.onclick = () => toggleTopic(t);
    box.appendChild(b);
  });
}
function renderNear(list){
  const sel = $("selTopics"), near = $("near");
  sel.hidden = !state.topics.length; near.hidden = !state.topics.length || !list.length;
  sel.innerHTML = state.topics.length ? `<span class="ctl-label">Micro-temi scelti</span>` : "";
  state.topics.forEach(t => {
    const b = document.createElement("button"); b.className = "topicbtn"; b.setAttribute("aria-pressed", "true");
    b.innerHTML = `${esc(t)} <small>togli</small>`; b.onclick = () => toggleTopic(t); sel.appendChild(b);
  });
  if (!state.topics.length) return;
  const counts = new Map();
  list.forEach(s => s.microtemi.forEach(t => { if (!state.topics.includes(t)) counts.set(t, (counts.get(t) || 0) + 1); }));
  near.innerHTML = `<span class="ctl-label">Temi vicini</span>`;
  [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "it")).slice(0, 14).forEach(([t, n]) => {
    const b = document.createElement("button"); b.className = "topicbtn"; b.setAttribute("aria-pressed", "false");
    b.innerHTML = `${esc(t)} <small>${n}</small>`; b.onclick = () => toggleTopic(t); near.appendChild(b);
  });
}
function update(){
  allBtn.setAttribute("aria-pressed", state.macro ? "false" : "true");
  areaChips.querySelectorAll("[data-area]").forEach(b => b.setAttribute("aria-pressed", b.dataset.area === state.macro));
  $("levaChips").querySelectorAll("[data-leva]").forEach(b => b.setAttribute("aria-pressed", b.dataset.leva === state.leva));
  $("natArch").setAttribute("aria-pressed", state.disc === "nat");
  allBtn.setAttribute("aria-pressed", !state.macro && state.lev == null && state.disc !== "nat");
  areaChips.querySelectorAll("[data-lev]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.lev === state.lev)));
  areaChips.querySelectorAll("[data-cm]").forEach(x => x.textContent = SCHEDE.filter(s => s.macro === x.dataset.cm).length);
  areaChips.querySelectorAll("[data-cl]").forEach(x => x.textContent = SCHEDE.filter(s => LIVELLI[+x.dataset.cl].m.includes(s.macro)).length);
  areaChips.querySelectorAll("[data-cn]").forEach(x => x.textContent = SCHEDE.filter(s => s.area === "nat").length);
  if ($("ctxArch")) $("ctxArch").value = state.path && temaOf(state.path) ? state.path : "";
  if ($("pArchivio").hidden) return;
  const list = SCHEDE.filter(matches);
  if (SCHEDE.length) $("status").textContent = (state.path && temaOf(state.path) ? `Contesto «${temaOf(state.path).n}» · ` : "") + (list.length === SCHEDE.length ? `${SCHEDE.length} schede` : `${list.length} schede su ${SCHEDE.length}`);
  const tm = state.path && temaOf(state.path);
  $("pathBar").hidden = !tm;
  if (tm) $("pathBar").innerHTML = `<span class="ctl-label">Contesto</span><button class="chip" aria-pressed="true" id="pathOff">${esc(tm.n)} ✕</button><span class="pd">${esc(tm.d)}</span>`, $("pathOff").onclick = () => { state.path = null; update(); };
  renderNear(list);
  if (state.view === "elenco") renderResults(list); else renderCloud(list);
}


// perché ci interessa: scritto a mano quando c'è, altrimenti ricostruito dai legami della scheda
function perchePar(s){
  if (!canEdit) return ""; // come si usa una ricerca negli interventi: solo nell'area di lavoro
  if (s.perche) return `<div class="sect perche"><h2>Perché ci interessa</h2><p>${esc(s.perche)}</p></div>`;
  const tm = temiDi(s.id), lv = s.leve.map(k => levaOf(k)).filter(Boolean), pp = (typeof PONTI === "undefined" ? [] : PONTI).filter(p => p.natura.includes(s.id) || p.persone.includes(s.id));
  if (!tm.length && !lv.length && !pp.length) return "";
  const parts = [];
  if (tm.length) parts.push(`Entra nei contesti ${tm.map(t => `<a href="#tema-${encodeURIComponent(t.k)}">${esc(t.n.toLowerCase())}</a>`).join(", ")}`);
  if (lv.length) parts.push(`sostiene la leva ${lv.map(l => "«" + esc(l.n.toLowerCase()) + "»").join(" e ")}`);
  if (pp.length) parts.push(`${isNat(s) ? "è l'analogia in natura" : "è la prova sulle persone"} di «${pp.map(p => esc(p.tema)).join("», «")}»`);
  return `<div class="sect perche"><h2>Perché ci interessa</h2><p>${parts.join("; ")}.</p><p class="verify">Sintesi automatica dai collegamenti della scheda: il testo esteso arriva con l'aggiornamento quotidiano.</p></div>`;
}
// ---------- pagina scheda ----------
function renderScheda(id){
  const box = $("pScheda"), s = byId[id];
  if (!s) { box.innerHTML = `<a class="back" href="#archivio">← L'archivio</a><p class="empty">${SCHEDE.length ? "Questa scheda non esiste o è stata rimossa." : "Apro l'archivio…"}</p>`; return; }
  const a = areaOf(s.area), ext = doiUrl(s);
  const links = [...ADJ[s.id]].map(i => byId[i]).sort((x, y) => x.anno - y.anno);
  const aff = affini(s);
  const autLinks = s.authors.map(aid => `<a href="#autore-${encodeURIComponent(aid)}">${esc(AUT.get(aid).nome)}</a>`).join(", ");
  box.innerHTML = `<a class="back" href="#archivio">← L'archivio</a>
  <div class="detail">
    <article>
      <p class="eyebrow" style="display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="dot" style="background:${mcol(s.macro)}"></span>${esc(macroOf(s.macro).n)} · ${esc(a.n)} · ${esc(TIPO_N[s.tipo])} · ${esc(s.code || "")}</p>
      <h1 style="margin-top:10px">${esc(s.titolo)}</h1>
      <p class="lead2">${autLinks}${s.anno ? " · " + s.anno : ""}</p>
      <p class="ref">${esc(s.fonte)}${s.verificare ? " *" : ""}</p>
      ${s.evidenza ? `<p style="margin-top:12px"><span class="ev" style="color:${EVCOL[s.evidenza]}">evidenza ${esc(s.evidenza)}</span></p>` : ""}
      ${s.composto ? `<p class="verify">Caso composto: le dinamiche sono osservate sul campo, persone e azienda sono di fantasia.</p>` : ""}
      <div class="sect prose"><h2>Sinossi</h2><p>${esc(s.sinossi)}</p></div>
      ${s.tipo === "caso" ? [["Settore", s.settore], ["Problema", s.problema], ["Intervento", s.intervento], ["Esito", s.esito]].filter(x => x[1]).map(([h, t]) => `<div class="sect"><h2>${h}</h2><p>${esc(t)}</p></div>`).join("") : ""}
      ${perchePar(s)}
      ${s.inAzienda ? `<div class="sect"><h2>Che cosa significa per un'organizzazione</h2><p>${esc(s.inAzienda)}</p></div>` : ""}
      <div class="sect"><h2>I temi della scheda</h2><p class="whyhelp">Ogni tema collega questa ricerca alle altre dell'archivio che ne trattano. Clicca un tema per vederle tutte.</p><ul class="why2">${s.microtemi.map(t => { const n = (TOPICS.get(t) || []).length; return `<li><button class="tpill" data-topic="${esc(t)}" title="Vedi le ${n} schede su questo tema"><span class="tpn">${esc(t)}</span><span class="tpc">${n} ${n === 1 ? "scheda" : "schede"}</span></button><p>${s.motivi[t] ? esc(s.motivi[t]) : `<span class="tpe">${n > 1 ? `Lo trattano anche altre ${n - 1} schede dell'archivio.` : "Per ora è l'unica scheda dell'archivio su questo tema."}</span>`}</p></li>`; }).join("")}</ul></div>
      ${aff.length ? `<div class="sect"><h2>Schede affini per micro-temi</h2><ul class="pubs">${aff.map(([i, ts]) => `<li><span class="ry">${byId[i].anno || ""}</span><span><a href="#scheda-${encodeURIComponent(i)}">${esc(byId[i].titolo)}</a><span class="ra" style="display:block">${esc(byId[i].autori)} · in comune: ${ts.map(esc).join(", ")}</span></span></li>`).join("")}</ul></div>` : ""}
      ${s.verificare ? `<p class="verify">* Scheda da controllare sull'originale prima di citarla.</p>` : ""}
    </article>
    <aside class="side">
      <div class="box"><h3>La fonte</h3><div class="extlinks">
        ${ext ? `<a href="${esc(ext)}" target="_blank" rel="noopener">Apri la pubblicazione ↗</a>` : ""}
        <a href="${esc(scholar(s.titolo + " " + (splitAuthors(s.autori)[0] || "")))}" target="_blank" rel="noopener">Cerca su Google Scholar ↗</a>
      </div></div>
      <div class="box"><h3>Autori</h3><div class="extlinks">${s.authors.map(aid => `<a href="#autore-${encodeURIComponent(aid)}">${esc(AUT.get(aid).nome)}</a>`).join("")}</div></div>
      ${temiDi(s.id).length ? `<div class="box pbox"><h3>Temi</h3><div class="extlinks">${temiDi(s.id).map(t => `<a href="#tema-${encodeURIComponent(t.k)}">${esc(t.n)}${pontiDelTema(t.k).length ? ' <span class="pdot" title="con analogie in natura"></span>' : ""} →</a>`).join("")}</div></div>` : ""}
      ${s.leve.length ? `<div class="box"><h3>Leve</h3><div class="minichips">${s.leve.map(k => `<span class="minichip">${esc(levaOf(k).n)}</span>`).join("")}</div></div>` : ""}
      ${links.length ? `<div class="box"><h3>Collegamenti dichiarati</h3><div class="extlinks">${links.map(m => `<a href="#scheda-${encodeURIComponent(m.id)}" style="font-weight:400">${esc(label(m))}, ${m.anno || ""}</a>`).join("")}</div></div>` : ""}
      ${canEdit ? `<div class="box actions"><button class="btn ghost" id="editBtn">Modifica</button><button class="btn danger" id="delBtn">Elimina</button></div>` : ""}
    </aside>
  </div>`;
  box.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => apriArchivio({topics:[b.dataset.topic]}));
  if (canEdit) {
    $("editBtn").onclick = () => openForm(s);
    const del = $("delBtn");
    del.onclick = async () => {
      if (del.dataset.armed !== "1") { del.dataset.armed = "1"; del.textContent = "Conferma eliminazione"; return; }
      del.disabled = true;
      try { await db.collection("schede").doc(s.id).delete(); go("archivio"); } catch (e) { del.textContent = "Eliminazione non riuscita"; }
    };
  }
}

// ---------- autori ----------
function renderAutori(){
  const q = ($("qa").value || "").trim().toLowerCase();
  const list = [...AUT.values()].filter(a => !q || a.nome.toLowerCase().includes(q))
    .sort((a, b) => a.nome.split(" ").pop().localeCompare(b.nome.split(" ").pop(), "it"));
  $("autCount").textContent = `${list.length} autori`;
  $("alpha").innerHTML = list.map(a => `<a href="#autore-${encodeURIComponent(a.id)}"><span>${esc(a.nome)}</span><small>${a.schede.length}</small></a>`).join("") || `<p class="empty">Nessun autore con questo nome.</p>`;
}
$("qa").addEventListener("input", renderAutori);

function renderAutore(id){
  const box = $("pAutore"), a = AUT.get(id), d = AUTDOCS[id] || {};
  if (!a) { box.innerHTML = `<a class="back" href="#autori">← Gli autori</a><p class="empty">${SCHEDE.length ? "Questo autore non è nell'archivio." : "Apro l'archivio…"}</p>`; return; }
  const sch = a.schede.map(i => byId[i]).filter(Boolean).sort((x, y) => x.anno - y.anno);
  const kw = new Map(); sch.forEach(s => s.microtemi.forEach(t => kw.set(t, (kw.get(t) || 0) + 1)));
  (d.paroleChiave || []).forEach(t => { const k = String(t).toLowerCase(); if (!kw.has(k)) kw.set(k, 0); });
  const why = new Map();
  (Array.isArray(d.temi) ? d.temi : []).forEach(x => x && x.tema && why.set(String(x.tema).toLowerCase(), {motivo:String(x.motivo || ""), from:[]}));
  sch.forEach(s => s.microtemi.forEach(t => { if (!why.has(t)) why.set(t, {motivo:"", from:[]}); why.get(t).from.push(s); if (!why.get(t).motivo && s.motivi[t]) why.get(t).motivo = s.motivi[t]; }));
  const near = new Map();
  sch.forEach(s => s.microtemi.forEach(t => (TOPICS.get(t) || []).forEach(i => byId[i].authors.forEach(o => { if (o !== id) near.set(o, (near.get(o) || 0) + 1); }))));
  const areas = [...new Set(sch.map(s => s.macro))];
  const ext = safeUrl(d.url || "");
  box.innerHTML = `<a class="back" href="#autori">← Gli autori</a>
  <div class="detail">
    <article>
      <p class="eyebrow">${areas.map(k => `<span style="display:inline-flex;gap:6px;align-items:center;margin-right:12px"><span class="dot" style="background:${mcol(k)}"></span>${esc(macroOf(k).n)}</span>`).join("") || "Autore"}</p>
      <h1 style="margin-top:10px">${esc(a.nome)}</h1>
      ${d.anni ? `<p class="lead2" style="color:var(--muted)">${esc(d.anni)}</p>` : ""}
      <div class="sect prose"><h2>Chi è e che cosa ha scritto</h2>${d.sintesi ? `<p>${esc(d.sintesi)}</p>` : `<p style="color:var(--muted)">La sintesi di questo autore verrà aggiunta dall'aggiornamento quotidiano dell'archivio.</p>`}</div>
      ${d.teoria ? `<div class="sect prose"><h2>La teoria</h2><p>${esc(d.teoria)}</p></div>` : ""}
      <div class="sect"><h2>Pubblicazioni nell'archivio</h2><ul class="pubs">${sch.map(s => `<li><span class="ry">${s.anno || ""}</span><span><a href="#scheda-${encodeURIComponent(s.id)}">${esc(s.titolo)}</a><span class="ra" style="display:block">${esc(s.fonte)}${doiUrl(s) ? ` · <a href="${esc(doiUrl(s))}" target="_blank" rel="noopener" style="font-family:var(--f-body);font-size:13.5px;color:var(--accent)">fonte ↗</a>` : ""}</span></span></li>`).join("")}</ul>
        ${Array.isArray(d.altreOpere) && d.altreOpere.length ? `<p class="ra" style="margin-top:12px">Altre opere: ${d.altreOpere.map(esc).join("; ")}</p>` : ""}</div>
      <div class="sect"><h2>Parole chiave</h2><div class="cloud">${[...kw.entries()].sort((x, y) => y[1] - x[1]).map(([t]) => `<button class="topicbtn" data-topic="${esc(t)}">${esc(t)}</button>`).join("")}</div></div>
      <div class="sect"><h2>Perché è collegato a questi temi</h2><ul class="why">${[...why.entries()].map(([t, w]) => `<li><button class="topicbtn" data-topic="${esc(t)}" style="align-self:start">${esc(t)}</button><p>${w.motivo ? esc(w.motivo) : ""}${w.from.length ? `<span class="ra" style="display:block">Nell'archivio: ${w.from.map(s => `<a href="#scheda-${encodeURIComponent(s.id)}">${esc(s.titolo)}</a>`).join(", ")}</span>` : ""}</p></li>`).join("")}</ul></div>
    </article>
    <aside class="side">
      <div class="box"><h3>Fuori dall'archivio</h3><div class="extlinks">
        ${ext ? `<a href="${esc(ext)}" target="_blank" rel="noopener">Pagina dell'autore ↗</a>` : ""}
        <a href="${esc(scholar('author:"' + a.nome + '"'))}" target="_blank" rel="noopener">Pubblicazioni su Google Scholar ↗</a>
      </div></div>
      ${near.size ? `<div class="box"><h3>Autori vicini per temi</h3><div class="extlinks">${[...near.entries()].sort((x, y) => y[1] - x[1]).slice(0, 10).map(([o]) => `<a href="#autore-${encodeURIComponent(o)}" style="font-weight:400">${esc(AUT.get(o).nome)}</a>`).join("")}</div></div>` : ""}
    </aside>
  </div>`;
  box.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => apriArchivio({topics:[b.dataset.topic]}));
}

// ---------- modulo ----------
function openForm(s){
  const box = $("pScheda");
  if (!canEdit) { box.innerHTML = `<a class="back" href="#archivio">← L'archivio</a><p class="empty">Solo chi cura l'archivio può aggiungere schede.</p>`; return; }
  const v = s || {titolo:"", autori:"", etichetta:"", anno:"", fonte:"", tipo:"articolo", area:state.disc || "sis", macro:state.macro || "cul", sinossi:"", inAzienda:"", perche:"", microtemi:[], leve:[], collegamenti:[], evidenza:"", verificare:true, url:"", doi:""};
  const opts = (arr, cur) => arr.map(([k, n]) => `<option value="${esc(k)}"${k === cur ? " selected" : ""}>${esc(n)}</option>`).join("");
  box.innerHTML = `<a class="back" href="${s ? "#scheda-" + encodeURIComponent(s.id) : "#archivio"}">← Annulla</a>
  <div class="detail"><div>
    <h1 style="font-size:32px">${s ? "Modifica scheda" : "Nuova scheda"}</h1>
    ${sample ? `<div class="helper" style="margin-top:18px">
      <p>Incolla l'abstract, gli appunti o il riferimento di un paper, di un libro o di un caso studio: Claude propone la scheda, tu la controlli prima di salvarla.</p>
      <textarea id="src" rows="6" aria-label="Testo da cui compilare la scheda"></textarea>
      <div class="actions"><button type="button" class="btn ghost" id="draftBtn">Compila con Claude</button><span class="msg" id="draftMsg" role="status"></span></div>
    </div>` : ""}
    <form class="edit" id="form" style="margin-top:18px">
      <label>Titolo<input id="f-titolo" required value="${esc(v.titolo)}"></label>
      <label>Autori, separati da virgola<input id="f-autori" required value="${esc(v.autori)}"></label>
      <div class="two"><label>Anno<input id="f-anno" type="number" min="1500" max="2100" value="${esc(v.anno)}"></label>
      <label>Etichetta breve<input id="f-etichetta" value="${esc(v.etichetta)}" placeholder="es. Lewin"></label></div>
      <label>Fonte completa<input id="f-fonte" value="${esc(v.fonte)}" placeholder="Rivista, volume, numero, pagine oppure editore"></label>
      <div class="two"><label>DOI<input id="f-doi" value="${esc(v.doi || "")}" placeholder="10.xxxx/…"></label>
      <label>Link alla pubblicazione<input id="f-url" type="url" value="${esc(v.url)}" placeholder="https://"></label></div>
      <div class="two"><label>Tipo<select id="f-tipo">${opts(TIPI.map(t => [t, TIPO_N[t]]), v.tipo)}</select></label>
      <label>Disciplina<select id="f-area">${opts(AREE.map(a => [a.k, a.n]), v.area)}</select></label></div>
      <label>Macro-area<select id="f-macro">${opts(MACRO.map(m => [m.k, m.n]), v.macro)}</select></label>
      <label>Sinossi<textarea id="f-sinossi" rows="6" required>${esc(v.sinossi)}</textarea></label>
      <label>Perché ci interessa<textarea id="f-perche" rows="3">${esc(v.perche || "")}</textarea></label>
      <label>In azienda<textarea id="f-inAzienda" rows="3">${esc(v.inAzienda)}</textarea></label>
      <div id="caseFields" style="display:flex;flex-direction:column;gap:12px"${v.tipo === "caso" ? "" : " hidden"}>
        <label>Settore e dimensione<input id="f-settore" value="${esc(v.settore || "")}"></label>
        <label>Problema<textarea id="f-problema" rows="3">${esc(v.problema || "")}</textarea></label>
        <label>Intervento<textarea id="f-intervento" rows="3">${esc(v.intervento || "")}</textarea></label>
        <label>Esito, anche parziale<textarea id="f-esito" rows="3">${esc(v.esito || "")}</textarea></label>
        <div class="checks"><label><input type="checkbox" id="f-composto"${v.composto ? " checked" : ""}>Caso composto, con persone e azienda di fantasia</label></div>
      </div>
      <label>Micro-temi, separati da virgola<input id="f-microtemi" list="dl-temi" value="${esc(v.microtemi.join(", "))}"></label>
      <datalist id="dl-temi">${[...TOPICS.keys()].sort().map(t => `<option value="${esc(t)}">`).join("")}</datalist>
      <div><span class="ctl-label">Leve</span><div class="checks">${LEVE.map(l => `<label><input type="checkbox" value="${l.k}" class="f-leva"${v.leve.includes(l.k) ? " checked" : ""}>${esc(l.n)}</label>`).join("")}</div></div>
      <label>Collegamenti dichiarati<input id="f-coll" value="${esc(v.collegamenti.join(", "))}" placeholder="identificativi separati da virgola"></label>
      <label>Aggiungi un collegamento<select id="f-addcoll"><option value="">Scegli una scheda…</option>${SCHEDE.filter(x => !s || x.id !== s.id).sort((a, b) => label(a).localeCompare(label(b), "it")).map(x => `<option value="${esc(x.id)}">${esc(label(x))} · ${esc(x.titolo.slice(0, 50))}</option>`).join("")}</select></label>
      <label>Evidenza naturale<select id="f-evidenza">${opts([["", "nessuna"], ...EVID.map(e => [e, e])], v.evidenza)}</select></label>
      <div class="checks"><label><input type="checkbox" id="f-verificare"${v.verificare ? " checked" : ""}>Da verificare sull'originale</label></div>
      <div class="actions"><button class="btn" type="submit" id="saveBtn">Salva scheda</button></div>
      <p class="msg" id="formMsg" role="status"></p>
    </form>
  </div></div>`;
  $("f-addcoll").onchange = ev => {
    const id = ev.target.value; if (!id) return;
    const cur = $("f-coll").value.split(",").map(x => x.trim()).filter(Boolean);
    if (!cur.includes(id)) cur.push(id);
    $("f-coll").value = cur.join(", "); ev.target.value = "";
  };
  $("f-tipo").onchange = ev => { $("caseFields").hidden = ev.target.value !== "caso"; };
  if (sample) $("draftBtn").onclick = draft;
  $("form").onsubmit = ev => { ev.preventDefault(); save(s); };
}

async function draft(){
  const src = $("src").value.trim(), msg = $("draftMsg"), btn = $("draftBtn");
  if (src.length < 40) { msg.textContent = "Incolla almeno qualche riga di testo."; msg.className = "msg err"; return; }
  btn.disabled = true; msg.className = "msg"; msg.textContent = "Claude sta leggendo il testo…";
  const vocab = [...TOPICS.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 200).map(e => e[0]).join("; ");
  const prompt = `Sei l'archivista di un centro studi su organizzazioni, gruppi, lavoro e sistemi naturali. Dal testo qui sotto (abstract, appunti o riferimento di un articolo, di un libro o di un caso studio) prepara una scheda in italiano.
Rispondi solo con un oggetto JSON con questi campi:
"titolo": titolo originale dell'opera;
"autori": nomi completi, separati da virgola;
"anno": numero;
"fonte": riferimento bibliografico completo (rivista, volume, numero, pagine, oppure editore);
"doi": il DOI se compare nel testo, altrimenti vuoto;
"tipo": uno fra "articolo", "libro", "capitolo", "rapporto", "caso";
"area": una fra "sis" (sistemi, cibernetica, complessità), "soc" (psicologia sociale e di comunità), "lav" (psicologia del lavoro), "lea" (leadership e decisione), "cam" (cambiamento dei sistemi sociali), "evo" (evoluzione e cultura organizzativa), "nat" (ecologia, etologia, effetti della natura sulle persone);
"macro": una fra "ind" (il singolo e il gruppo), "com" (comunicazione e voce), "lea" (leadership e decisione), "cul" (cultura), "cam" (cambiamento), "tra" (trasformazione e adattamento), "app" (apprendimento), "ben" (benessere e rigenerazione al lavoro, compresi gli ambienti che rigenerano: luce, suoni, odori, verde). Un'evidenza dalla natura va nella macro-area del concetto organizzativo che spiega (per esempio le api che decidono il nido vanno in "lea"), con "area": "nat";
"sinossi": 5-8 frasi scritte con parole tue, senza copiare frasi del testo: contesto e domanda, metodo o campione, risultati principali, che cosa ha cambiato nel campo, limiti;
"inAzienda": 1-2 frasi su che cosa significa per un'organizzazione;
"perche": 2-3 frasi su perché la ricerca interessa al Metodo Ecosistemico: quale problema dei clienti illumina, quale leva sostiene, come si usa in sessione o nel libro;
se è un caso studio, anche "settore", "problema", "intervento", "esito" (una o due frasi ciascuno, con i risultati anche parziali);
"microtemi": da 4 a 7 termini brevi in minuscolo, riusando quando possibile quelli dell'elenco esistente;
"leve": sottoinsieme di "rel", "car", "gui", "app", "cul", "rig".
Non inventare dati che il testo non contiene: se un campo non si ricava, lascialo vuoto.
Micro-temi esistenti: ${vocab}

Testo:
${src.slice(0, 12000)}`;
  try {
    const d = await sample.json(prompt);
    if (!d || typeof d !== "object") throw {code:"invalid_json"};
    const set = (id, val) => { if (val !== undefined && val !== null && String(val).trim() !== "") $(id).value = val; };
    set("f-titolo", d.titolo); set("f-autori", d.autori); set("f-anno", Number(d.anno) || ""); set("f-fonte", d.fonte); set("f-doi", d.doi);
    if (TIPI.includes(d.tipo)) $("f-tipo").value = d.tipo;
    if (AREE.some(a => a.k === d.area)) $("f-area").value = d.area;
    if (MACRO.some(m => m.k === d.macro)) $("f-macro").value = d.macro;
    set("f-sinossi", d.sinossi); set("f-inAzienda", d.inAzienda); set("f-perche", d.perche);
    $("caseFields").hidden = $("f-tipo").value !== "caso";
    ["settore","problema","intervento","esito"].forEach(k => set("f-" + k, d[k]));
    if (Array.isArray(d.microtemi)) $("f-microtemi").value = d.microtemi.map(t => String(t).toLowerCase().trim()).filter(Boolean).join(", ");
    if (Array.isArray(d.leve)) document.querySelectorAll(".f-leva").forEach(c => c.checked = d.leve.includes(c.value));
    $("f-verificare").checked = true;
    msg.textContent = "Bozza pronta: controlla ogni campo sull'originale prima di salvare.";
  } catch (e) {
    msg.className = "msg err";
    msg.textContent = {not_granted:"Claude non è autorizzato per questa pagina.", rate_limited:"Troppe richieste: riprova fra poco.", invalid_json:"La risposta non era leggibile: riprova o accorcia il testo.", refused:"Claude non ha elaborato questo testo."}[e && e.code] ?? "Non è stato possibile compilare la scheda. Riprova.";
    if (e && (e.code === "not_granted" || e.code === "sampling_disabled")) sample = null;
  } finally { btn.disabled = false; }
}

async function save(old){
  const msg = $("formMsg"), btn = $("saveBtn");
  const val = id => $(id).value.trim();
  const doc = {titolo:val("f-titolo"), autori:val("f-autori"), etichetta:val("f-etichetta"), anno:Number(val("f-anno")) || 0,
    fonte:val("f-fonte"), doi:val("f-doi"), url:val("f-url"), tipo:val("f-tipo"), area:val("f-area"), macro:val("f-macro"), sinossi:val("f-sinossi"), inAzienda:val("f-inAzienda"), perche:val("f-perche"),
    microtemi:[...new Set(val("f-microtemi").split(",").map(t => t.trim().toLowerCase()).filter(Boolean))],
    leve:[...document.querySelectorAll(".f-leva:checked")].map(c => c.value),
    collegamenti:[...new Set(val("f-coll").split(",").map(t => t.trim()).filter(t => byId[t]))],
    evidenza:val("f-evidenza"), verificare:$("f-verificare").checked,
    motivi:old ? old.motivi : {}, autoriIds:old ? old.autoriIds : [],
    creata:old ? old.creata : new Date().toISOString().slice(0, 10)};
  if (doc.tipo === "caso") Object.assign(doc, {settore:val("f-settore"), problema:val("f-problema"), intervento:val("f-intervento"), esito:val("f-esito"), composto:$("f-composto").checked});
  if (!doc.titolo || !doc.autori || !doc.sinossi) { msg.className = "msg err"; msg.textContent = "Titolo, autori e sinossi sono obbligatori."; return; }
  if (doc.microtemi.length < 2) { msg.className = "msg err"; msg.textContent = "Aggiungi almeno due micro-temi, servono a collegare la scheda."; return; }
  let id = old ? old.id : slug((doc.etichetta || (splitAuthors(doc.autori)[0] || "").split(" ").pop()) + "-" + (doc.anno || ""));
  if (!old) { const base = id; let i = 2; while (byId[id]) id = `${base}-${i++}`; }
  btn.disabled = true; msg.className = "msg"; msg.textContent = "Salvo…";
  try { await db.collection("schede").doc(id).set(doc); go("scheda-" + id); }
  catch (e) {
    btn.disabled = false; msg.className = "msg err";
    msg.textContent = e && e.code === "quota_exceeded" ? "L'archivio è pieno: elimina qualche scheda prima di aggiungerne." :
      e && e.code === "invalid_argument" ? "Non hai i permessi per scrivere nell'archivio, oppure un campo non è valido." : "Salvataggio non riuscito. Riprova.";
  }
}

// ---------- natura ----------
const SENSI = [["Luce", "luce naturale"], ["Vista", "vista sul verde"], ["Suono", "suoni naturali"], ["Olfatto", "odori e fitoncidi"], ["Piante", "piante indoor"], ["Acqua", "acqua"], ["Ritmi", "ritmi circadiani"]];
function renderNatura(){
  const g = $("naturaGrid"); if (!g) return;
  g.innerHTML = MACRO.filter(m => m.dom === "nat").map(m => {
    const list = SCHEDE.filter(s => s.macro === m.k);
    const cnt = new Map(); list.forEach(s => s.microtemi.forEach(t => cnt.set(t, (cnt.get(t) || 0) + 1)));
    const top = [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    return `<div class="nat" style="--c:${mcol(m.k)}"><h3>${esc(m.n)}</h3><p>${esc(m.d)}</p>
      <div class="cloud">${top.map(([t]) => `<button class="topicbtn" data-nt="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      <span class="n">${list.length} schede nell'archivio</span>
      <button class="btn ghost" data-nm="${m.k}" style="align-self:flex-start">Apri nell'archivio</button></div>`;
  }).join("");
  g.querySelectorAll("[data-nt]").forEach(b => b.onclick = () => apriArchivio({topics:[b.dataset.nt]}));
  g.querySelectorAll("[data-nm]").forEach(b => b.onclick = () => apriArchivio({macro:b.dataset.nm}));
  $("senses").innerHTML = `<span class="ctl-label" style="align-self:center">I sensi nell'ambiente di lavoro</span>` + SENSI.map(([n, t]) => `<button class="sense topicbtn" data-st="${esc(t)}"><b>${n}</b> · ${(TOPICS.get(t) || []).length} schede</button>`).join("");
  $("senses").querySelectorAll("[data-st]").forEach(b => b.onclick = () => apriArchivio({topics:[b.dataset.st]}));
}

// ---------- livelli del modello ----------
function renderLivelli(){
  const box = $("levels2"); if (!box) return;
  box.innerHTML = LIVELLI.map((l, i) => `<div class="lv"><span class="n">${i + 1}</span><h3>${l.n}</h3><p>${l.d}</p><div class="chips">${l.m.map(k => `<button class="chip go" data-lm="${k}"><span class="dot" style="background:${mcol(k)}"></span>${esc(macroOf(k).n)} · ${SCHEDE.filter(s => s.macro === k).length}</button>`).join("")}</div></div>`).join("");
  box.querySelectorAll("[data-lm]").forEach(b => b.onclick = () => apriArchivio({macro:b.dataset.lm}));
}

// ---------- leve ----------
function renderLeve(){
  const g = $("leveGrid"); if (!g) return; g.innerHTML = "";
  // gli studi da cui parte ogni leva: se la scheda è in archivio diventa un collegamento
  const studio = f => { const m = f.match(/^(.*) (\d{4})$/); if (!m) return esc(f);
    const cog = m[1].split(/ e | /)[0].toLowerCase(), suo = x => label(x).toLowerCase().includes(cog);
    const s = SCHEDE.find(x => String(x.anno) === m[2] && suo(x)) || SCHEDE.find(x => suo(x) && String(x.fonte || "").includes(m[2]));
    return s ? `<a href="#scheda-${encodeURIComponent(s.id)}">${esc(f)}</a> <span class="lvtit">${esc(s.titolo)}</span>` : `${esc(f)}`; };
  LEVE.forEach((l, i) => {
    const n = SCHEDE.filter(s => s.leve.includes(l.k)).length;
    const d = document.createElement("article"); d.className = "leva";
    d.innerHTML = `<p class="lvtop"><span class="n">Leva ${i + 1}</span></p><h3>${esc(l.n)}</h3>${canEdit && l.q ? `<p class="lvq">«${esc(l.q)}»</p>` : ""}
      <p>${esc(l.cosa)}</p>
      <p class="lvseg"><b>Come si riconosce in azienda.</b> ${esc(l.segni)}</p>
      ${canEdit && l.uno ? `<div class="lvfacce"><div><span class="ctl-label">Nella persona</span>${esc(l.uno)}</div><div><span class="ctl-label">Nel sistema</span>${esc(l.sis)}</div></div>` : ""}
      ${l.origine ? `<p class="lvorig"><b>Da dove viene.</b> ${esc(l.origine)}</p>` : ""}
      <div class="lvstudi"><span class="ctl-label">Gli studi da cui parte</span><ul>${l.fonti.split("; ").map(f => `<li>${studio(f)}</li>`).join("")}</ul></div>`;
    const b = document.createElement("button"); b.className = "btn lvgo"; b.textContent = SCHEDE.length ? `Le ${n} schede su questa leva →` : "Apri nell'archivio →";
    b.onclick = () => apriArchivio({leva:l.k});
    d.appendChild(b); g.appendChild(d);
  });
}
renderLeve();
