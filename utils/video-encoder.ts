import { Muxer, ArrayBufferTarget } from "mp4-muxer";

export async function encodeVideo(
  imageSources: string[],
  width: number,
  height: number,
  framerate: number,
  onProgress: (progress: number) => void,
) {
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

  for (let index = 0; index < imageSources.length; index++) {
    onProgress(index / imageSources.length);
    const src = imageSources[index];
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    ctx.drawImage(image, 0, 0, width, height);
    const videoFrame = new VideoFrame(canvas, {
      timestamp: index * (1_000_000 / framerate),
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
