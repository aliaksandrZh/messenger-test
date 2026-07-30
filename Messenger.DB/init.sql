-- Messenger — SQLite schema init script (manual, code-first-by-hand)
-- Matches the EF Core runtime model in Messenger.Dal (CoreContext.OnModelCreating).
--
-- Usage:
--   sqlite3 Messenger.DB/messenger.db < Messenger.DB/init.sql
--   (or drop messenger.db first for a fully clean slate)
--
-- Conventions:
--   - Guid  -> TEXT
--   - DateTime (UTC) -> TEXT (ISO-8601)
--   - Foreign keys enforced via PRAGMA foreign_keys = ON.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
    Id    TEXT NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
    Name  TEXT NOT NULL,
    Email TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_Email ON Users (Email);

-- ---------------------------------------------------------------------------
-- Chats
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Chats (
    Id   TEXT NOT NULL CONSTRAINT PK_Chats PRIMARY KEY,
    Name TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Contacts  (User <-> User junction, composite PK)
--   UserId    -> Users.Id  ON DELETE CASCADE   (owner side)
--   ContactId -> Users.Id  ON DELETE RESTRICT  (target side)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Contacts (
    UserId    TEXT NOT NULL,
    ContactId TEXT NOT NULL,
    CONSTRAINT PK_Contacts PRIMARY KEY (UserId, ContactId),
    CONSTRAINT FK_Contacts_Users_ContactId
        FOREIGN KEY (ContactId) REFERENCES Users (Id) ON DELETE RESTRICT,
    CONSTRAINT FK_Contacts_Users_UserId
        FOREIGN KEY (UserId) REFERENCES Users (Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_Contacts_ContactId ON Contacts (ContactId);

-- ---------------------------------------------------------------------------
-- Messages  (CreateInfo<Guid>: CreatedAtUtc, CreatedBy)
--   ChatId    -> Chats.Id  ON DELETE CASCADE
--   CreatedBy -> Users.Id  ON DELETE RESTRICT
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Messages (
    Id           TEXT NOT NULL CONSTRAINT PK_Messages PRIMARY KEY,
    ChatId       TEXT NOT NULL,
    Text         TEXT NOT NULL,
    CreatedAtUtc TEXT NOT NULL,
    CreatedBy    TEXT NOT NULL,
    CONSTRAINT FK_Messages_Chats_ChatId
        FOREIGN KEY (ChatId) REFERENCES Chats (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_Users_CreatedBy
        FOREIGN KEY (CreatedBy) REFERENCES Users (Id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS IX_Messages_ChatId    ON Messages (ChatId);
CREATE INDEX IF NOT EXISTS IX_Messages_CreatedBy ON Messages (CreatedBy);

-- ---------------------------------------------------------------------------
-- Participants  (Chat <-> User junction, composite PK)
--   ChatId -> Chats.Id ON DELETE CASCADE
--   UserId -> Users.Id ON DELETE CASCADE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Participants (
    ChatId TEXT NOT NULL,
    UserId TEXT NOT NULL,
    CONSTRAINT PK_Participants PRIMARY KEY (ChatId, UserId),
    CONSTRAINT FK_Participants_Chats_ChatId
        FOREIGN KEY (ChatId) REFERENCES Chats (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Participants_Users_UserId
        FOREIGN KEY (UserId) REFERENCES Users (Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_Participants_UserId ON Participants (UserId);