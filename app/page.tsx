import { listAllCollections } from "@/actions/collection";
import CreateCollectionForm from "./CreateCollectionForm";
import { format, formatDate } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

export const runtime = "edge";

export default async function Home() {
  const collections = await listAllCollections();
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      <div className="flex flex-wrap">
        {collections.map(({ id, updated_at }) => (
          <Link key={id} href={`/collection/${id}`}>
            <button
              type="button"
              key={id}
              className="rounded-lg bg-gray-900 p-4 text-white"
            >
              {format(updated_at, "yyyy-MM-dd HH:mm:ss", { locale: ja })}
            </button>
          </Link>
        ))}
      </div>
      <CreateCollectionForm />
    </main>
  );
}
