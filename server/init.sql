-- init.sql: Database schema creation script for Pecha-Kucha-Teleprompter
-- Run with: psql -f server/init.sql $DATABASE_URL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Ensure UUID generation support

CREATE TABLE IF NOT EXISTS presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slides TEXT[] NOT NULL,
    slide_duration INTEGER NOT NULL DEFAULT 30,
    font_size TEXT NOT NULL DEFAULT 'medium'
);
