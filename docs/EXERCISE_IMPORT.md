# Exercise catalog import

Bulk import template for the Trenerka exercise library (trainer catalog).

## Files

| File | Purpose |
|------|---------|
| `frontend/scripts/exercise-import-template.csv` | Column template for spreadsheet import |

## CSV columns

| Column | Required | Description |
|--------|----------|-------------|
| `slug` | yes | Unique id suffix, e.g. `bench-press` → stored as `ex-bench-press` |
| `name_ru` | yes | Russian display name in seed data |
| `muscle` | yes | Muscle group (Russian canonical value): `Грудь`, `Спина`, `Ноги`, `Плечи`, `Руки`, `Кор`, `Кардио` |
| `equipment` | yes | Equipment (Russian): `Штанга`, `Гантели`, `Тренажёр`, `Собственный вес`, `Кабель`, `Резина` |
| `difficulty` | yes | `beginner`, `intermediate`, or `advanced` |
| `steps` | no | Technique steps separated by `\|` (pipe) |
| `imageUrl` | no | Public URL or path under `/exercises/` |

## Example row

```csv
slug,name_ru,muscle,equipment,difficulty,steps,imageUrl
bench-press,Жим лёжа,Грудь,Штанга,intermediate,Лечь на скамью|Опустить штангу|Выжать,
```

## i18n

- Seed data keeps Russian `name_ru` and canonical muscle/equipment values.
- UI translations use `catalog.muscles.*`, `catalog.equipment.*`, and optional `catalog.exercises.{id}.*` keys in locale JSON.
- After adding rows, run `node frontend/scripts/generate-locales.mjs` if you extend locale keys.

## API (mock / future WordPress)

List endpoint supports query parameters:

- `search` — name filter
- `muscle`, `equipment`, `difficulty` — exact filters
- `page`, `limit` — pagination (default limit 20)

Example: `GET /exercises?muscle=Ноги&difficulty=beginner&page=1&limit=20`

## Manual seed (development)

For mock mode, append entries to `frontend/src/lib/mock-data/exercises.ts` using the same `slug` / muscle / equipment conventions as the CSV template.
