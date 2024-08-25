"use client";

import { addImage, deleteImage } from "@/actions/image";
import { resizeImage } from "@/utils/image-resizer";
import { useEffect, useRef, useState } from "react";
import ImageItem from "./ImageItem";

type InitialImageData = {
  id: string;
  width: number;
  height: number;
};

type ImageData = {
  id: string;
  blob?: Blob;
  url: string;
  width: number;
  height: number;
};

const MAX_SIZE = 2048;

export default function ImageForm({
  collectionId,
  initialImages,
}: {
  collectionId: string;
  initialImages: InitialImageData[];
  onChangeImages?: (images: Blob[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageData[]>(
    initialImages.map(({ id, width, height }) => ({
      id,
      url: `/api/image/${id}`,
      width,
      height,
    })),
  );
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div>
        アップロードしたい画像をドラッグアンドドロップするか
        <button
          type="button"
          className="btn-primary mx-1"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          ファイルを選択
        </button>
        してください。
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        multiple
        onChange={async () => {
          const files = fileRef.current?.files;
          if (!files) {
            return;
          }
          try {
            setBusy(true);
            for (let index = 0; index < files.length; index++) {
              const file = files[index];
              const image = await resizeImage(file, MAX_SIZE);
              if (!image) {
                continue;
              }
              const data = new FormData();
              data.append("data", image.blob);
              const { id: imageId } = await addImage(
                {
                  collectionId,
                  index: images.length + index,
                  width: image.width,
                  height: image.height,
                },
                data,
              );
              if (image) {
                setImages((prev) => [
                  ...prev,
                  {
                    id: imageId,
                    blob: image.blob,
                    url: URL.createObjectURL(image.blob),
                    width: image.width,
                    height: image.height,
                  },
                ]);
              }
            }
          } catch (e) {
            console.error(e);
            alert("画像の読み込みに失敗しました " + String(e));
          } finally {
            fileRef.current!.value = "";
            setBusy(false);
          }
        }}
      />
      <div className="flex flex-wrap justify-start gap-2">
        {images.map((image, index) => (
          <ImageItem
            key={image.id}
            id={image.id}
            url={image.url}
            width={image.width}
            height={image.height}
            index={index}
            onDelete={async () => {
              try {
                await deleteImage(collectionId, image.id);
                setImages((prev) => prev.filter((i) => i.id !== image.id));
              } catch (err) {
                alert("削除に失敗しました！ " + String(err));
              }
            }}
          />
        ))}
      </div>
      <div>
        <button type="button" className="btn-primary" disabled={busy}>
          変換する
        </button>
      </div>
    </div>
  );
}