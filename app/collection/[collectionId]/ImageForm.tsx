"use client";

import { addImage, deleteImage } from "@/actions/image";
import { resizeImage } from "@/utils/image-resizer";
import { useRef, useState } from "react";
import ImageItem from "./ImageItem";
import { encodeVideo } from "@/utils/video-encoder";

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

const IMAGE_SIZE = 1920;
const VIDEO_SIZE = 1280;

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
  const [progress, setProgress] = useState(-1);

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
              const image = await resizeImage(file, IMAGE_SIZE);
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
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
          hidden={images.length === 0}
          onClick={async (e) => {
            e.preventDefault();
            try {
              setBusy(true);
              const srcs = images.map(({ url }) => url);
              const result = await encodeVideo(srcs, VIDEO_SIZE, setProgress);
              const a = document.createElement("a");
              a.download = "video.webm";
              a.href = URL.createObjectURL(result);
              a.click();
              URL.revokeObjectURL(a.href);
              await fetch(`/collection/${collectionId}/video`)
            } catch (err) {
              alert("変換に失敗しました！ " + String(err));
            } finally {
              setBusy(false);
              setProgress(-1);
            }
          }}
        >
          変換する
        </button>
        {progress >= 0 && (
          <progress
            max={1}
            value={progress}
            className="[&::-moz-progress-bar]:bg-green-500 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-green-500"
          />
        )}
      </div>
    </div>
  );
}
