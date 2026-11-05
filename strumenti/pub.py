#!/usr/bin/env python3
"""Costruisce il sito pubblico di Ecosystemica dalla redazione privata.
Uso: python3 pub.py <cartella export> <cartella public> [--lancio]
Senza --lancio il sito è in anteprima: noindex e robots.txt chiuso."""
import json, glob, os, re, sys, shutil, html, datetime

S = os.path.dirname(os.path.abspath(__file__)) + "/.."
C = S + "/src"
EXP, OUT = sys.argv[1], sys.argv[2]
LANCIO = "--lancio" in sys.argv
BASE = "https://ecosystemica.it"
OGGI = datetime.date.today().isoformat()
# dati del titolare: per ora solo il contatto; ragione sociale, sede e partita IVA si aggiungono quando ci saranno
CONTATTO = "hello@ecosystemica.it"
TITOLARE = {"nome": "", "piva": "", "sede": "", "email": CONTATTO}

E = lambda s: html.escape(str(s or ""), quote=True)

def carica(col):
    out = []
    for f in sorted(glob.glob(f"{EXP}/{col}/*.json")):
        d = json.load(open(f)); d = d.get("data", d); d["id"] = os.path.basename(f)[:-5]; out.append(d)
    return out

# campi interni e campi di metodo (come si usa negli interventi): non escono mai dalla redazione
INTERNI = {"verificare", "stato", "approvata", "richiesta", "rivista", "notaRedazione", "pubblica", "notaFonte", "version", "perche"}
schede = [d for d in carica("schede") if d.get("stato") == "approvata" and d.get("pubblica") is not False]
ids = {d["id"] for d in schede}
for d in schede:
    for k in list(d):
        if k in INTERNI: del d[k]
    d["collegamenti"] = [c for c in d.get("collegamenti", []) if c in ids]
ponti = carica("ponti")
for p in ponti:
    p["natura"] = [i for i in p.get("natura", []) if i in ids]; p["persone"] = [i for i in p.get("persone", []) if i in ids]
ponti = [p for p in ponti if p["natura"] and p["persone"]]
for p in ponti:
    for k in ("domanda", "strumento"): p.pop(k, None)
voc = [{"nome": v["nome"], "definizione": v.get("definizione", ""), "sinonimi": v.get("sinonimi", [])} for v in carica("vocabolario") if v.get("stato", "approvato") == "approvato" and v.get("nome")]
usati = {a for d in schede for a in d.get("autoriIds", [])}
autori = [a for a in carica("autori") if a["id"] in usati]
for a in autori:
    for k in list(a):
        if k in INTERNI or k in ("creata",): a.pop(k, None)
print(f"schede pubbliche {len(schede)}, ponti {len(ponti)}, concetti {len(voc)}, autori con pagina {len(autori)}")

if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT + "/assets/fonts")

# ---------- caratteri ospitati sul sito ----------
FS = C + "/fonts"
ff = []
for fam, pkg, pesi in [("Space Grotesk", "space-grotesk", [500, 600, 700]), ("Inter", "inter", [400, 500, 600, 700]), ("IBM Plex Mono", "ibm-plex-mono", [400, 500])]:
    for w in pesi:
        n = f"{pkg}-latin-{w}-normal.woff2"; shutil.copy(f"{FS}/{n}", f"{OUT}/assets/fonts/{n}")
        ff.append(f'@font-face{{font-family:"{fam}";font-style:normal;font-weight:{w};font-display:swap;src:url(/assets/fonts/{n}) format("woff2")}}')

# ---------- foglio di stile unico ----------
def stili(fn):
    return "\n".join(re.findall(r"<style>(.*?)</style>", open(f"{C}/{fn}").read(), re.S))
RESET = ":root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}*,*::before,*::after{box-sizing:border-box}"
EXTRA = """
.pubfoot{display:flex;flex-direction:column;gap:10px}.legend.crediti{display:flex!important;flex-direction:column;gap:5px;max-width:min(440px,calc(100% - 580px))!important;font-family:var(--f-mono);font-size:9px;padding:6px 10px!important;line-height:1.35;gap:3px!important}.legend.crediti .pfrow{display:flex;flex-wrap:wrap;gap:1px 10px;font-size:7px!important}.legend.crediti .pfrow *{font-size:inherit!important}.legend.crediti a{color:var(--muted)}.legend.crediti a:hover{color:var(--ink)}.legend.crediti .pfcopy{margin:0;font-size:5.5px;line-height:1.4;color:var(--muted);max-width:none}@media (max-width:1100px){.legend.crediti{max-width:calc(100% - 560px)!important}.legend.crediti .pfcopy{display:none}}@media (min-width:761px){#pHome .thesis{max-height:calc(100% - 200px);overflow:auto}.legend.crediti{background:color-mix(in srgb, #0C1411 96%, transparent)!important}}@media (min-width:761px) and (max-width:1100px){#pHome .thesis{max-height:calc(100% - 150px)}}.pubfoot .pfrow{display:flex;flex-wrap:wrap;gap:6px 18px}.pubfoot .pfcopy{margin:0;max-width:78ch;font-size:12px;line-height:1.55;color:var(--muted)}
.pubfoot a{color:var(--muted)}
.pg{max-width:1180px;margin:0 auto}
.pg .detail{margin-top:8px}
.pg .ref a{color:var(--link)}
.pg .tagchips{display:flex;flex-wrap:wrap;gap:6px}
.pg .tagchips span{font:500 12px var(--f-mono);padding:3px 8px;border-radius:6px;background:var(--surface2);border:1px solid #2C3A33;color:var(--link)}
.pg .cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.pg .cta a.btn{text-decoration:none;display:inline-block}
.legale{max-width:760px}
.legale h1{font-size:clamp(28px,4vw,40px);margin:8px 0 18px}
.legale h2{font-size:19px;margin:28px 0 8px}
.legale p,.legale li{color:#C9D4CD;max-width:72ch}
.legale p+p{margin-top:10px}
.colleg{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:14px}
.authnav{display:flex;gap:8px;align-items:center;flex:none}
.authnav .btn{white-space:nowrap;text-decoration:none}
@media (max-width:900px){.top .brand{flex:1 1 0;min-width:0}.authnav{order:2;margin-left:auto}.top nav{order:3}}
dialog.authdlg{border:1px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink);padding:0;width:min(440px,calc(100vw - 32px));max-height:calc(100svh - 32px)}
dialog.authdlg::backdrop{background:rgba(5,10,8,.72);backdrop-filter:blur(3px)}
.authform{padding:22px 22px 18px;display:flex;flex-direction:column;gap:12px;margin:0!important;border:0!important;background:transparent!important}
.authform h2{font-size:22px;margin:0}
.authhead{display:flex;justify-content:space-between;align-items:center;gap:10px}
.authform label{display:flex;flex-direction:column;gap:5px;font:500 13px var(--f-ui);letter-spacing:0;text-transform:none;color:var(--muted)}
.authform input[type=email],.authform input[type=password],.authform input:not([type]){font:inherit;font-size:15px;padding:10px 12px;border-radius:8px;border:1px solid #2C3A33;background:#0F1814;color:var(--ink)}
.authform .aucheck{display:block;line-height:1.5;color:var(--ink)}
.authform .aucheck input{margin:0 8px 0 0;vertical-align:-2px}
.authform .bibhelp{text-transform:none;letter-spacing:0;font-family:var(--f-ui)}
.aulinks{font-size:13px;color:var(--muted);margin:0}
.anteprima{background:var(--accent);color:#0C1411;text-align:center;font:600 12.5px var(--f-ui);padding:6px 12px}
"""
css = RESET + "\n" + "\n".join(ff) + "\n" + "\n".join(stili(f) for f in ["head.html", "style2.html", "m3style.html", "m4style.html", "m5style.html"]) + EXTRA
open(f"{OUT}/assets/site.css", "w").write(css)

shutil.copy(C + "/vendor/d3.min.js", f"{OUT}/assets/d3.min.js")
shutil.copy(C + "/vendor/supabase.js", f"{OUT}/assets/supabase.js")
LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="#C6F36B" stroke-width="1.6"><circle cx="20" cy="20" r="18"/><circle cx="20" cy="20" r="12" opacity=".7"/><circle cx="20" cy="20" r="6" opacity=".45"/><circle cx="20" cy="20" r="2.4" fill="#C6F36B" stroke="none"/><circle cx="33.5" cy="12" r="2.4" fill="#C6F36B" stroke="none"/></svg>'
open(f"{OUT}/assets/logo.svg", "w").write(LOGO)

# ---------- dati e codice della pagina principale ----------
open(f"{OUT}/assets/dati.js", "w").write("window.__DATA=" + json.dumps({"schede": schede, "autori": autori, "ponti": ponti, "vocabolario": voc}, ensure_ascii=False, separators=(",", ":")) + ";")
def senza_metodo(t):
    # le domande guida e le due facce delle leve, e le domande dei temi, restano nell'area di lavoro
    for blocco in ("const LEVE = [", "const TEMI = ["):
        a = t.index(blocco); b = t.index("];", a)
        parte = re.sub(r'\b(q|uno|sis):"(?:[^"\\]|\\.)*"', r'\1:""', t[a:b])
        t = t[:a] + parte + t[b:]
    return t
js = "\n".join((senza_metodo(open(f"{C}/{f}").read()) if f == "app.js" else open(f"{C}/{f}").read()) for f in ["app.js", "eco5.js", "ponti.js", "analogia.js", "tag.js", "archivio.js", "mobile.js", "biblio.js", "auth.js", "boot-pub.js"])
open(f"{OUT}/assets/app.js", "w").write(js)

ROBOTS = "" if LANCIO else '<meta name="robots" content="noindex, nofollow">'
BANNER = ""  # la fascia «anteprima» è stata tolta su richiesta; il noindex resta finché non si lancia
FOOT = f'''<footer class="pubfoot"><div class="pfrow"><span>© {datetime.date.today().year} Ecosystemica · Centro Studi sistemici sulle organizzazioni e il lavoro</span><span>Contatti: <a href="mailto:{CONTATTO}">{CONTATTO}</a></span><span><a href="/note-legali/">Note legali</a> · <a href="/privacy/">Privacy</a></span></div><p class="pfcopy">Le opere citate restano di proprietà dei rispettivi autori ed editori, che ne conservano tutti i diritti. Le schede sono sintesi originali della redazione: delle opere riportano soltanto brevi citazioni, a fini di studio, critica e discussione (articolo 70 della legge 633/1941), sempre con il riferimento completo alla fonte. Gli autori citati non sono affiliati al Centro Studi e non ne approvano i contenuti. Se ritieni che un contenuto leda i tuoi diritti, scrivi a {CONTATTO}: lo verifichiamo e, se serve, lo togliamo.</p></footer>'''

def testa(titolo, descr, path, extra=""):
    return f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{E(titolo)}</title><meta name="description" content="{E(descr)}"><link rel="canonical" href="{BASE}{path}">{ROBOTS}
<meta property="og:title" content="{E(titolo)}"><meta property="og:description" content="{E(descr)}"><meta property="og:url" content="{BASE}{path}"><meta property="og:type" content="website"><meta property="og:locale" content="it_IT">
<link rel="icon" href="/assets/logo.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css">{extra}</head>'''

# la pagina principale riusa l'interfaccia della redazione, senza le parti riservate
body = open(f"{C}/m3body.html").read()
for pid in ["pBrief", "pApprof", "pInterventi", "pAzienda", "pRedazione"]:
    body = re.sub(rf'<main id="{pid}"[^>]*>.*?</main>', f'<main id="{pid}" class="page" hidden></main>', body, flags=re.S)
body = re.sub(r'<a href="#[a-z]+" data-nav="(brief|interventi|redazione)" class="adm">[^<]*</a>', "", body)
body = re.sub(r"<footer>.*?</footer>", FOOT, body, flags=re.S)
# in home, al posto della legenda della mappa: crediti, contatti e nota sui diritti
CREDITI = FOOT.replace('<footer class="pubfoot">', '<div class="ov legend crediti">').replace("</footer>", "</div>")
body = re.sub(r'<div class="ov legend">.*?</div>', lambda m: CREDITI, body, count=1, flags=re.S)
body = body.replace('<a href="#brief" class="adm">Dal brief al protocollo →</a>', "")
body = re.sub(r'(<header class="top">.*?</nav>)', r'\1<div class="authnav" id="authNav"></div>', body, count=1, flags=re.S)
body = body.replace(FOOT, '<dialog id="authDlg" class="authdlg" aria-label="Accesso"><div id="authBox"></div></dialog>' + FOOT)
DESCR = "Centro Studi sistemici sulle organizzazioni e il lavoro: un archivio ragionato di ricerche su persone, gruppi e organizzazioni, con le evidenze documentate dai sistemi naturali."
open(f"{OUT}/index.html", "w").write(testa("Ecosystemica · Centro Studi sistemici sulle organizzazioni e il lavoro", DESCR, "/") + "<body>" + BANNER + body +
    '<script src="/assets/d3.min.js"></script><script src="/assets/supabase.js"></script><script src="/assets/dati.js"></script><script src="/assets/app.js"></script></body></html>')

# ---------- intestazione delle pagine statiche ----------
NAV = [("/", "La mappa"), ("/#modello", "Il modello"), ("/#archivio", "L'archivio"), ("/#autori", "Gli autori"), ("/#biblioteca", "La mia biblioteca")]
def header(att=""):
    return f'''<div class="wrap"><header class="top"><a class="brand" href="/" aria-label="Ecosystemica, Centro Studi sistemici sulle organizzazioni e il lavoro"><span class="logo" aria-hidden="true">{LOGO.replace('stroke="#C6F36B"', 'stroke="currentColor"').replace('fill="#C6F36B"', 'fill="currentColor"')}</span><span class="bname">Ecosystemica</span><span class="bsub">Centro Studi sistemici sulle organizzazioni e il lavoro</span></a>
<nav aria-label="Sezioni">{"".join(f'<a href="{h}"{" aria-current=\"page\"" if n == att else ""}>{n}</a>' for h, n in NAV)}</nav></header>'''

MACRO = dict(re.findall(r'\{k:"(\w+)", n:"([^"]+)"', open(f"{C}/app.js").read().split("const MACRO = [")[1].split("];")[0]))
LEVE = dict(re.findall(r'k:"(\w+)", n:"([^"]+)"', open(f"{C}/app.js").read().split("const LEVE = [")[1].split("];")[0]))
AUT = {a["id"]: a for a in autori}
BYID = {d["id"]: d for d in schede}
def etichetta(d):
    return d.get("etichetta") or (d.get("autori", "").split(",")[0])
def descr(t, n=155):
    t = re.sub(r"\s+", " ", str(t or "")).strip()
    return t if len(t) <= n else t[:n].rsplit(" ", 1)[0] + "…"
def nomi_autori(d):
    nomi = [x.strip() for x in str(d.get("autori", "")).split(",") if x.strip()]
    ids_ = d.get("autoriIds", [])
    out = []
    for i, n in enumerate(nomi):
        aid = ids_[i] if i < len(ids_) else None
        out.append(f'<a href="/autori/{aid}/">{E(n)}</a>' if aid in AUT else E(n))
    return ", ".join(out)

sitemap = [("/", OGGI)]
for d in schede:
    sid = d["id"]; path = f"/schede/{sid}/"
    fonte_link = d.get("url") or (f"https://doi.org/{d['doi']}" if d.get("doi") else "")
    tags = [("Concetti", d.get("concetti", [])), ("Tipo di prova", [d["prova"]] if d.get("prova") else []), ("Contesto studiato", d.get("contesto", [])), ("Organizzazioni citate", d.get("organizzazioni", []))]
    colleg = [BYID[c] for c in d.get("collegamenti", []) if c in BYID]
    ld = {"@context": "https://schema.org", "@type": "Article", "headline": d.get("titolo", ""), "inLanguage": "it", "url": BASE + path,
          "about": {"@type": "ScholarlyArticle" if d.get("tipo") == "articolo" else "Book" if d.get("tipo") == "libro" else "CreativeWork", "name": d.get("titolo", ""),
                    "author": [{"@type": "Person", "name": n.strip()} for n in str(d.get("autori", "")).split(",") if n.strip() and "colleghi" not in n],
                    "datePublished": str(d.get("anno", "")), **({"url": fonte_link} if fonte_link else {})},
          "publisher": {"@type": "Organization", "name": "Ecosystemica"}}
    corpo = f'''{header("L'archivio")}<main class="page pg"><a class="back" href="/#archivio">← L'archivio</a>
<div class="detail"><article>
<p class="eyebrow">{E(MACRO.get(d.get("macro"), ""))} · {E(d.get("tipo", ""))} · {E(d.get("anno", ""))}</p>
<h1>{E(d.get("titolo"))}</h1>
<p class="lead2">{nomi_autori(d)}{" · " + E(d.get("anno")) if d.get("anno") else ""}</p>
<p class="ref">{E(d.get("fonte"))}{f' · <a href="{E(fonte_link)}" rel="noopener" target="_blank">Apri la pubblicazione ↗</a>' if fonte_link else ""}</p>
<div class="sect prose"><h2>Sinossi</h2><p>{E(d.get("sinossi"))}</p></div>
{f'<div class="sect prose"><h2>Che cosa significa per un&#39;organizzazione</h2><p>{E(d.get("inAzienda"))}</p></div>' if d.get("inAzienda") else ""}
<div class="cta"><a class="btn" href="/#scheda-{E(sid)}">Vedi i legami sulla mappa →</a><a class="btn ghost" href="/#archivio">Tutte le ricerche</a></div>
</article><aside class="side">
{"".join(f'<div class="box"><h3>{t}</h3><div class="tagchips">{"".join(f"<span>{E(v)}</span>" for v in vs)}</div></div>' for t, vs in tags if vs)}
{f'<div class="box"><h3>Leve</h3><div class="tagchips">{"".join(f"<span>{E(LEVE.get(l, l))}</span>" for l in d.get("leve", []))}</div></div>' if d.get("leve") else ""}
{f'<div class="box"><h3>Collegamenti</h3><ul class="colleg">{"".join(f"<li><a href=\"/schede/{c["id"]}/\">{E(etichetta(c))}, {E(c.get("anno"))}</a></li>" for c in colleg)}</ul></div>' if colleg else ""}
</aside></div></main>{FOOT}</div>'''
    os.makedirs(OUT + path)
    open(OUT + path + "index.html", "w").write(testa(f"{d.get('titolo')} · {etichetta(d)} {d.get('anno', '')} · Ecosystemica", descr(d.get("sinossi")), path,
        f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>') + "<body>" + BANNER + corpo + "</body></html>")
    sitemap.append((path, OGGI))

for a in autori:
    path = f"/autori/{a['id']}/"
    sue = [d for d in schede if a["id"] in d.get("autoriIds", [])]
    opere = a.get("altreOpere") or []
    corpo = f'''{header("Gli autori")}<main class="page pg"><a class="back" href="/#autori">← Gli autori</a>
<div class="detail"><article><p class="eyebrow">Autore</p><h1>{E(a.get("nome"))}</h1>{f'<p class="lead2" style="color:var(--muted)">{E(a.get("anni"))}</p>' if a.get("anni") else ""}
{f'<div class="sect prose"><h2>Chi è e che cosa ha scritto</h2><p>{E(a.get("sintesi"))}</p></div>' if a.get("sintesi") else ""}
{f'<div class="sect prose"><h2>L&#39;idea centrale</h2><p>{E(a.get("teoria"))}</p></div>' if a.get("teoria") else ""}
<div class="sect"><h2>Nell'archivio</h2><ul class="pubs">{"".join(f'<li><span class="ry">{E(d.get("anno"))}</span> <a href="/schede/{d["id"]}/">{E(d.get("titolo"))}</a></li>' for d in sorted(sue, key=lambda x: str(x.get("anno"))))}</ul></div>
{f'<div class="sect"><h2>Altre opere</h2><ul class="pubs">{"".join(f"<li>{E(o)}</li>" for o in opere)}</ul></div>' if opere else ""}
</article><aside class="side">{f'<div class="box"><h3>Per saperne di più</h3><p><a href="{E(a["url"])}" rel="noopener" target="_blank">Pagina dell&#39;autore ↗</a></p></div>' if a.get("url") else ""}
{f'<div class="box"><h3>Parole chiave</h3><div class="tagchips">{"".join(f"<span>{E(p)}</span>" for p in a.get("paroleChiave", []))}</div></div>' if a.get("paroleChiave") else ""}</aside></div></main>{FOOT}</div>'''
    os.makedirs(OUT + path)
    open(OUT + path + "index.html", "w").write(testa(f"{a.get('nome')} · Ecosystemica", descr(a.get("sintesi") or f"Le ricerche di {a.get('nome')} nell'archivio di Ecosystemica."), path) + "<body>" + BANNER + corpo + "</body></html>")
    sitemap.append((path, OGGI))

# ---------- pagine legali ----------
T = TITOLARE
CHI = f'Questo sito è pubblicato da {E(T["nome"])}, con sede in {E(T["sede"])}, partita IVA {E(T["piva"])}' if T["nome"] else "Questo sito è curato da Ecosystemica, Centro Studi sistemici sulle organizzazioni e il lavoro"
TIT = f'{E(T["nome"])}, {E(T["sede"])}, partita IVA {E(T["piva"])}' if T["nome"] else "Ecosystemica, Centro Studi sistemici sulle organizzazioni e il lavoro"
LEG = {
"note-legali": ("Note legali", f'''<h1>Note legali</h1>
<p>{CHI}. Per scrivere al Centro Studi: <a href="mailto:{E(T["email"])}">{E(T["email"])}</a>.</p>
<h2>I contenuti</h2><p>Le schede dell'archivio sono sintesi originali, scritte in italiano dalla redazione di Ecosystemica a partire dalle pubblicazioni citate, di cui riportano sempre il riferimento completo e, quando esiste, il collegamento alla fonte. Le opere citate restano dei loro autori ed editori. Gli autori citati non sono affiliati al Centro Studi e non ne approvano i contenuti.</p>
<p>Se ritieni che un contenuto leda i tuoi diritti d'autore, scrivi all'indirizzo indicato sopra indicando l'opera e la pagina: verifichiamo ogni segnalazione e, se è fondata, togliamo o correggiamo il contenuto.</p>
<p>I testi originali del sito appartengono a Ecosystemica. Se ne possono citare brevi passaggi indicando la fonte e il collegamento alla pagina.</p>
<h2>Segnalazioni</h2><p>Se trovi un errore in una scheda, una fonte da correggere o un contenuto che ritieni lesivo dei tuoi diritti, scrivi all'indirizzo indicato sopra: la redazione verifica ogni segnalazione.</p>'''),
"privacy": ("Informativa sulla privacy", f'''<h1>Informativa sulla privacy</h1>
<p>Informativa resa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679.</p>
<h2>Titolare del trattamento</h2><p>{TIT}. Contatto: <a href="mailto:{E(T["email"])}">{E(T["email"])}</a>.</p>
<h2>Che cosa raccogliamo</h2><p>Il sito si consulta liberamente, senza registrazione. Non usa cookie di profilazione né strumenti di statistica che tracciano i visitatori, e i caratteri tipografici sono ospitati sul sito stesso, senza richieste a servizi esterni.</p>
<h2>Account e biblioteca personale</h2><p>Chi si iscrive ci affida l'indirizzo email, il nome se lo indica, una password e ciò che salva nella propria biblioteca: schede, autori, ricerche, note e raccolte. Usiamo questi dati solo per gestire l'account e offrire la biblioteca, cioè per eseguire il servizio richiesto (articolo 6, paragrafo 1, lettera b del Regolamento). La password non è mai conservata in chiaro.</p>
<p>Account e biblioteca sono gestiti da Supabase, Inc., che opera come responsabile del trattamento con server nell'Unione europea (Francoforte). Le email di servizio, come la conferma dell'iscrizione e il recupero della password, partono attraverso lo stesso fornitore. Per mantenerti collegato il sito conserva nella memoria del tuo browser un codice di accesso, strettamente necessario al servizio.</p>
<p>I dati restano finché l'account è attivo. Per cancellare l'account e tutto ciò che hai salvato basta scrivere all'indirizzo del titolare: la cancellazione avviene entro trenta giorni.</p>
<p>Come ogni sito web, il servizio di hosting registra in forma tecnica alcune informazioni sulle richieste ricevute, come l'indirizzo IP, la data e l'ora e la pagina richiesta. Servono solo a far funzionare il sito e a proteggerlo da abusi, e sono conservate dal fornitore per il tempo previsto dalle sue condizioni.</p>
<h2>Fornitore di hosting</h2><p>Il sito è ospitato da Cloudflare, Inc., che tratta i dati tecnici come responsabile del trattamento. Cloudflare ha sede negli Stati Uniti: il trasferimento dei dati avviene sulla base delle garanzie previste dal Regolamento, indicate nell'accordo sul trattamento dei dati del fornitore.</p>
<h2>Collegamenti esterni</h2><p>Le schede contengono collegamenti alle pubblicazioni originali su siti di editori, riviste e biblioteche. Quando li apri, quei siti trattano i tuoi dati secondo le proprie informative.</p>
<h2>I tuoi diritti</h2><p>Puoi chiedere in ogni momento l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione o l'opposizione al trattamento scrivendo all'indirizzo del titolare. Puoi anche proporre reclamo al Garante per la protezione dei dati personali.</p>

<p class="rmeta">Ultimo aggiornamento: {OGGI}.</p>'''),
}
for slug_, (tit, testo) in LEG.items():
    path = f"/{slug_}/"; os.makedirs(OUT + path)
    open(OUT + path + "index.html", "w").write(testa(f"{tit} · Ecosystemica", f"{tit} del sito di Ecosystemica.", path) + "<body>" + BANNER + header() + f'<main class="page pg legale"><a class="back" href="/">← La mappa</a>{testo}</main>{FOOT}</div></body></html>')
    sitemap.append((path, OGGI))

open(f"{OUT}/404.html", "w").write(testa("Pagina non trovata · Ecosystemica", "Pagina non trovata.", "/404") + "<body>" + header() + '<main class="page pg legale"><h1>Questa pagina non c&#39;è</h1><p>Forse la scheda ha cambiato indirizzo. Riparti dalla <a href="/">mappa</a> o dall&#39;<a href="/#archivio">archivio</a>.</p></main>' + FOOT + "</div></body></html>")
open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(f"<url><loc>{BASE}{p}</loc><lastmod>{d}</lastmod></url>" for p, d in sitemap) + "\n</urlset>\n")
open(f"{OUT}/robots.txt", "w").write(f"User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n" if LANCIO else "User-agent: *\nDisallow: /\n")
# intestazioni di sicurezza e cache per Cloudflare Pages
open(f"{OUT}/_headers", "w").write("""/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=3600

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
""")
print("pagine scritte:", len(sitemap) + 1)
