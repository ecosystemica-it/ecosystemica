
// ---------- tag: concetti, tipo di prova, contesto, organizzazioni ----------
let VOCAB = {};
const TAGFAM = {concetti:"Concetto", prova:"Tipo di prova", contesto:"Contesto studiato", organizzazioni:"Organizzazione citata"};
const tagVals = (s, f) => f === "prova" ? (s.prova ? [s.prova] : []) : (s[f] || []);
function tagCount(f){ const m = new Map(); SCHEDE.forEach(s => tagVals(s, f).forEach(v => m.set(v, (m.get(v) || 0) + 1))); return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "it")); }
function fillTagSelects(){
  ["concetti", "prova", "contesto", "organizzazioni"].forEach(f => {
    const sel = $("tg-" + f); if (!sel) return;
    const cur = state.tag && state.tag.f === f ? state.tag.v : "";
    sel.innerHTML = `<option value="">${f === "concetti" ? "tutti i concetti" : f === "prova" ? "ogni tipo di prova" : f === "contesto" ? "ogni contesto" : "ogni organizzazione"}</option>` + tagCount(f).map(([v, n]) => `<option value="${esc(v)}">${esc(v)} · ${n}</option>`).join("");
    sel.value = cur;
  });
}
function setTag(f, v){ state.tag = v ? {f, v} : null; state.shown = 60; setView("elenco"); if ($("pArchivio").hidden) go("archivio"); update(); vaiAiRisultati && vaiAiRisultati(); }
function tagBar(){
  const b = $("tagBar"); if (!b) return;
  const t = state.tag; b.hidden = !t;
  if (!t) return;
  const voc = t.f === "concetti" ? VOCAB[t.v] : null;
  b.innerHTML = `<span class="ctl-label">${esc(TAGFAM[t.f])}</span><button class="chip" aria-pressed="true" id="tagOff">${esc(t.v)} ✕</button>${voc && voc.definizione ? `<span class="pd">${esc(voc.definizione)}</span>` : ""}`;
  $("tagOff").onclick = () => { state.tag = null; fillTagSelects(); update(); };
}
const tagMatch = s => !state.tag || tagVals(s, state.tag.f).includes(state.tag.v);
function tagBox(s){
  const fam = ["concetti", "prova", "contesto", "organizzazioni"].map(f => [f, tagVals(s, f)]).filter(([, v]) => v.length);
  if (!fam.length) return "";
  return `<div class="box tagbox"><h3>Tag</h3>${fam.map(([f, vs]) => `<p class="ctl-label">${esc(TAGFAM[f])}</p><div class="tagchips">${vs.map(v => `<button class="tgc tgc-${f}" data-tf="${f}" data-tv="${esc(v)}" title="${esc(f === "concetti" && VOCAB[v] ? VOCAB[v].definizione : "Vedi tutte le schede con questo tag")}">${esc(v)}</button>`).join("")}</div>`).join("")}</div>`;
}
document.addEventListener("click", ev => { const b = ev.target.closest("[data-tf]"); if (b) { ev.preventDefault(); apriArchivio({tag:{f:b.dataset.tf, v:b.dataset.tv}}); } });
["concetti", "prova", "contesto", "organizzazioni"].forEach(f => { const sel = $("tg-" + f); if (sel) sel.onchange = () => { ["concetti", "prova", "contesto", "organizzazioni"].forEach(g => { if (g !== f && $("tg-" + g)) $("tg-" + g).value = ""; }); setTag(f, sel.value); }; });
const _renderSchedaT = renderScheda;
renderScheda = function(id){ _renderSchedaT(id); const s = byId[id], side = document.querySelector("#pScheda .side"); if (s && side) { const fonte = side.querySelector(".box"); const html = tagBox(s); if (html) (fonte ? fonte.insertAdjacentHTML("afterend", html) : side.insertAdjacentHTML("afterbegin", html)); } };
const _updateT = update;
update = function(){ _updateT(); tagBar(); };

// vocabolario in Redazione
function renderVocab(){
  const box = $("vocList"); if (!box || !canEdit) return;
  const cnt = new Map(tagCount("concetti"));
  const items = Object.entries(VOCAB).sort((a, b) => (a[1].stato === "proposto" ? -1 : 0) - (b[1].stato === "proposto" ? -1 : 0) || a[0].localeCompare(b[0], "it"));
  const nProp = items.filter(([, v]) => v.stato === "proposto").length;
  $("vocHead").textContent = `${items.length - nProp} concetti approvati${nProp ? ` · ${nProp} proposti da approvare` : ""}`;
  box.innerHTML = items.map(([k, v]) => `<li class="vrow${v.stato === "proposto" ? " vprop" : ""}"><div class="rtx"><button class="linkbtn big" data-tf="concetti" data-tv="${esc(k)}">${esc(k)}</button> <span class="rmeta">${cnt.get(k) || 0} schede${v.stato === "proposto" ? " · proposto" + (v.propostoDa ? " da " + esc(v.propostoDa) : "") : ""}</span><span class="rsin">${esc(v.definizione || "")}</span>${(v.sinonimi || []).length ? `<span class="rmeta">Comprende: ${(v.sinonimi || []).map(esc).join(", ")}</span>` : ""}</div><div class="ract">${v.stato === "proposto" ? `<button class="btn" data-vok="${esc(v.id)}">Approva</button><button class="linkbtn" data-vno="${esc(v.id)}">scarta</button>` : ""}</div></li>`).join("");
  box.querySelectorAll("[data-vok]").forEach(b => b.onclick = async () => { b.disabled = true; try { await db.collection("vocabolario").doc(b.dataset.vok).update({stato:"approvato"}); } catch (e) { b.disabled = false; } });
  box.querySelectorAll("[data-vno]").forEach(b => b.onclick = async () => { if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "conferma"; return; } try { await db.collection("vocabolario").doc(b.dataset.vno).delete(); } catch (e) {} });
}
