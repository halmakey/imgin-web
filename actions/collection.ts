"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { clearCollectionImages } from "./image";

export async function createCollection() {
  const db = getRequestContext().env.DB;

  const id = nanoid();
  const exportId = nanoid();
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO collection (id, export_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
    )
    .bind(id, exportId, now, now)
    .run();

  redirect(`/collection/${id}`);
}

export async function deleteCollection(collectionId: string) {
  const db = getRequestContext().env.DB;

  await Promise.all([
    clearCollectionImages(collectionId),
    db.prepare("DELETE FROM collection WHERE id = ?").bind(collectionId).run(),
  ]);
}

export async function getCollection(collectionId: string) {
  const db = getRequestContext().env.DB;
  const result = await db
    .prepare("SELECT id, export_id, updated_at FROM collection WHERE id = ?")
    .bind(collectionId)
    .first<{ id: string; export_id: string; updated_at: number }>();
  return result;
}

export async function listAllCollections() {
  const db = getRequestContext().env.DB;
  const result = await db
    .prepare(
      "SELECT id, export_id, updated_at FROM collection ORDER BY updated_at DESC",
    )
    .all<{ id: string; updated_at: number }>();
  return result.results;
}
