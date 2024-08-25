"use client";

import { createCollection } from "@/actions/collection";

export default function CreateCollectionForm() {
  return (
    <form action={createCollection}>
      <button type="submit" className="btn-primary">
        新しいコレクションを追加する
      </button>
    </form>
  );
}
