"use client";

import { useRouter } from "next/navigation";
import { createCollection } from "@/actions/collection";

export default function CreateCollectionForm() {
  const router = useRouter();
  return (
    <form
      action={async () => {
        router.push(`/collection/${await createCollection()}`);
      }}
    >
      <button type="submit" className="btn-primary">
        新しいコレクションを追加する
      </button>
    </form>
  );
}
