"use server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function exportVideo(exportId: string, formData: FormData) {
  const blob = formData.get("data") as Blob;

  const { DATA: data } = getRequestContext().env;
  await data.put(`export/${exportId}/video`, blob, {
    httpMetadata: {
      contentType: blob.type,
    },
  });
}
