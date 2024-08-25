import { TrashIcon } from "@heroicons/react/24/solid";

const PREVIEW_SIZE = 198;

export default function ImageItem({
  id,
  index,
  width,
  height,
  url,
  onDelete,
}: {
  id: string;
  index: number;
  width: number;
  height: number;
  url: string;
  onDelete: () => void;
}) {
  const scale = Math.min(PREVIEW_SIZE / width, PREVIEW_SIZE / height);
  return (
    <div
      key={id}
      className="relative flex items-center justify-center bg-gray-900"
      style={{
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
      }}
      tabIndex={1}
      draggable
    >
      {url && (
        <img
          src={url}
          alt={`#${index + 1}`}
          className="m-auto bg-gray-900 object-fill"
          style={{
            width: width * scale,
            height: height * scale,
          }}
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 top-0">
        <span className="absolute left-1 top-1 rounded bg-black bg-opacity-60 p-1 text-xs">
          {index + 1}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 text-xs opacity-0 hover:opacity-100">
        <button
          className="btn-icon absolute right-1 top-1 rounded-full bg-red-500 text-xs"
          onClick={async (e) => {
            e.preventDefault();
            onDelete();
          }}
        >
          <TrashIcon className="size-3" />
        </button>
        <div className="absolute bottom-1 left-1 rounded bg-black bg-opacity-80 p-1">
          {width}x{height}
        </div>
      </div>
    </div>
  );
}
