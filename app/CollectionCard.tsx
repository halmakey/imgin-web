"use client";

import { deleteCollection } from "@/actions/collection";
import { TrashIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CollectionCard({
  collectionId,
  imageId,
  updatedAt,
}: {
  collectionId: string;
  imageId: string;
  updatedAt: number;
}) {
  const router = useRouter();
  const timestamp = format(updatedAt, "yyyy-MM-dd HH:mm:ss", { locale: ja });
  return (
    <Link href={`/collection/${collectionId}`}>
      <div className="relative h-60 w-60 overflow-clip rounded bg-gray-900 text-white">
        {imageId && (
          <img
            src={`collection/${collectionId}/image/${imageId}`}
            className="h-full w-full object-cover"
            alt={timestamp}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 top-0 opacity-0 hover:opacity-100">
          <div className="absolute bottom-1 left-1 right-1 rounded bg-black bg-opacity-80 p-2 text-sm">
            {timestamp}
          </div>
          <button
            type="button"
            className="btn-icon absolute right-1 top-1 rounded-full bg-red-500 text-xs"
            onClick={async (e) => {
              e.preventDefault();
              if (!confirm("コレクションを削除してもよろしいですか？")) {
                return;
              }
              try {
                await deleteCollection(collectionId);
                alert("コレクションを削除しました！");
                router.refresh();
              } catch (err) {
                alert("コレクションの削除に失敗しました！ " + String(err));
              }
            }}
          >
            <TrashIcon className="size-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}
