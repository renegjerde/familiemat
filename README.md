# CM Mobile v2.23 — Matchday commentary and goal celebrations

## Changes in v2.23
- Match commentary now names the involved player for shots/chances, goals, yellow cards, second-yellow dismissals, direct red cards and injuries.
- Chance commentary differentiates between dangerous opportunities, shots on target and efforts off target, and can mention the player who created the chance.
- Goal commentary uses the scorer and, when available, the assister.
- When a goal is scored, the match panel, headline and commentary flash five times in the scoring club's primary colour. Team colours are mapped for a range of clubs; other clubs receive a deterministic fallback colour.
- Quiet-minute narrative text no longer overwrites commentary for a match event. Half-time handling still triggers normally.

## Files
- `index.html` — playable game.
- `README.md` — version notes.

## Validation
- Inline JavaScript syntax checked with Node.js.
- ZIP integrity checked after packaging.
- Full browser and multi-match testing remains necessary to verify event pacing and visual behaviour on mobile devices.
