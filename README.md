# Familiemat v25

Familieapp for ukemeny, oppskrifter, handleliste og faste innkjøp.

## Nytt i v25

- Ny fane **Fast handel** for varer familien kjøper jevnlig, men som ikke er basisvarer.
- Eksempler: epler, bananer, miniost, yoghurt og matpakkevarer.
- Hver fast handlevare har navn, mengde, enhet, butikkategori og aktiv/inaktiv-status.
- Aktive faste handlevarer legges automatisk inn i den vanlige handlelisten.
- Like varer fra middag, basisvarer og fast handel slås sammen når navn og enhet passer.
- Faste handlevarer lagres lokalt og synkroniseres via familiens eksisterende Supabase-ukeplan.
- Femfanenavigasjon: Uke, Oppskrifter, Handleliste, Fast handel og Basisvarer.
- Oppdatert service worker/cache til v25.

## Tidligere funksjoner

- Oppskrifter sorteres alfabetisk og kan opprettes, redigeres og slettes.
- Oppskrifter kan importeres fra nettlenke og redigeres før lagring.
- Oppskrifter kan ha aktuelle ukedager og kategorier.
- Foreslå ukemeny krever minst to fiskemiddager og bruker ukehistorikk for variasjon.
- Ny uke arkiverer automatisk forrige uke.
- Basisvarer kan markeres «Går tom» og slettes.
- Handlelisten kategoriseres og sorteres automatisk.
- Familiesynkronisering via Supabase med innlogging og realtime.

## Supabase

Appen bruker Project URL og Publishable key i klienten. Databasepassord og secret/service-role keys skal ikke brukes i klienten.

Fast handel lagres i `week_plans.days` som en del av familieplanen, slik at funksjonen ikke krever en ny Supabase-tabell.
