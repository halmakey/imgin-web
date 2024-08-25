import { NextResponse, type NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params: { imageId } }: { params: { imageId: string } },
) {
  const data = getRequestContext().env.DATA;
  try {
    const etag =
      req.headers.get("if-none-match")?.replace(/^"(.*)"$/, "$1") ?? undefined;
    console.log(etag);
    const res = await data.get(`/image/${imageId}`, {
      onlyIf: {
        etagDoesNotMatch: etag,
      },
    });
    if (!res) {
      return new Response("Not Found", { status: 404 });
    }
    if ("blob" in res) {
      const blob = await res.blob();
      return new Response(blob, {
        headers: {
          "Content-Type": "image/png",
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

export async function POST(request: NextRequest) {
  let responseText = "Hello World";

  const db = getRequestContext().env.DB;
  // getRequestContext().env.DATA.put('key', 'value')

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = getRequestContext().env.MY_KV_NAMESPACE
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // responseText += suffix

  return new Response(responseText);
}
