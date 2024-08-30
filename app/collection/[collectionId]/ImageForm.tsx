"use client";

import { addImage, deleteImage } from "@/actions/image";
import { resizeImage } from "@/utils/image-resizer";
import { useContext, useRef } from "react";
import ImageItem from "./ImageItem";
import FormStateContext from "./FormStateContext";

const IMAGE_SIZE = 1920;

export default function ImageForm({ collectionId }: { collectionId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { images, setImages, busy, mutate } = useContext(FormStateContext);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          type="button"
          className="btn-primary mx-1"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          画像ファイルを追加する
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        multiple
        onChange={() => {
          const files = fileRef.current?.files;
          if (!files) {
            return;
          }
          mutate(async () => {
            try {
              for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const image = await resizeImage(file, IMAGE_SIZE);
                if (!image) {
                  continue;
                }
                const data = new FormData();
                data.append("data", image.blob);
                const { imageId } = await addImage(
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
            }
          });
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
            onDelete={() =>
              mutate(async () => {
                try {
                  await deleteImage(collectionId, image.id);
                  setImages((prev) => prev.filter((i) => i.id !== image.id));
                } catch (err) {
                  alert("削除に失敗しました！ " + String(err));
                }
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
