# Familiemat v43

Familiemat er en mobilvennlig familieapp for middagsplanlegging, oppskrifter, basisvarer, fast handel og handleliste.

## Nytt i v43
- Avkryssede varer samles nederst i handlelisten under en egen overskrift: **Kjøpt**.
- Varer som ikke er kjøpt, vises øverst sortert etter butikkategori og alfabetisk.
- Avkryssing kan angres: varen flyttes tilbake til den vanlige listen.
- Fjerner den tidligere knappen «Fjern kjøpte varer», som ikke oppførte seg pålitelig.
- Kjøpte varer bevares når handlelisten bygges på nytt. Når en ny uke startes, nullstilles kjøpsmarkeringene slik at aktuelle varer kan komme tilbake.
- Oppdaterer app- og service-worker-cache til v42.

## Funksjoner
- Ukeplan med middager og tidligere uker.
- Oppskrifter med ingredienser og porsjoner.
- Handleliste bygget fra ukeplan, basisvarer som går tomme og aktive varer i Fast handel.
- Basisvarer med mulighet for manuell kategorisering.
- Fast handel med mengde, enhet, kategori og aktiv/inaktiv-status.
- Lokal lagring og valgfri familiesynkronisering via Supabase.

## Filer
- `index.html` – app-shell og versjonerte CSS/JS-filer.
- `app.js` – app, lokal lagring, handleliste, synkronisering og brukergrensesnitt.
- `styles.css` – utforming og mobilvisning.
- `manifest.json` – PWA-oppsett.
- `service-worker.js` – cache for appen.
- `fixed-shopping.sql` – Supabase-tabell og policyer for Fast handel.

## Supabase
Hvis appen varsler at tabellen `fixed_shopping` mangler, kjør `fixed-shopping.sql` i Supabase SQL Editor. Ikke legg databasepassord eller secret/service-role keys i klientkoden.


## Feilretting i v43
- Fjernet utdaterte funksjonsreferanser som stoppet JavaScript under oppstart.
- Oppdatert cacheversjon for å sikre at nettleseren laster de nye filene.
