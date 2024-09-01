"use client";

import { useContext, useState } from "react";
import FormStateContext from "./FormStateContext";
import { encodeVideo } from "@/utils/video-encoder";
import { putExport, hasExport } from "@/actions/export";
import ExportUrl from "./ExportUrl";
import useSWR from "swr";
import { DocumentTextIcon, FilmIcon } from "@heroicons/react/24/outline";

const VIDEO_SIZE = 1280;

export default function ExportForm({ exportId }: { exportId: string }) {
  const { busy, images, mutate } = useContext(FormStateContext);
  const [progress, setProgress] = useState(-1);
  const { data: existsExport, mutate: mutateExistsExport } = useSWR(
    `export/${exportId}/video`,
    () => hasExport(exportId),
  );
  return (
    <div className="flex flex-col items-start gap-4">
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
              const video = await encodeVideo({
                imageSources: srcs,
                width: VIDEO_SIZE,
                height: VIDEO_SIZE,
                framerate: 4,
                paddingFrames: 4,
                onProgress: setProgress,
              });

              const json = JSON.stringify(
                images.map(({ width, height }, index) => ({
                  index,
                  width,
                  height,
                })),
              );

              const formData = new FormData();
              formData.append("video", video);
              formData.append("json", json);

              await putExport(exportId, formData);
            } catch (err) {
              console.error(err);
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
      {progress == -1 && existsExport && (
        <div className="flex items-center gap-2">
          <FilmIcon className="size-6" />
          <ExportUrl exportId={exportId} suffix="/video" />
        </div>
      )}
      {progress == -1 && existsExport && (
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="size-6" />
          <ExportUrl exportId={exportId} suffix="/json" />
        </div>
      )}
    </div>
  );
}
