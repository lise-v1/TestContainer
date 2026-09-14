# Arkivar Driftspanel – Project Hub

Dette er en ren HTML/CSS/JavaScript-side uten rammeverk eller eksterne biblioteker.

## Mappestruktur

```text
TestContainer/
├── index.html                 ← eksisterende Project Hub-startside
├── style.css
└── arkivar-driftspanel/
    ├── index.html
    ├── style.css
    └── app.js
```

## Lenke fra oppstartssiden

Legg denne lenken inn på hovedsidens `index.html`:

```html
<a href="arkivar-driftspanel/">Arkivar Driftspanel</a>
```

Hvis hovedsiden ligger i en annen mappe, bruk riktig relativ sti.

## Statusdata

Statusene i `app.js` er foreløpig eksempeldata. Selve grensesnittet er ekte HTML/CSS/JS og kan senere kobles til faktiske API-/health-endepunkter.
