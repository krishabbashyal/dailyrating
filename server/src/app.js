import { createServer as createHttpServer } from "node:http";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_BODY_BYTES = 16_384;
const MAX_NOTE_LENGTH = 2_000;

function sendJson(response, status, body, extraHeaders = {}) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...extraHeaders,
  });
  response.end(`${JSON.stringify(body)}\n`);
}

function corsHeaders(origin, allowedOrigins) {
  if (!origin || !allowedOrigins.has(origin)) return {};

  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "authorization, content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large");
      error.status = 413;
      throw error;
    }
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Request body must be valid JSON");
    error.status = 400;
    throw error;
  }
}

function normalizeRating(body) {
  const keys = body && typeof body === "object" ? Object.keys(body) : [];
  if (!body || Array.isArray(body) || keys.some((key) => !["date", "score", "note"].includes(key))) {
    throw new Error("Expected a rating with date, score, and optional note");
  }

  const dateMatch = typeof body.date === "string" ? DATE_PATTERN.exec(body.date) : null;
  const [year, month, day] = dateMatch ? body.date.split("-").map(Number) : [];
  const parsedDate = dateMatch ? new Date(Date.UTC(year, month - 1, day)) : null;
  const isValidDate = parsedDate
    && parsedDate.getUTCFullYear() === year
    && parsedDate.getUTCMonth() === month - 1
    && parsedDate.getUTCDate() === day;

  if (!isValidDate) {
    throw new Error("date must use YYYY-MM-DD format");
  }

  if (!Number.isInteger(body.score) || body.score < 1 || body.score > 10) {
    throw new Error("score must be an integer from 1 to 10");
  }

  if (body.note !== undefined && (typeof body.note !== "string" || body.note.length > MAX_NOTE_LENGTH)) {
    throw new Error(`note must be a string no longer than ${MAX_NOTE_LENGTH} characters`);
  }

  return {
    date: body.date,
    score: body.score,
    ...(body.note?.trim() ? { note: body.note.trim() } : {}),
  };
}

export function createAppServer({ store, apiToken, allowedOrigins }) {
  if (!apiToken) throw new Error("API_TOKEN is required");

  const origins = new Set(allowedOrigins);

  return createHttpServer(async (request, response) => {
    const origin = request.headers.origin;
    const headers = corsHeaders(origin, origins);

    if (origin && !origins.has(origin)) {
      return sendJson(response, 403, { error: "Origin is not allowed" });
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204, headers);
      return response.end();
    }

    if (request.method === "GET" && request.url === "/health") {
      return sendJson(response, 200, { status: "ok" }, headers);
    }

    if (request.headers.authorization !== `Bearer ${apiToken}`) {
      return sendJson(response, 401, { error: "Unauthorized" }, {
        ...headers,
        "www-authenticate": "Bearer",
      });
    }

    try {
      if (request.method === "GET" && request.url === "/api/ratings") {
        const data = await store.read();
        return sendJson(response, 200, data, headers);
      }

      if (request.method === "POST" && request.url === "/api/ratings") {
        const rating = normalizeRating(await readJsonBody(request));
        const result = await store.upsert(rating);
        return sendJson(response, result.created ? 201 : 200, result.rating, headers);
      }

      return sendJson(response, 404, { error: "Not found" }, headers);
    } catch (error) {
      if (error.status) {
        return sendJson(response, error.status, { error: error.message }, headers);
      }

      if (error.message?.startsWith("Expected") || error.message?.startsWith("date") || error.message?.startsWith("score") || error.message?.startsWith("note")) {
        return sendJson(response, 400, { error: error.message }, headers);
      }

      console.error(error);
      return sendJson(response, 500, { error: "Internal server error" }, headers);
    }
  });
}
