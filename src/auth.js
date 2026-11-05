
// ---------- accesso degli iscritti e biblioteca personale sul sito pubblico (Supabase) ----------
const SB_URL = "https://jofqonhjotetqiyfgqaw.supabase.co";
const SB_KEY = "sb_publishable_PVXBPeho8tk6yVwyRStoPQ__rginTjK";
const AREA_LAVORO = "https://claude.ai/artifact/9tUaXABkKHHjaBqhKpDziv";
const SBC = window.supabase && supabase.createClient ? supabase.createClient(SB_URL, SB_KEY, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true}}) : null;
const AUTH = {user:null, ruolo:"utente", modo:"accedi"};

// una raccolta che offre alla biblioteca la stessa interfaccia della redazione, ma salva su Supabase
function colSupabase(uid){
  const subs = []; let cache = {};
  const emit = () => { const snap = {docs:Object.entries(cache).map(([id, d]) => ({id, exists:true, data:() => d}))}; subs.forEach(f => f(snap)); };
  const load = async () => {
    const {data, error} = await SBC.from("biblioteca").select("ref,stato").eq("utente", uid);
    if (error) throw error;
    cache = {}; (data || []).forEach(r => { cache[r.ref] = r.stato || {}; }); emit();
  };
  return {
    onSnapshot(cb, err){ subs.push(cb); load().catch(e => err && err(e)); },
    doc(id){ return {
      async set(d){
        const tipo = id === "raccolte" ? "raccolte" : (["scheda", "autore", "ricerca"].includes(d.tipo) ? d.tipo : "scheda");
        const row = {utente:uid, tipo, ref:id, nome:d.nome || null, nota:d.nota || null, raccolte:Array.isArray(d.raccolte) ? d.raccolte : [], stato:d, n:typeof d.n === "number" ? d.n : null, aggiornato:new Date().toISOString()};
        const {error} = await SBC.from("biblioteca").upsert(row, {onConflict:"utente,tipo,ref"});
        if (error) throw error; cache[id] = d; emit();
      },
      async update(d){ return this.set({...(cache[id] || {}), ...d}); },
      async delete(){ const {error} = await SBC.from("biblioteca").delete().eq("utente", uid).eq("ref", id); if (error) throw error; delete cache[id]; emit(); }
    }; }
  };
}

function apriBiblioteca(uid){
  BIB.uid = uid; BIB.col = colSupabase(uid);
  BIB.col.onSnapshot(snap => {
    BIB.docs = {}; snap.docs.forEach(d => { BIB.docs[d.id] = d.data(); });
    BIB.ready = true; document.body.classList.add("iscritto");
    const h = decodeURIComponent((location.hash || "").slice(1));
    if (h === "biblioteca") renderBiblio(); else if (h.startsWith("scheda-")) renderScheda(h.slice(7)); else if (h.startsWith("autore-")) renderAutore(h.slice(7));
  }, () => { bibMsg("La biblioteca non risponde: riprova fra poco."); renderBiblio(); });
}
function chiudiBiblioteca(){
  Object.assign(BIB, {uid:null, col:null, docs:{}, ready:false});
  document.body.classList.remove("iscritto", "staff");
  const h = decodeURIComponent((location.hash || "").slice(1));
  if (h === "biblioteca") renderBiblio(); else if (h.startsWith("scheda-")) renderScheda(h.slice(7)); else if (h.startsWith("autore-")) renderAutore(h.slice(7));
}

// chi non è iscritto vede, al posto dei comandi della biblioteca, l'invito ad accedere
const _bibBoxSchedaA = bibBoxScheda;
bibBoxScheda = function(s){
  if (BIB.ready) return _bibBoxSchedaA(s);
  return `<div class="box bibbox"><h3>La mia biblioteca</h3><p class="bibhelp">Con un account gratuito salvi le schede, le ricerche e gli autori, aggiungi note e raccolte e prepari la bibliografia.</p><button class="btn" data-auth="iscriviti">Iscriviti</button> <button class="btn ghost" data-auth="accedi">Accedi</button></div>`;
};
const _renderBiblioA = renderBiblio;
renderBiblio = function(){
  if (BIB.ready) return _renderBiblioA();
  const box = $("bibBody"); if (!box) return;
  box.innerHTML = `<div class="zero"><p><b>La biblioteca è lo spazio personale degli iscritti.</b> Qui ritrovi le schede, le ricerche e gli autori che hai salvato, con le tue note e le tue raccolte, e da qui copi la bibliografia pronta. L'iscrizione è gratuita.</p><div class="actions"><button class="btn" data-auth="iscriviti">Iscriviti</button><button class="btn ghost" data-auth="accedi">Accedi</button></div></div>`;
};

// ---------- la finestra di accesso ----------
const ERR_IT = [
  [/invalid login credentials/i, "Email o password non corretti."],
  [/email not confirmed/i, "Devi prima confermare l'email: apri il messaggio che ti abbiamo mandato e clicca il link."],
  [/already registered|already been registered/i, "Questa email è già iscritta: accedi con la tua password."],
  [/password should be at least|weak password/i, "La password è troppo debole: usa almeno 8 caratteri, con lettere e numeri."],
  [/rate limit|too many/i, "Troppi tentativi in poco tempo: riprova fra qualche minuto."],
  [/invalid email|unable to validate email/i, "L'indirizzo email non sembra valido."]
];
const errIt = e => { const m = String((e && e.message) || e || ""); const t = ERR_IT.find(([r]) => r.test(m)); return t ? t[1] : "Non è stato possibile completare l'operazione. Riprova fra poco."; };

function formAuth(){
  const m = AUTH.modo;
  const titolo = {accedi:"Accedi", iscriviti:"Iscriviti al centro", recupero:"Recupera la password", nuova:"Scegli una nuova password"}[m];
  const campi = m === "accedi" ? `<label>Email<input id="au-email" type="email" autocomplete="email" required></label><label>Password<input id="au-pw" type="password" autocomplete="current-password" required></label>`
    : m === "iscriviti" ? `<label>Nome e cognome<input id="au-nome" autocomplete="name"></label><label>Email<input id="au-email" type="email" autocomplete="email" required></label><label>Password<input id="au-pw" type="password" autocomplete="new-password" minlength="8" required><span class="bibhelp">Almeno 8 caratteri.</span></label>
      <label class="aucheck"><input id="au-ok" type="checkbox" required> Ho letto l'<a href="/privacy/" target="_blank" rel="noopener">informativa sulla privacy</a> e accetto che i miei dati siano trattati per gestire l'account e la biblioteca.</label>`
    : m === "recupero" ? `<label>Email<input id="au-email" type="email" autocomplete="email" required></label><p class="bibhelp">Ti mandiamo un link per scegliere una nuova password.</p>`
    : `<label>Nuova password<input id="au-pw" type="password" autocomplete="new-password" minlength="8" required></label>`;
  const bott = {accedi:"Accedi", iscriviti:"Crea l'account", recupero:"Mandami il link", nuova:"Salva la password"}[m];
  const piede = m === "accedi" ? `<p class="aulinks">Non hai un account? <button type="button" class="linkbtn" data-auth="iscriviti">Iscriviti</button> · <button type="button" class="linkbtn" data-auth="recupero">Password dimenticata?</button></p>`
    : m === "iscriviti" ? `<p class="aulinks">Hai già un account? <button type="button" class="linkbtn" data-auth="accedi">Accedi</button></p>`
    : m === "recupero" ? `<p class="aulinks"><button type="button" class="linkbtn" data-auth="accedi">Torna all'accesso</button></p>` : "";
  $("authBox").innerHTML = `<form class="authform" id="auForm"><div class="authhead"><h2>${titolo}</h2><button type="button" class="linkbtn" id="auClose" aria-label="Chiudi">✕</button></div>
    ${m === "iscriviti" ? `<p class="bibhelp">L'iscrizione è gratuita: ti permette di salvare schede, ricerche e autori, scrivere note, creare raccolte e copiare la bibliografia.</p>` : ""}
    ${campi}<div class="actions"><button class="btn" id="auGo">${bott}</button><span class="status" id="auSt" role="status"></span></div>${piede}</form>`;
  $("auClose").onclick = chiudiAuth;
  $("auForm").onsubmit = inviaAuth;
  const f = $("auForm").querySelector("input"); if (f) setTimeout(() => f.focus(), 30);
}
function apriAuth(modo){
  if (!SBC) { alertAuth(); return; }
  AUTH.modo = modo || "accedi"; formAuth();
  const d = $("authDlg"); if (!d.open) d.showModal();
}
function alertAuth(){ const d = $("authDlg"); $("authBox").innerHTML = `<div class="authform"><p>L'accesso non è disponibile in questo momento. Riprova fra poco.</p><button class="btn" id="auClose">Chiudi</button></div>`; $("auClose").onclick = chiudiAuth; if (!d.open) d.showModal(); }
function chiudiAuth(){ const d = $("authDlg"); if (d.open) d.close(); }
async function inviaAuth(ev){
  ev.preventDefault();
  const st = $("auSt"), go = $("auGo"), v = id => ($(id) ? $(id).value.trim() : "");
  go.disabled = true; st.textContent = "Un momento…";
  try {
    if (AUTH.modo === "accedi") {
      const {error} = await SBC.auth.signInWithPassword({email:v("au-email"), password:$("au-pw").value}); if (error) throw error;
      chiudiAuth();
    } else if (AUTH.modo === "iscriviti") {
      const {data, error} = await SBC.auth.signUp({email:v("au-email"), password:$("au-pw").value, options:{emailRedirectTo:location.origin + "/#biblioteca", data:{nome:v("au-nome")}}});
      if (error) throw error;
      if (data && data.session) { chiudiAuth(); go.disabled = false; return; }
      $("authBox").innerHTML = `<div class="authform"><h2>Controlla la posta</h2><p>Ti abbiamo mandato un'email a <b>${esc(v("au-email"))}</b>. Clicca il link che contiene per confermare l'iscrizione: tornerai qui già collegato. Se non la trovi, guarda nella posta indesiderata.</p><button class="btn" id="auClose">Ho capito</button></div>`;
      $("auClose").onclick = chiudiAuth; return;
    } else if (AUTH.modo === "recupero") {
      const {error} = await SBC.auth.resetPasswordForEmail(v("au-email"), {redirectTo:location.origin + "/"}); if (error) throw error;
      st.textContent = "Se l'email è iscritta, ti è arrivato un link per scegliere una nuova password.";
    } else {
      const {error} = await SBC.auth.updateUser({password:$("au-pw").value}); if (error) throw error;
      st.textContent = "Password aggiornata."; setTimeout(chiudiAuth, 900);
    }
  } catch (e) { st.textContent = errIt(e); }
  go.disabled = false;
}

// ---------- intestazione: accedi, esci, area di lavoro ----------
function aggiornaTesta(){
  const box = $("authNav"); if (!box) return;
  if (!AUTH.user) { box.innerHTML = `<button class="btn sm" data-auth="accedi">Accedi</button>`; return; }
  const nome = (AUTH.user.user_metadata && AUTH.user.user_metadata.nome) || AUTH.user.email;
  box.innerHTML = `${AUTH.ruolo === "admin" ? `<a class="btn sm" href="${AREA_LAVORO}" target="_blank" rel="noopener" title="Redazione, brief e interventi">Area di lavoro ↗</a>` : ""}<button class="btn ghost sm" id="auOut" title="Collegato come ${esc(AUTH.user.email)}">Esci</button>`;
  $("auOut").onclick = async () => { await SBC.auth.signOut(); };
  $("auOut").setAttribute("aria-label", "Esci (" + nome + ")");
}
async function leggiRuolo(uid){
  try { const {data} = await SBC.from("profili").select("ruolo").eq("id", uid).maybeSingle(); return data && data.ruolo === "admin" ? "admin" : "utente"; } catch (e) { return "utente"; }
}

document.addEventListener("click", ev => { const b = ev.target.closest("[data-auth]"); if (b) { ev.preventDefault(); apriAuth(b.dataset.auth); } });
if ($("authDlg")) $("authDlg").addEventListener("click", ev => { if (ev.target === $("authDlg")) chiudiAuth(); });

if (SBC) {
  SBC.auth.onAuthStateChange((evento, sessione) => {
    // il lavoro asincrono si fa fuori dal gestore, come chiede Supabase
    setTimeout(async () => {
      const u = sessione && sessione.user;
      if (evento === "PASSWORD_RECOVERY") { apriAuth("nuova"); }
      if (u && (!AUTH.user || AUTH.user.id !== u.id)) {
        AUTH.user = u; AUTH.ruolo = await leggiRuolo(u.id);
        document.body.classList.toggle("staff", AUTH.ruolo === "admin");
        aggiornaTesta(); apriBiblioteca(u.id);
      } else if (!u && AUTH.user) {
        AUTH.user = null; AUTH.ruolo = "utente"; aggiornaTesta(); chiudiBiblioteca();
      } else aggiornaTesta();
    }, 0);
  });
}
aggiornaTesta();
