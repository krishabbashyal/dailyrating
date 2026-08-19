import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { createAppServer } from "../src/app.js";
import { JsonRatingStore } from "../src/store.js";

const TOKEN = "test-token";
const ORIGIN = "https://krishabbashyal.github.io";
let directory;
let server;
let baseUrl;

before(async () => {
  directory = await mkdtemp(join(tmpdir(), "dailyrating-server-"));
  server = createAppServer({
    store: new JsonRatingStore(join(directory, "ratings.json")),
    apiToken: TOKEN,
    allowedOrigins: [ORIGIN],
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await rm(directory, { recursive: true, force: true });
});

test("health endpoint is public", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("ratings require authentication", async () => {
  const response = await fetch(`${baseUrl}/api/ratings`);
  assert.equal(response.status, 401);
});

test("rejects unapproved browser origins", async () => {
  const response = await fetch(`${baseUrl}/api/ratings`, {
    headers: { authorization: `Bearer ${TOKEN}`, origin: "https://example.com" },
  });
  assert.equal(response.status, 403);
});

test("creates, reads, and updates a daily rating", async () => {
  const headers = {
    authorization: `Bearer ${TOKEN}`,
    "content-type": "application/json",
    origin: ORIGIN,
  };

  const created = await fetch(`${baseUrl}/api/ratings`, {
    method: "POST",
    headers,
    body: JSON.stringify({ date: "2026-08-19", score: 8, note: "Good day" }),
  });
  assert.equal(created.status, 201);
  assert.equal(created.headers.get("access-control-allow-origin"), ORIGIN);

  const updated = await fetch(`${baseUrl}/api/ratings`, {
    method: "POST",
    headers,
    body: JSON.stringify({ date: "2026-08-19", score: 9 }),
  });
  assert.equal(updated.status, 200);

  const response = await fetch(`${baseUrl}/api/ratings`, { headers });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    version: 1,
    ratings: [{ date: "2026-08-19", score: 9 }],
  });

  const onDisk = JSON.parse(await readFile(join(directory, "ratings.json"), "utf8"));
  assert.deepEqual(onDisk.ratings, [{ date: "2026-08-19", score: 9 }]);
});

test("validates rating input", async () => {
  const response = await fetch(`${baseUrl}/api/ratings`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ date: "2026-02-30", score: 11 }),
  });

  assert.equal(response.status, 400);
});
