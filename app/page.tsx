import { listAllCollections } from "@/actions/collection";
import CreateCollectionForm from "./CreateCollectionForm";
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
