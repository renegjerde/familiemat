# Familiemat v21

Familiesynkronisering med tryggere autolagring og sammenslåing av data.

## Nytt i v21
- Endringer lagres umiddelbart lokalt før de sendes til skyen.
- Oppskrifter og basisvarer synkroniseres automatisk i bakgrunnen.
- Nye lokale oppskrifter/basisvarer blir slått sammen med skydata.
- «Synkroniser nå» sender lokale endringer først og henter deretter skydata.
- Manglende lokale oppskrifter/basisvarer brukes ikke lenger som grunnlag for sletting i skyen.
- Eksplisitte slettinger markeres og synkroniseres separat.
- Realtime-oppdateringer kan hente nye elementer fra andre enheter uten å overskrive lokale, usynkroniserte nyopprettede elementer.
- Service-worker/cache er oppdatert til v21.


# Familiemat v20

Familie-synkronisering med Supabase, ukemenyforslag og automatisk ukehistorikk.

## Nytt i v20
- Innlogging og registrering med e-post/passord via Supabase Auth.
- Opprett familie og få en familiekode.
- Bli med i eksisterende familie med familiekode.
- Oppskrifter, basisvarer, ukeplan og handleliste synkroniseres til skyen.
- Realtime-oppdatering mellom familiens telefoner.
- Eksisterende lokale data kan migreres til familien når første bruker oppretter familien.
- Fortsatt lokal lagring som arbeidskopi i nettleseren.
- Oppskrifter kan redigeres og fjernes.
- Oppskrifter kan merkes med aktuelle ukedager og flere kategorier.
- Oppskrifter fra nettlenke kan importeres og redigeres før lagring.
- Oppskrifter vises alfabetisk.
- Basisvarer vises alfabetisk og kan slettes.
- Handlelisten grupperes etter butikkategori og sorteres alfabetisk.
- Husholdningsvarer som kjøkkenpapir, toalettpapir, vaskemiddel, plastfolie og lignende plasseres i Husholdning.
- Middager kan fjernes fra ukeplanen uten å slette oppskriften.
- «Ny uke» arkiverer automatisk den aktive ukeplanen før den tømmes.
- Ukehistorikken brukes som grunnlag for mer variasjon i nye menyforslag.
- «Foreslå ukemeny» forsøker å gi minst to ulike fiskemiddager, respektere aktuelle ukedager og unngå nylig brukte retter når det finnes nok alternativer.

## Ukehistorikk
Når «Ny uke» brukes, lagres den aktive ukeplanen i historikken før den nye uken startes. Historikken kan brukes av menyforslaget for å unngå at ukene blir for like.

## Supabase
Appen bruker Project URL og Publishable key fra Supabase-prosjektet. Databasepassord og secret/service-role keys brukes ikke i klienten.

For familiesynkronisering må følgende tabeller være tilgjengelige i Supabase:
- `recipes`
- `pantry`
- `week_plans`
- `families`
- `family_members`

Realtime bør være aktivert for `recipes`, `pantry` og `week_plans`.

## Versjon
v21
