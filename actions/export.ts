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

export async function deleteExport(exportId: string) {
  const { DATA: data } = getRequestContext().env;
  await data
    .delete(`export/${exportId}/video`)
    .catch((err) => console.warn(err));
}

export async function hasExport(exportId: string) {
  const { DATA: data } = getRequestContext().env;
  const response = await data.head(`export/${exportId}/video`);
  return !!response;
}
