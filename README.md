# Ecosystemica

Sito pubblico di **Ecosystemica · Centro studi sistemici sulle organizzazioni e il lavoro** (ecosystemica.it).

Il sito è statico. I contenuti nascono nella redazione privata (le schede approvate, gli autori, le analogie in natura, il vocabolario dei concetti) e vengono esportati qui.

- `public/` è il sito pronto, pubblicato da Cloudflare Pages così com'è (cartella di output: `public`, nessun comando di build).
- `src/` contiene l'interfaccia (stili, struttura della pagina, codice della mappa e dell'archivio), i caratteri e d3.
- `strumenti/pub.py` costruisce `public/` da un'esportazione della redazione:
  `python3 strumenti/pub.py <cartella export> public` (anteprima, non indicizzata)
  `python3 strumenti/pub.py <cartella export> public --lancio` (sito pubblico, indicizzabile)

Prima del lancio vanno completati i dati del titolare in `strumenti/pub.py`.
