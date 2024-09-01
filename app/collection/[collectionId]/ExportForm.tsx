"use client";

import { use, useContext, useState } from "react";
import FormStateContext from "./FormStateContext";
import { encodeVideo } from "@/utils/video-encoder";
import { exportVideo, hasExport } from "@/actions/export";
import ExportUrl from "./ExportUrl";
import useSWR from "swr";

const VIDEO_SIZE = 1280;

export default function ExportForm({ exportId }: { exportId: string }) {
  const { busy, images, mutate } = useContext(FormStateContext);
  const [progress, setProgress] = useState(-1);
  const { data: existsExport, mutate: mutateExistsExport } = useSWR(
    `export/${exportId}/video`,
    () => hasExport(exportId),
  );
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
              const result = await encodeVideo(srcs, VIDEO_SIZE, VIDEO_SIZE, 4, setProgress);

              const formData = new FormData();
              formData.append("data", result);
              await exportVideo(exportId, formData);
            } catch (err) {
              alert("変換に失敗しました！ " + String(err));
            } finally {
              setProgress(-1);
              mutateExistsExport();
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
      {progress == -1 && existsExport && <ExportUrl exportId={exportId} />}
    </div>
  );
}
