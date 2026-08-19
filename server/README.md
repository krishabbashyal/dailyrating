# Daily Rating API

Small, dependency-free Node.js API that persists one rating per day in a JSON file.

## Run locally

Requires Node.js 20 or newer.

```bash
API_TOKEN=change-me npm start
```

The API listens on `127.0.0.1:8787` by default and stores data in `data/ratings.json`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `API_TOKEN` | Yes | Secret expected in the `Authorization: Bearer …` header. |
| `IP` or `HOST` | On Alwaysdata | Bind address supplied by Alwaysdata. |
| `PORT` | On Alwaysdata | Port supplied by Alwaysdata. Defaults to `8787` locally. |
| `DATA_FILE` | No | Absolute or working-directory-relative JSON file path. |
| `ALLOWED_ORIGINS` | No | Comma-separated browser origins permitted by CORS. |

## Endpoints

- `GET /health` — public health check.
- `GET /api/ratings` — returns all stored ratings.
- `POST /api/ratings` — creates or replaces the rating for a date.

Example request body:

```json
{
  "date": "2026-08-19",
  "score": 8,
  "note": "Good day"
}
```

## Alwaysdata configuration

1. Upload or clone this repository into your Alwaysdata home directory.
2. In **Web → Sites**, create a **Node.js** site.
3. Set the working directory to the repository's `server` directory.
4. Set the command to `node src/index.js` and select Node.js 20 or newer.
5. Configure these environment variables:

```text
API_TOKEN=<a long random value>
DATA_FILE=/home/<account>/dailyrating-data/ratings.json
ALLOWED_ORIGINS=https://krishabbashyal.github.io
NODE_ENV=production
```

Generate the token locally with `openssl rand -hex 32`. Do not commit it to Git or place it in the public React bundle; the frontend will ask for it once and retain it only on the phone.

Alwaysdata supplies `IP` and `PORT`; the server reads both automatically. Keep the data directory outside the Git checkout so deployments cannot overwrite it.
