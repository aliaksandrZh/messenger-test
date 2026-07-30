-- Messenger — seed data for the Users table
-- Run after init.sql:
--   sqlite3 Messenger.DB/messenger.db < Messenger.DB/init.sql
--   sqlite3 Messenger.DB/messenger.db < Messenger.DB/seed.sql
--
-- Id values are TEXT (Guid). INSERT OR IGNORE keeps it idempotent against the
-- unique Email index and existing rows.

-- Guid values are UPPERCASE to match EF Core / Microsoft.Data.Sqlite, which
-- persists Guid columns as uppercased TEXT. Lowercase seed ids would make
-- EF-written FK references (e.g. Participant.UserId) fail the FK lookup.
INSERT OR IGNORE INTO Users (Id, Name, Email) VALUES
    ('A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D', 'Alice Carter',     'alice.carter@example.com'),
    ('B2C3D4E5-F6A7-4B8C-9D0E-1F2A3B4C5D6E', 'Bob Hoffman',       'bob.hoffman@example.com'),
    ('C3D4E5F6-A7B8-4C9D-0E1F-2A3B4C5D6E7F', 'Carla Mendez',      'carla.mendez@example.com'),
    ('D4E5F6A7-B8C9-4D0E-1F2A-3B4C5D6E7F8A', 'David Kim',         'david.kim@example.com'),
    ('E5F6A7B8-C9D0-4E1F-2A3B-4C5D6E7F8A9B', 'Elena Petrova',     'elena.petrova@example.com');