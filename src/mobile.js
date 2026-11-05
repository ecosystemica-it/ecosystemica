
// ---------- telefono: i temi come elenco da toccare, la mappa sotto, il tema a pagina piena ----------
const MOBILE = window.matchMedia("(max-width:760px)");
function renderMobileTemi(){
  const box = $("mTemi"); if (!box) return;
  box.innerHTML = `<div class="mthead"><p class="eyebrow">Da dove partire</p><h2>Scegli il tema che ti riguarda</h2><p>I temi sono divisi per livello, dalla persona all'ambiente. Toccane uno per leggere che cosa dice la ricerca e quali fenomeni naturali mostrano lo stesso meccanismo.</p></div>` +
    LIVELLI.map((l, i) => {
      const tt = TEMI.filter(t => t.liv === i); if (!tt.length) return "";
      return `<section class="mliv"><h3><span class="mn">${i + 1}</span>${esc(l.n)}</h3><div class="mrows">${tt.map(t => {
        const n = SCHEDE.length ? schedeDelTema(t.k).length : 0;
        return `<a class="mrow" href="#tema-${encodeURIComponent(t.k)}"><span class="mrt">${esc(t.n)}</span>${n ? `<span class="mrn">${n} schede</span>` : ""}<span class="mrd">${esc(t.d || "")}</span></a>`;
      }).join("")}</div></section>`;
    }).join("") +
    `<p class="mmap">Più sotto c'è la mappa di tutte le ricerche: tocca un punto per aprirne la scheda. Sullo schermo del computer si legge per intero, con i nomi degli autori.</p>`;
}
const _rebuildM = rebuild;
rebuild = function(){ const r = _rebuildM.apply(this, arguments); renderMobileTemi(); return r; };
const _openTemaM = openTema;
openTema = function(k, isPonte){ const r = _openTemaM.apply(this, arguments); if (MOBILE.matches && k) window.scrollTo(0, 0); return r; };
renderMobileTemi();
