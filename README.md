# Familiemat v57

Familiemat er en mobilvennlig familieapp for middagsplanlegging, oppskrifter, basisvarer, fast handel og handleliste.

## Nytt i v47
- Fast handel bruker nå samme kompakte kortutforming som Basisvarer.
- Jevnere høyde, avstand, innvendige marger og vertikal justering av avkrysningsboks, varenavn og handlingsknapper.
- Kun visuelle endringer; varedata, kategorier, synkronisering og avkrysningslogikk er urørt.
- Oppdatert cacheversjon til v47.

## Nytt i v46
- Mer kompakte lister og kort, med litt mindre vertikal avstand på mobil.
- Sekundærknapper som «Rediger» og «Bytt» er roligere og mindre, mens hovedhandlingene fortsatt er tydelige.
- Skjemaer, kategorioverskrifter og kort følger en jevnere spacing-skala.
- Oppdatert cacheversjon til v46.

## Nytt i v45
- Jevnere utforming av knapper, handlingsknapper, kort, lister og skjemafelt på tvers av menyene.
- Mer konsekvent størrelse, høyde, avrunding og avstand på primære og sekundære knapper.
- Kategoriene i nedtrekksmenyene for basisvarer og Fast handel sorteres alfabetisk.
- Handlelistens egen kategorirekkefølge beholdes uendret.
- Oppdatert cacheversjon til v45.

## Nytt i v44
- Basisvarers manuelt valgte kategori brukes også i handlelisten og lagres i ukedataene i skyen.
- Kategorivalg bevares når basisvarer synkroniseres, også når databasen ikke har et eget kategorifelt.
- Knappen for å endre basisvarekategori heter nå «Rediger», i tråd med resten av appen.

## Nytt i v43
- Avkryssede varer samles nederst i handlelisten under en egen overskrift: **Kjøpt**.
- Varer som ikke er kjøpt, vises øverst sortert etter butikkategori og alfabetisk.
- Avkryssing kan angres: varen flyttes tilbake til den vanlige listen.
- Fjerner den tidligere knappen «Fjern kjøpte varer», som ikke oppførte seg pålitelig.
- Kjøpte varer bevares når handlelisten bygges på nytt. Når en ny uke startes, nullstilles kjøpsmarkeringene slik at aktuelle varer kan komme tilbake.
- Oppdaterer app- og service-worker-cache til v44.

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


## Nytt i v52
- Når «Ny uke» brukes, arkiveres den gamle middagsplanen som forrige kalenderuke, ikke som uken som akkurat har startet.
- Arkiveringsdatoen og ukeetiketten bruker ISO-uken fra sju dager før opprettelsen, også rundt årsskiftet.
- Oppdaterer appversjon, filreferanser og service-worker-cache til v52.

## Nytt i v50
- Fast handel bruker nå samme kompakte listeavstand og lettere varenavn som Basisvarer.
- Rediger-knappene er justert nærmere samme størrelse og stil.
- Lagt til en diskret versjonsmerking øverst til høyre i appen.
- Oppdatert cacheversjon og filreferanser til v50.


## Nytt i v57
- Basisvarer avkrysses med stabil identifikasjon (vare-ID, eller navn når ID mangler), ikke med en sorteringsavhengig listeindeks.
- Bygger direkte på den fungerende filstrukturen fra v52; øvrig layout og funksjonalitet er beholdt.

- Rettet en oppstartsfeil i v55: appen forsøkte å eksportere den gamle funksjonen `togglePantry`, som ikke lenger fantes. v57 eksporterer `togglePantryByKey` korrekt.
