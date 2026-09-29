# Familiemat v22

Familiesynkronisering med Supabase, automatisk lokal lagring og tryggere skysynk.

## Nytt i v22
- Nye oppskrifter og basisvarer får en unik ID lokalt før de sendes til Supabase.
- Dette hindrer `null value in column "id"` ved synkronisering av nye elementer.
- Lokal lagring beholdes som arbeidskopi.
- Synkronisering slår sammen nye lokale og eksisterende skydata i stedet for å slette elementer som mangler lokalt.
- Eksplisitt sletting sendes til skyen.
- Automatisk skysynk etter lokale endringer.
- Ukehistorikk og «Ny uke» med automatisk arkivering.
- «Foreslå ukemeny» med minst to fiskemiddager og variasjon basert på historikk.
- Nettimport av oppskrifter med etterfølgende redigering.
- Oppskriftskategorier og aktuelle ukedager.
- Alfabetisk sortering av oppskrifter og basisvarer.
- Kategorisert handleliste, inkludert forbedret husholdningskategorisering.

## Supabase
Appen bruker Project URL og Publishable key fra Supabase. Databasepassord og secret/service-role keys brukes ikke i klienten.
