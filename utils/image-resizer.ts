export type ResizedImage = {
  blob: Blob;
  width: number;
  height: number;
};
export function resizeImage(
  blob: Blob,
  maxSize: number,
): Promise<ResizedImage | null> {
  return new Promise<ResizedImage | null>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject("2d context not supported");
      return;
    }
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(maxSize / image.width, maxSize / image.height);
      if (scale >= 1) {
        resolve({
          blob,
          width: image.width,
          height: image.height,
        });
        return;
      }

      const targetWidth = Math.round(image.width * scale);
      const targetHeight = Math.round(image.height * scale);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              width: targetWidth,
              height: targetHeight,
            });
          } else {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({
                    blob,
                    width: targetWidth,
                    height: targetHeight,
                  });
                } else {
                  reject("Failed to convert image");
                }
              },
              "image/jpeg",
              0.95,
            );
          }
        },
        "image/webp",
        0.95,
      );
    };
    image.onerror = (e) => {
      reject(e);
    };
    image.src = URL.createObjectURL(blob);
  });
}
