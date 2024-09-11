import { getCollection } from "@/actions/collection";
import ImageForm from "./ImageForm";
import { notFound } from "next/navigation";
import { listImagesForCollection } from "@/actions/image";
import ExportForm from "./ExportForm";
import { FormStateProvider } from "./FormStateContext";
import { getCollectionImageUrl } from "@/utils/image-url";

export const runtime = "edge";

export default async function Home({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) {
  const [collection, images] = await Promise.all([
    getCollection(collectionId),
    listImagesForCollection(collectionId),
  ]);
  if (!collection) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 flex w-full max-w-5xl flex-col items-start justify-between gap-4 text-sm lg:flex">
        <FormStateProvider
          initialImages={images.map(({ id, width, height }) => ({
            id,
            url: getCollectionImageUrl(collectionId, id),
            width,
            height,
          }))}
        >
          <ImageForm collectionId={collection.id} />
          <ExportForm exportId={collection.export_id} />
        </FormStateProvider>
      </div>
    </main>
  );
}
