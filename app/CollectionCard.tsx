"use client";

import { deleteCollection } from "@/actions/collection";
import { TrashIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CollectionCard({
  collectionId,
  updatedAt,
}: {
  collectionId: string;
  updatedAt: number;
}) {
  const router = useRouter();
  return (
    <div className="relative">
      <Link href={`/collection/${collectionId}`}>
        <button type="button" className="rounded-lg bg-gray-900 p-4 text-white">
          {format(updatedAt, "yyyy-MM-dd HH:mm:ss", { locale: ja })}
        </button>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 top-0">
        <button
          type="button"
          className="my-auto"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await deleteCollection(collectionId);
              router.refresh();
            } catch (err) {
              alert("コレクションの削除に失敗しました！ " + String(err));
            }
          }}
        >
          <TrashIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
