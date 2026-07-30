-- Messenger — seed data for the Users table
-- Run after init.sql:
--   sqlite3 Messenger.DB/messenger.db < Messenger.DB/init.sql
--   sqlite3 Messenger.DB/messenger.db < Messenger.DB/seed.sql
--
-- Id values are TEXT (Guid). INSERT OR IGNORE keeps it idempotent against the
-- unique Email index and existing rows.

INSERT OR IGNORE INTO Users (Id, Name, Email) VALUES
    ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Alice Carter',     'alice.carter@example.com'),
    ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Bob Hoffman',       'bob.hoffman@example.com'),
    ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Carla Mendez',      'carla.mendez@example.com'),
    ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'David Kim',         'david.kim@example.com'),
    ('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Elena Petrova',     'elena.petrova@example.com');