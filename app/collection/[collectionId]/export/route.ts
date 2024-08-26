import { type NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function PUT(
  req: NextRequest,
  { params: { collectionId } }: { params: { collectionId: string } },
) {
  const { DB: db, DATA: data } = getRequestContext().env;

  if (!req.headers.get("Content-Type")?.startsWith("video/")) {
    return new Response("Bad Request", { status: 400 });
  }

  const collection = await db
    .prepare(`SELECT id FROM collection WHERE id = ?`)
    .bind(collectionId)
    .first();
  if (!collection) {
    return new Response("Not Found", { status: 404 });
  }

  await data.put("/video/", req.body);
  return new Response();
}

export async function HEAD(
  req: NextRequest,
  { params: { collectionId } }: { params: { collectionId: string } },
) {
  const { DATA: data } = getRequestContext().env;
  const video = await data.get(`/video/${collectionId}`);
  if (!video) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(null, {
    headers: {
      "Content-Type":
        video.httpMetadata?.contentType || "application/octet-stream",
      Etag: video.httpEtag,
    },
  });
}

export async function GET(
  req: NextRequest,
  { params: { collectionId } }: { params: { collectionId: string } },
) {
  const { DATA: data } = getRequestContext().env;

  const range = req.headers.get("Range");
  const res = await data.get(`/video/${collectionId}`, {
    range: range || undefined,
    onlyIf: {
      etagDoesNotMatch: req.headers.get("If-None-Match") || undefined,
    },
  });
  if (!res) {
    return new Response("Not Found", { status: 404 });
  }

  if ("body" in res) {
    return new Response(res.body, {
      headers: {
        "Content-Type":
          res.httpMetadata?.contentType || "application/octet-stream",
        Etag: res.httpEtag,
      },
      status: range ? 206 : 200,
    });
  } else {
    return new Response(null, {
      status: 304,
    });
  }
}
