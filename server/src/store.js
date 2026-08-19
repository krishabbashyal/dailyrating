import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const EMPTY_DATA = Object.freeze({ version: 1, ratings: [] });

function isStoredRating(value) {
  return value
    && typeof value === "object"
    && typeof value.date === "string"
    && Number.isInteger(value.score)
    && value.score >= 1
    && value.score <= 10
    && (value.note === undefined || typeof value.note === "string");
}

function validateData(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.ratings) || !value.ratings.every(isStoredRating)) {
    throw new Error("Ratings data file has an invalid structure");
  }

  return value;
}

export class JsonRatingStore {
  #filePath;
  #writeQueue = Promise.resolve();

  constructor(filePath) {
    this.#filePath = filePath;
  }

  async read() {
    try {
      const contents = await readFile(this.#filePath, "utf8");
      return validateData(JSON.parse(contents));
    } catch (error) {
      if (error.code === "ENOENT") {
        return structuredClone(EMPTY_DATA);
      }

      throw error;
    }
  }

  upsert(rating) {
    const operation = this.#writeQueue.then(async () => {
      const data = await this.read();
      const existingIndex = data.ratings.findIndex((entry) => entry.date === rating.date);

      if (existingIndex === -1) {
        data.ratings.push(rating);
      } else {
        data.ratings[existingIndex] = rating;
      }

      data.ratings.sort((a, b) => a.date.localeCompare(b.date));
      await this.#write(data);

      return { rating, created: existingIndex === -1 };
    });

    this.#writeQueue = operation.catch(() => {});
    return operation;
  }

  async #write(data) {
    const directory = dirname(this.#filePath);
    const temporaryPath = `${this.#filePath}.${process.pid}.tmp`;

    await mkdir(directory, { recursive: true });
    await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    await rename(temporaryPath, this.#filePath);
  }
}
