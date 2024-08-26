import { deleteCollection, listAllCollections } from "@/actions/collection";
import CreateCollectionForm from "./CreateCollectionForm";
import { format, formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/solid";
import { CollectionCard } from "./CollectionCard";

export const runtime = "edge";

export default async function Home() {
  const collections = await listAllCollections();
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div className="flex flex-wrap">
        {collections.map(({ id, updated_at }) => (
          <CollectionCard key={id} collectionId={id} updatedAt={updated_at} />
        ))}
      </div>
      <CreateCollectionForm />
    </main>
  );
}
