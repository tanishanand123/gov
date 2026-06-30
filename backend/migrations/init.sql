-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index for full-text search on scheme name and summary
-- (created after SQLAlchemy creates the tables)
-- Run separately if needed:
-- CREATE INDEX ix_schemes_fts ON schemes USING GIN(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(summary,'')));
-- CREATE INDEX ix_schemes_embedding ON schemes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
