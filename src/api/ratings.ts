import type { RatingLog } from "../data/ratings";

const API_URL = "https://dailyratingforbuzz.alwaysdata.net";
const TOKEN_STORAGE_KEY = "daily-rating-api-token";

interface RatingsResponse {
  version: number;
  ratings: RatingLog[];
}

async function apiRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        authorization: `Bearer ${token}`,
        ...(options?.body ? { "content-type": "application/json" } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error("Could not reach the rating service. Check your connection and try again.");
  }

  if (response.status === 401) {
    throw new Error("That access key was not accepted.");
  }

  if (!response.ok) {
    throw new Error("The rating service is unavailable right now.");
  }

  return response.json() as Promise<T>;
}

export function getStoredApiToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeApiToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearApiToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function getRatings(token: string) {
  const data = await apiRequest<RatingsResponse>("/api/ratings", token);
  return data.ratings;
}

export async function saveRating(token: string, rating: RatingLog) {
  return apiRequest<RatingLog>("/api/ratings", token, {
    method: "POST",
    body: JSON.stringify(rating),
  });
}
