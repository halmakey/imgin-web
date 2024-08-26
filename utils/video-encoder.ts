import { Muxer, ArrayBufferTarget } from "webm-muxer";

export async function encodeVideo(
  imageSources: string[],
  size: number,
  onProgress: (progress: number) => void,
) {
  onProgress(0);
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: "V_VP9",
      width: size,
      height: size,
    },
  });

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => console.error(e),
  });
  encoder.configure({
    codec: "vp09.00.10.08",
    width: size,
    height: size,
    bitrateMode: "quantizer",
    framerate: 2,
  });

  const option = {
    keyFrame: true,
    vp9: {
      quantizer: 21,
    },
  };

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
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
    ctx.drawImage(image, 0, 0, size, size);
    const videoFrame = new VideoFrame(canvas, {
      timestamp: index * 500_000,
    });

    encoder.encode(videoFrame, option);
    videoFrame.close();
  }

  await encoder.flush();
  muxer.finalize();
  onProgress(1);
  return new Blob([muxer.target.buffer], { type: "video/webm" });
}
