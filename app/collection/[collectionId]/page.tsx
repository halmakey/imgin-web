import { getCollection } from "@/actions/collection";
import ImageForm from "./ImageForm";
import { notFound } from "next/navigation";
import { listImagesForCollection } from "@/actions/image";

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
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <ImageForm initialImages={images} collectionId={collection.id} />
      </div>
    </main>
  );
}
