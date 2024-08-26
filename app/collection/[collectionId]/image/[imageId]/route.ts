import { type NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  {
    params: { collectionId, imageId },
  }: { params: { collectionId: string; imageId: string } },
) {
  const data = getRequestContext().env.DATA;
  try {
    const etag =
      req.headers.get("if-none-match")?.replace(/^"(.*)"$/, "$1") ?? undefined;
    const res = await data.get(`/collection/${collectionId}/image/${imageId}`, {
      onlyIf: {
        etagDoesNotMatch: etag,
      },
    });
    if (!res) {
      return new Response("Not Found", { status: 404 });
    }
    if ("blob" in res) {
      return new Response(res.body, {
        headers: {
          "Content-Type":
            res.httpMetadata?.contentType || "application/octet-stream",
          etag: res.httpEtag,
        },
      });
    } else {
      return new Response(null, {
        status: 304,
      });
    }
  } catch (err) {
    console.warn(err);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
