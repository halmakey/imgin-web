"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { nanoid } from "nanoid";

export async function addImage(
  {
    collectionId,
    index,
    width,
    height,
  }: {
    collectionId: string;
    index: number;
    width: number;
    height: number;
  },
  formData: FormData,
) {
  const db = getRequestContext().env.DB;
  const data = getRequestContext().env.DATA;

  const blob = formData.get("data") as Blob;

  const imageId = nanoid();
  const now = Date.now();

  await Promise.all([
    db
      .prepare(
        "INSERT INTO collection_image (id, collection_id, image_index, width, height, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(imageId, collectionId, index, width, height, now, now)
      .run(),
    data.put(`collection/${collectionId}/image/${imageId}`, blob, {
      httpMetadata: { contentType: blob.type },
    }),
  ]);

  return { imageId };
}

export async function deleteImage(collectionId: string, imageId: string) {
  const db = getRequestContext().env.DB;
  const data = getRequestContext().env.DATA;

  const otherImages = await listImagesForCollection(collectionId);
  let index = otherImages.findIndex((image) => image.id === imageId);
  if (index === -1) {
    index = Infinity;
  }
  const updateIndexImages = otherImages.slice(index + 1);

  await Promise.all([
    db.batch([
      db.prepare("DELETE FROM collection_image WHERE id = ?").bind(imageId),
      ...updateIndexImages.map((image) =>
        db
          .prepare("UPDATE collection_image SET image_index = ? WHERE id = ?")
          .bind(image.image_index - 1, image.id),
      ),
    ]),
    data.delete(`collection/${collectionId}/image/${imageId}`).catch((err) => {
      console.warn(err);
    }),
  ]);
}

export async function clearCollectionImages(collectionId: string) {
  const db = getRequestContext().env.DB;
  const data = getRequestContext().env.DATA;

  const images = await listImagesForCollection(collectionId);

  await Promise.all(
    images.map(({ id }) =>
      Promise.all([
        db.prepare("DELETE FROM collection_image WHERE id = ?").bind(id).run(),
        data.delete(`collection/${collectionId}/image/${id}`).catch((err) => {
          console.warn(err);
        }),
      ]),
    ),
  );
}

export async function listImagesForCollection(collectionId: string) {
  const db = getRequestContext().env.DB;
  const result = await db
    .prepare(
      "SELECT id, collection_id, image_index, width, height, updated_at FROM collection_image WHERE collection_id = ? ORDER BY image_index, updated_at",
    )
    .bind(collectionId)
    .all<{
      id: string;
      collection_id: string;
      image_index: number;
      width: number;
      height: number;
      updated_at: number;
    }>();
  return result.results;
}
