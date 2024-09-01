import { Muxer, ArrayBufferTarget } from "mp4-muxer";

const SEC = 1_000_000;

export async function encodeVideo({
  imageSources,
  width,
  height,
  framerate,
  warmUpFrames,
  onProgress,
}: {
  imageSources: string[];
  width: number;
  height: number;
  framerate: number;
  warmUpFrames: number;
  onProgress: (progress: number) => void;
}) {
  onProgress(0);
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: "avc",
      width,
      height,
    },
    fastStart: "in-memory",
  });

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => console.error(e),
  });
  const config = {
    codec: "avc1.640029",
    width,
    height,
    bitrateMode: "variable",
    bitrate: 1_000_000,
    framerate,
    avc: {
      format: "avc",
    },
  } as const;
  encoder.configure(config);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const frameStep = SEC / framerate;
  const totalFrame = warmUpFrames + imageSources.length;

  for (let index = 0; index < totalFrame; index++) {
    onProgress(index / totalFrame);
    if (index < warmUpFrames) {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, width, height);
    } else {
      const src = imageSources[index - warmUpFrames];
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
      ctx.drawImage(image, 0, 0, width, height);  
    }
    const videoFrame = new VideoFrame(canvas, {
      timestamp: frameStep * index,
    });

    encoder.encode(videoFrame, {
      keyFrame: true,
    });
    videoFrame.close();
  }

  await encoder.flush();
  muxer.finalize();
  onProgress(1);
  return new Blob([muxer.target.buffer], { type: "video/mp4" });
}
