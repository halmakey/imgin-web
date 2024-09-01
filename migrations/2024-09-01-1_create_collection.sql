DROP TABLE IF EXISTS collection;
CREATE TABLE collection (
  id TEXT PRIMARY KEY,
  export_id TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
