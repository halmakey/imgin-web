"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { nanoid } from "nanoid";

export async function createCollection() {
  const db = getRequestContext().env.DB;

  const id = nanoid();
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO collections (id, created_at, updated_at) VALUES (?, ?, ?)",
    )
    .bind(id, now, now)
    .run();
  return { collectionId: id };
}
