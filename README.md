# 🍲 Familiemat v28

Familiesynkronisering med Supabase, autosave og tryggere deling av alle familie-data.

## Nytt i v28
- Faste handlevarer har egen Supabase-tabell og synkroniseres automatisk mellom enheter.
- Faste handlevarer får lokal autosave, skybackup, realtime-oppdatering og eksplisitt sletting.
- Ukeplan og handleliste synkroniseres automatisk som før, med lokal tidsstempelmarkør slik at nyere lokale endringer ikke overskrives av eldre skydata.
- Oppskrifter og basisvarer beholder samme autosave/synkroniseringsmodell.
- Nye faste handlevarer får ID lokalt før de sendes til skyen.
- Handlelisten bygges fortsatt automatisk fra middager, basisvarer som går tomme og aktive faste handlevarer.

## Supabase
Hvis appen viser at `fixed_shopping` mangler, kjør `fixed-shopping.sql` i Supabase SQL Editor. SQL-filen er gjort idempotent og ber PostgREST laste inn skjemaet på nytt. Appen fortsetter å fungere selv om tabellen ikke er opprettet ennå, men Fast handel kan ikke synkroniseres før tabellen finnes.

Kjør `fixed-shopping.sql` én gang i Supabase SQL Editor. Den oppretter tabellen `fixed_shopping`, RLS-policyer og aktiverer Realtime.

Appen bruker Project URL og Publishable key. Databasepassord og secret/service-role keys skal ikke legges i klienten.

## Filer
- `index.html` – app-shell og versjonert cache
- `app.js` – app, lokal lagring, synkronisering og UI
- `styles.css` – mobil-first design
- `manifest.json` – PWA
- `service-worker.js` – cache
- `fixed-shopping.sql` – Supabase-migrering for faste handlevarer
