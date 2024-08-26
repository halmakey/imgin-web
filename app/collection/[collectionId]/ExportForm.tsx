"use client";

import { useContext, useState } from "react";
import FormStateContext from "./FormStateContext";
import { encodeVideo } from "@/utils/video-encoder";
import { exportVideo } from "@/actions/export";

const VIDEO_SIZE = 1280;

export default function ExportForm({ exportId }: { exportId: string }) {
  const { busy, images, mutate } = useContext(FormStateContext);
  const [progress, setProgress] = useState(-1);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="btn-primary"
        disabled={busy}
        hidden={images.length === 0}
        onClick={async (e) => {
          e.preventDefault();
          mutate(async () => {
            try {
              const srcs = images.map(({ url }) => url);
              const result = await encodeVideo(srcs, VIDEO_SIZE, setProgress);

              const formData = new FormData();
              formData.append("data", result);
              await exportVideo(exportId, formData);
            } catch (err) {
              alert("変換に失敗しました！ " + String(err));
            } finally {
              setProgress(-1);
            }
          });
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
  );
}
