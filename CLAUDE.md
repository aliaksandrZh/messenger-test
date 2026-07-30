# Messenger — Project Notes

## Solution layout
- `messenger.sln` at repo root contains `Messenger.Dal` only.
- **`Messenger.Dal`** — data layer (class lib, `net10.0`). Holds `CoreContext` (DbContext, global namespace), POCO models, repository interfaces. Packages: `EFCore`, `EFCore.Sqlite`, `EFCore.Proxies`, `Microsoft.Extensions.Configuration` (all 10.0.10).
- **`Messenger.DB/`** — **plain folder** (NOT a .NET project). Houses the SQLite database file `messenger.db` and the manual schema init script `init.sql`. No `.csproj`, not in the solution.

## Database schema — managed manually (no EF migrations)
- EF Core migration tooling was **removed** by request. Schema is created/maintained by hand (raw SQL) against `Messenger.DB/messenger.db`.
- Init script: `Messenger.DB/init.sql` — creates all tables/FKs/indexes matching the EF model. Run with:
  - `sqlite3 Messenger.DB/messenger.db < Messenger.DB/init.sql` (delete `messenger.db` first for a clean slate)
- Seed script: `Messenger.DB/seed.sql` — idempotent `INSERT OR IGNORE` sample rows for `Users`. Run after `init.sql`:
  - `sqlite3 Messenger.DB/messenger.db < Messenger.DB/seed.sql`
- `Microsoft.EntityFrameworkCore.Design`, the `Migrations/` folder, and the design-time factory were deleted.
- The EF Core **runtime model still exists** (`CoreContext.OnModelCreating`, navigation properties, proxies) and can be used to query a manually-created schema as long as the SQLite schema matches the model (table/column names, FKs, composite PKs on `Contact`/`Participant`, unique `User.Email`).
- `dotnet-ef` 10.0.3 is installed globally (unused now; runtime is 10.0.10).

## Model conventions
- All navigation properties are `virtual` (lazy-loading proxies enabled).
- Junction tables use **composite PKs**: `Contact(UserId, ContactId)`, `Participant(ChatId, UserId)`.
- `User.Email` has a unique index.
- Cascade: Chat→Messages/Participants, User→Contacts(owner)/Participations = Cascade; `Message.CreatedBy→User` and `Contact.ContactId→User` = Restrict.
- `CreateInfo<T>` audit base (untouched): `CreatedAtUtc`, `CreatedBy` (used by `Message` as FK→User).
- Guid PKs are client-generated (no DB-side default).
- Models + `CoreContext` live in the **global namespace** (no `namespace` declared).

## Known warnings (non-blocking)
- `NU1903`: transitive `SQLitePCLRaw.lib.e_sqlite3 2.1.11` high-severity advisory (comes with the Sqlite provider).
- `CS8625` on `CoreContext` ctor `IConfiguration config = null` (pre-existing, nullable).