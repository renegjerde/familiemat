# Familiemat v79

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Redesignet bunnmenyikonene med tydeligere og mer forskjellige silhuetter: hus, åpen bok, sjekkliste, handlevogn og oppbevaringsglass.
- Fått egne, nøytrale SVG-symboler i bunnmenyen for Uke, Oppskrifter, Handleliste, Fast handel og Basisvarer.
- Basisvarer kan flyttes direkte til Fast handel fra basisvarelisten.
- Endret Oppskrifter-ikonet fra rødt emoji-symbol til et nøytralt ikon som følger aktiv/inaktiv menyfarge.
- Rettet feil der slettede basisvarer kunne komme tilbake fra skydata ved synkronisering.
- Sletting av basisvarer lagres nå også som et navnebasert slettespor, i tillegg til eksisterende ID-baserte slettinger.
- Skyimport filtrerer bort basisvarer som er slettet, slik at de ikke dukker opp igjen etter oppdatering eller synkronisering.
- De uønskede gamle standardvarene «Bleier» og «Kjøkkenpapir» ryddes bort ved oppstart og markeres for sletting i skyen.
- Hvis en vare legges inn manuelt på nytt, oppheves slettemarkeringen for akkurat den varen.
- Ny uke-logikken fra v79 er beholdt: «går tom»-kryss og basisvarer påvirkes ikke av denne rettelsen.
- Oppdatert versjonsnummer, filreferanser og cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Du kan nå lage en ny oppskrift med utgangspunkt i en oppskrift som allerede ligger inne.
- Ingredienser, mengder, enheter, kategorier, porsjoner, fremgangsmåte og lenke kopieres til et nytt redigerbart skjema.
- Den opprinnelige oppskriften endres ikke; den nye varianten lagres som en egen oppskrift.
- Oppdatert versjonsnummer i toppfeltet og cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Etter lagring av en ny eller redigert oppskrift går appen alltid tilbake til oversikten over Oppskrifter.
- Oppskriftslisten vises fra toppen etter lagring, også når skjemaet ble åpnet fra ukeplanen.
- Hvis lokal lagring feiler, blir brukeren varslet og skjemaet lukkes ikke.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Ny importmulighet fra bilde/skjermbilde i Oppskrifter.
- Tekstgjenkjenning på norsk og engelsk fyller ut navn, porsjoner, ingredienser og eventuell fremgangsmåte i et redigerbart skjema.
- Nettimporten er beholdt, og teksttolkingen støtter flere vanlige overskrifter og ingredienslinjer.
- Bilder behandles i nettleseren; Tesseract.js og språkdata lastes fra CDN ved første bruk.
- Oppdatert versjonsmerking og cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Handlelisten sorteres først etter Frukt og grønt, Meieri og egg, Kjøtt og fisk og Pålegg.
- Justert handlelisteknapp/navigasjon for å sikre at den aktiveres som en knapp på mobil.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Menylinjen er stabilt festet nederst i visningen, også ved scrolling.
- PWA-manifestet ber om stående visning på mobil. Merk: iOS Safari kan fortsatt rotere i vanlig nettlesermodus; orienteringslås håndteres best når appen er installert på hjemskjermen.
- Ny kategori «Pålegg» for blant annet skinke, fårepølse, leverpostei, salami og servelat.
- Oppdatert versjonsmerking og cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Rettet feil der oppskrifter med bestemte navn, blant annet «Taco», ble filtrert bort ved innlasting eller skysynkronisering. Oppskrifter og ingredienslister beholdes nå uavhengig av navn.
- Oppdatert versjonsmerking og cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- «Ny uke» bevarer statusen «Går tom» på alle basisvarer. Å starte en ny uke skal ikke fjerne hakene i Basisvarer.
- Når en basisvare krysses av som kjøpt i Handleliste, fjernes fortsatt haken «Går tom» for den aktuelle basisvaren.
- Beholder den fungerende basisvare-synkroniseringen fra v79 og layouten fra de senere versjonene.
- Oppdatert versjonsmerking og cache til v79.


Familiemat er en mobilvennlig familieapp for middagsplanlegging, oppskrifter, basisvarer, fast handel og handleliste.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Fast handel bruker nå samme kompakte kortutforming som Basisvarer.
- Jevnere høyde, avstand, innvendige marger og vertikal justering av avkrysningsboks, varenavn og handlingsknapper.
- Kun visuelle endringer; varedata, kategorier, synkronisering og avkrysningslogikk er urørt.
- Oppdatert cacheversjon til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Mer kompakte lister og kort, med litt mindre vertikal avstand på mobil.
- Sekundærknapper som «Rediger» og «Bytt» er roligere og mindre, mens hovedhandlingene fortsatt er tydelige.
- Skjemaer, kategorioverskrifter og kort følger en jevnere spacing-skala.
- Oppdatert cacheversjon til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Jevnere utforming av knapper, handlingsknapper, kort, lister og skjemafelt på tvers av menyene.
- Mer konsekvent størrelse, høyde, avrunding og avstand på primære og sekundære knapper.
- Kategoriene i nedtrekksmenyene for basisvarer og Fast handel sorteres alfabetisk.
- Handlelistens egen kategorirekkefølge beholdes uendret.
- Oppdatert cacheversjon til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Basisvarers manuelt valgte kategori brukes også i handlelisten og lagres i ukedataene i skyen.
- Kategorivalg bevares når basisvarer synkroniseres, også når databasen ikke har et eget kategorifelt.
- Knappen for å endre basisvarekategori heter nå «Rediger», i tråd med resten av appen.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Avkryssede varer samles nederst i handlelisten under en egen overskrift: **Kjøpt**.
- Varer som ikke er kjøpt, vises øverst sortert etter butikkategori og alfabetisk.
- Avkryssing kan angres: varen flyttes tilbake til den vanlige listen.
- Fjerner den tidligere knappen «Fjern kjøpte varer», som ikke oppførte seg pålitelig.
- Kjøpte varer bevares når handlelisten bygges på nytt. Når en ny uke startes, nullstilles kjøpsmarkeringene slik at aktuelle varer kan komme tilbake.
- Oppdaterer app- og service-worker-cache til v79.

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


## Feilretting i v79
- Fjernet utdaterte funksjonsreferanser som stoppet JavaScript under oppstart.
- Oppdatert cacheversjon for å sikre at nettleseren laster de nye filene.


## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Når «Ny uke» brukes, arkiveres den gamle middagsplanen som forrige kalenderuke, ikke som uken som akkurat har startet.
- Arkiveringsdatoen og ukeetiketten bruker ISO-uken fra sju dager før opprettelsen, også rundt årsskiftet.
- Oppdaterer appversjon, filreferanser og service-worker-cache til v79.

## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Fast handel bruker nå samme kompakte listeavstand og lettere varenavn som Basisvarer.
- Rediger-knappene er justert nærmere samme størrelse og stil.
- Lagt til en diskret versjonsmerking øverst til høyre i appen.
- Oppdatert cacheversjon og filreferanser til v79.


## Nytt i v79
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Basisvarer avkrysses med stabil identifikasjon (vare-ID, eller navn når ID mangler), ikke med en sorteringsavhengig listeindeks.
- Bygger direkte på den fungerende filstrukturen fra v79; øvrig layout og funksjonalitet er beholdt.

- Rettet en oppstartsfeil i v79: appen forsøkte å eksportere den gamle funksjonen `togglePantry`, som ikke lenger fantes. v79 eksporterer `togglePantryByKey` korrekt.


Versjon 61: Registrerings- og innloggingsknappene starter handlingen direkte, og uventede feil fra kontotjenesten vises i en melding. Øvrig appfunksjonalitet og layout er videreført fra v79.


## v79
- Ukemenyen vises fra tirsdag til søndag, med mandag sist, uten å endre de interne dagindeksene.
- Middagsnavnene i ukeplanen kan trykkes på for å åpne oppskriften direkte i appen, med ingredienser og fremgangsmåte.


## v79
- Oppskriftredigering har nå kategorivelger per ingrediens.
- Valgt ingredienskategori følger med til handlelisten, slik at flere varer kan flyttes fra «Annet» til riktig kategori.
- Utvidet automatisk kategorisering for pastinakk og supper/buljong.
