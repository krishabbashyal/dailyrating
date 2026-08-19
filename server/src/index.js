import { resolve } from "node:path";
import { createAppServer } from "./app.js";
import { JsonRatingStore } from "./store.js";

const host = process.env.IP || process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8787);
const dataFile = resolve(process.env.DATA_FILE || "data/ratings.json");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const server = createAppServer({
  store: new JsonRatingStore(dataFile),
  apiToken: process.env.API_TOKEN,
  allowedOrigins,
});

server.listen(port, host, () => {
  console.log(`Daily Rating API listening on http://${host}:${port}`);
  console.log(`Ratings file: ${dataFile}`);
});
