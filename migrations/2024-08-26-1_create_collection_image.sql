DROP TABLE IF EXISTS collection_image;
CREATE TABLE collection_image (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  image_index INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  updated_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL
);
DROP INDEX IF EXISTS idx_collection_image_collection_id;
CREATE INDEX idx_collection_image_collection_id ON collection_image(collection_id);
