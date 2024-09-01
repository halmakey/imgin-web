"use server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function putExport(exportId: string, formData: FormData) {
  const video = formData.get("video") as Blob;
  const json = formData.get("json") as string;

  const { DATA: data } = getRequestContext().env;

  await Promise.all([
    data.put(`export/${exportId}/video`, video, {
      httpMetadata: {
        contentType: video.type,
      },
    }),
    data.put(`export/${exportId}/json`, json, {
      httpMetadata: {
        contentType: "application/json",
      },
    }),
  ]);
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
