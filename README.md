# Familiemat v88 – nullstill kjøpt-status ved ny uke

## Nytt i v88
- Når «Ny uke» bekreftes, nullstilles alle kjøpt-avkryssinger fra den aktive handlelisten.
- Nullstillingen lagres i den separate synkroniseringstabellen, slik at alle enheter får samme nye handlelisterunde.
- Statusen «Går tom» for basisvarer beholdes uendret.
- Løsningen fungerer også når flere nye ukemenyer opprettes i samme kalenderuke.

# Familiemat v87 – robust avkryssingssynkronisering

## Viktig før publisering
1. Åpne Supabase-prosjektet og kjør hele filen `check-state.sql` én gang i **SQL Editor**. Dette oppretter den nye avkryssingstabellen, sikker tilgang for familiemedlemmer, en atomisk lagringsfunksjon, Realtime og importerer eksisterende avkryssinger fra de gamle tabellene.
2. Publiser appfilene fra ZIP-arkivet til GitHub Pages. **Ikke last opp `check-state.sql` som en nettsidefil** – den skal kjøres i Supabase.
3. Oppdater Familiemat på alle telefoner/nettbrett til v87. Enheter som fortsatt bruker eldre appkode kan skrive gamle statusverdier tilbake til de gamle feltene.
4. Åpne appen på hver enhet mens den er på nett. Under Familie vises synkroniseringsstatus øverst. Bruk «Synkroniser nå» etter SQL-oppdateringen dersom statusen fortsatt viser at databaseoppdatering kreves.

## Hva v87 endrer
- Avkryssing i Basisvarer, Handlelisten og Fast handel lagres som separate, individuelle rader i `family_item_checks`.
- Databasen bruker en atomisk «nyeste endring vinner»-funksjon med tidsstempel og stabil enhets-ID. Samtidige eller forsinkede forespørsler skal ikke overskrive en nyere avkryssing.
- Avkryssinger lagres umiddelbart lokalt og legges i en ventende kø dersom enheten er offline. Køen sendes automatisk når forbindelsen kommer tilbake.
- Realtime oppdaterer andre enheter. Appen henter også status på nytt når den kommer tilbake i forgrunnen.
- Toppfeltet viser om appen er synkronisert, venter, er frakoblet eller mangler databaseoppdateringen.
- Eksisterende avkryssinger importeres av SQL-skriptet fra `pantry.low`, `week_plans.days.shopping` og `fixed_shopping.active`.

# Familiemat v86

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
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
- Ny uke-logikken fra v86 er beholdt: «går tom»-kryss og basisvarer påvirkes ikke av denne rettelsen.
- Oppdatert versjonsnummer, filreferanser og cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Du kan nå lage en ny oppskrift med utgangspunkt i en oppskrift som allerede ligger inne.
- Ingredienser, mengder, enheter, kategorier, porsjoner, fremgangsmåte og lenke kopieres til et nytt redigerbart skjema.
- Den opprinnelige oppskriften endres ikke; den nye varianten lagres som en egen oppskrift.
- Oppdatert versjonsnummer i toppfeltet og cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Etter lagring av en ny eller redigert oppskrift går appen alltid tilbake til oversikten over Oppskrifter.
- Oppskriftslisten vises fra toppen etter lagring, også når skjemaet ble åpnet fra ukeplanen.
- Hvis lokal lagring feiler, blir brukeren varslet og skjemaet lukkes ikke.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Ny importmulighet fra bilde/skjermbilde i Oppskrifter.
- Tekstgjenkjenning på norsk og engelsk fyller ut navn, porsjoner, ingredienser og eventuell fremgangsmåte i et redigerbart skjema.
- Nettimporten er beholdt, og teksttolkingen støtter flere vanlige overskrifter og ingredienslinjer.
- Bilder behandles i nettleseren; Tesseract.js og språkdata lastes fra CDN ved første bruk.
- Oppdatert versjonsmerking og cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Handlelisten sorteres først etter Frukt og grønt, Meieri og egg, Kjøtt og fisk og Pålegg.
- Justert handlelisteknapp/navigasjon for å sikre at den aktiveres som en knapp på mobil.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Menylinjen er stabilt festet nederst i visningen, også ved scrolling.
- PWA-manifestet ber om stående visning på mobil. Merk: iOS Safari kan fortsatt rotere i vanlig nettlesermodus; orienteringslås håndteres best når appen er installert på hjemskjermen.
- Ny kategori «Pålegg» for blant annet skinke, fårepølse, leverpostei, salami og servelat.
- Oppdatert versjonsmerking og cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Rettet feil der oppskrifter med bestemte navn, blant annet «Taco», ble filtrert bort ved innlasting eller skysynkronisering. Oppskrifter og ingredienslister beholdes nå uavhengig av navn.
- Oppdatert versjonsmerking og cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- «Ny uke» bevarer statusen «Går tom» på alle basisvarer. Å starte en ny uke skal ikke fjerne hakene i Basisvarer.
- Når en basisvare krysses av som kjøpt i Handleliste, fjernes fortsatt haken «Går tom» for den aktuelle basisvaren.
- Beholder den fungerende basisvare-synkroniseringen fra v86 og layouten fra de senere versjonene.
- Oppdatert versjonsmerking og cache til v86.


Familiemat er en mobilvennlig familieapp for middagsplanlegging, oppskrifter, basisvarer, fast handel og handleliste.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Fast handel bruker nå samme kompakte kortutforming som Basisvarer.
- Jevnere høyde, avstand, innvendige marger og vertikal justering av avkrysningsboks, varenavn og handlingsknapper.
- Kun visuelle endringer; varedata, kategorier, synkronisering og avkrysningslogikk er urørt.
- Oppdatert cacheversjon til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Mer kompakte lister og kort, med litt mindre vertikal avstand på mobil.
- Sekundærknapper som «Rediger» og «Bytt» er roligere og mindre, mens hovedhandlingene fortsatt er tydelige.
- Skjemaer, kategorioverskrifter og kort følger en jevnere spacing-skala.
- Oppdatert cacheversjon til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Jevnere utforming av knapper, handlingsknapper, kort, lister og skjemafelt på tvers av menyene.
- Mer konsekvent størrelse, høyde, avrunding og avstand på primære og sekundære knapper.
- Kategoriene i nedtrekksmenyene for basisvarer og Fast handel sorteres alfabetisk.
- Handlelistens egen kategorirekkefølge beholdes uendret.
- Oppdatert cacheversjon til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Basisvarers manuelt valgte kategori brukes også i handlelisten og lagres i ukedataene i skyen.
- Kategorivalg bevares når basisvarer synkroniseres, også når databasen ikke har et eget kategorifelt.
- Knappen for å endre basisvarekategori heter nå «Rediger», i tråd med resten av appen.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Avkryssede varer samles nederst i handlelisten under en egen overskrift: **Kjøpt**.
- Varer som ikke er kjøpt, vises øverst sortert etter butikkategori og alfabetisk.
- Avkryssing kan angres: varen flyttes tilbake til den vanlige listen.
- Fjerner den tidligere knappen «Fjern kjøpte varer», som ikke oppførte seg pålitelig.
- Kjøpte varer bevares når handlelisten bygges på nytt. Når en ny uke startes, nullstilles kjøpsmarkeringene slik at aktuelle varer kan komme tilbake.
- Oppdaterer app- og service-worker-cache til v86.

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


## Feilretting i v86
- Fjernet utdaterte funksjonsreferanser som stoppet JavaScript under oppstart.
- Oppdatert cacheversjon for å sikre at nettleseren laster de nye filene.


## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Når «Ny uke» brukes, arkiveres den gamle middagsplanen som forrige kalenderuke, ikke som uken som akkurat har startet.
- Arkiveringsdatoen og ukeetiketten bruker ISO-uken fra sju dager før opprettelsen, også rundt årsskiftet.
- Oppdaterer appversjon, filreferanser og service-worker-cache til v86.

## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Fast handel bruker nå samme kompakte listeavstand og lettere varenavn som Basisvarer.
- Rediger-knappene er justert nærmere samme størrelse og stil.
- Lagt til en diskret versjonsmerking øverst til høyre i appen.
- Oppdatert cacheversjon og filreferanser til v86.


## Nytt i v86
- Automatisk deduplisering av Basisvarer basert på normalisert varenavn ved lokal lasting og etter skysynkronisering.
- Eksisterende duplikate sky-rader markeres for sletting; én rad beholdes og «Går tom»-status bevares dersom noen duplikater var avkrysset.
- Hindrer at samme basisvare legges til flere ganger med ulik bruk av store/små bokstaver eller ekstra mellomrom.
- Rettet kategoriredigering fra Basisvarer: samme felles kategori-overstyring brukes nå fra Basisvarer og Handlelisten.
- Kategorivalg fra Basisvarer, Handlelisten og Fast handel oppdaterer alle matchende kilder og synkroniseres som én vareoverstyring.
- Rettet lagring av manuelle kategorivalg med tidsstempel og synkronisering til week_plans, slik at egendefinerte kategorier ikke settes tilbake av automatisk kategorisering.
- Kategorivalg deles nå mellom enheter i familien og gjelder på tvers av oppskrifter, basisvarer, Fast handel og handlelisten.
- Handlelisten har fått tre-prikker-meny på hver vare, også kjøpte varer, med mulighet for å endre kategori.
- Kategorivalg lagres som et felles vareoverstyringsvalg og skrives tilbake til alle matchende kilder: oppskrifter, basisvarer og Fast handel.
- La til kategoriene Personlig pleie og Snacks og godteri, og forbedret automatisk kategorisering av blant annet syltetøy, sellerirot, lasagne, sjokolade, smårettskinke og tannkrem.
- Automatisk kategorivask av handlelisten, inkludert allerede kjøpte varer, basisvarer og faste handlevarer.
- Oppskriftsingredienser kategoriseres nå ut fra ingrediensnavnet i stedet for eventuell utdatert kategorimerking i oppskriften.
- Utvidet kategorigjenkjenning for squash, potetbåter, olivenolje og bakeark.
- Ukemenyen bruker nå tre-prikker-meny på middagskortene med valgene «Bytt middag» og «Fjern fra ukemenyen».
- Fast handel har fått samme tre-prikker-meny som Basisvarer, med valg for redigering, flytting til Basisvarer og sletting.
- Flytting fra Fast handel til Basisvarer bevarer navn og kategori og fjerner varen fra Fast handel.
- Samlet handlingene for basisvarer i en kompakt tre-prikker-meny: rediger kategori, flytt til Fast handel og slett.
- Basisvarer avkrysses med stabil identifikasjon (vare-ID, eller navn når ID mangler), ikke med en sorteringsavhengig listeindeks.
- Bygger direkte på den fungerende filstrukturen fra v86; øvrig layout og funksjonalitet er beholdt.

- Rettet en oppstartsfeil i v86: appen forsøkte å eksportere den gamle funksjonen `togglePantry`, som ikke lenger fantes. v86 eksporterer `togglePantryByKey` korrekt.


Versjon 61: Registrerings- og innloggingsknappene starter handlingen direkte, og uventede feil fra kontotjenesten vises i en melding. Øvrig appfunksjonalitet og layout er videreført fra v86.


## v86
- Ukemenyen vises fra tirsdag til søndag, med mandag sist, uten å endre de interne dagindeksene.
- Middagsnavnene i ukeplanen kan trykkes på for å åpne oppskriften direkte i appen, med ingredienser og fremgangsmåte.


## v86
- Oppskriftredigering har nå kategorivelger per ingrediens.
- Valgt ingredienskategori følger med til handlelisten, slik at flere varer kan flyttes fra «Annet» til riktig kategori.
- Utvidet automatisk kategorisering for pastinakk og supper/buljong.
