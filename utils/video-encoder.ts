import { Muxer, ArrayBufferTarget } from "mp4-muxer";

const SEC = 1_000_000;

export async function encodeVideo({
  imageSources,
  width,
  height,
  framerate,
  paddingFrames,
  onProgress,
}: {
  imageSources: string[];
  width: number;
  height: number;
  framerate: number;
  paddingFrames: number;
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
    codec: "avc1.640032",
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
  const totalFrame = paddingFrames + imageSources.length + paddingFrames;

  for (let index = 0; index < totalFrame; index++) {
    onProgress(index / totalFrame);
    if (index >= paddingFrames && index < paddingFrames + imageSources.length) {
      const src = imageSources[index - paddingFrames];
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
      ctx.drawImage(image, 0, 0, width, height);
    } else {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, width, height);    
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
