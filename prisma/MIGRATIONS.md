# Prisma Migrations Guide

## Basic Migration Commands

### 1. Creating and Applying a Migration

```bash
# Creates a new migration based on changes in schema.prisma
npx prisma migrate dev --name "migration_name"

# Example:
npx prisma migrate dev --name "add_user_avatar_field"
```

### 2. Checking Migration Status

```bash
# Shows the status of all migrations
npx prisma migrate status
```

### 3. Applying Migrations in Production

```bash
# Applies all pending migrations (for production)
npx prisma migrate deploy
```

### 4. Resetting the Database

```bash
# Completely resets the database and reapplies all migrations
npx prisma migrate reset

# Same, but without confirmation
npx prisma migrate reset --force
```

### 5. Generating Prisma Client

```bash
# Generates the client after schema changes
npx prisma generate
```

## Development Workflow

1. **Edit the schema**: Modify `prisma/schema.prisma`
2. **Create a migration**: `npx prisma migrate dev --name "description_of_changes"`
3. **Check**: The migration is automatically applied to the development database
4. **Test**: Make sure everything works correctly

## Examples of Schema Changes and Migrations

### Adding a New Field

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  avatar   String? // New field
  // ...
}
```

Command: `npx prisma migrate dev --name "add_user_avatar"`

### Creating a New Table

```prisma
model Settings {
  id     Int    @id @default(autoincrement())
  userId Int    @unique @map("user_id")
  theme  String @default("light")

  user User @relation(fields: [userId], references: [id])
  @@map("settings")
}
```

Command: `npx prisma migrate dev --name "add_settings_table"`

### Changing a Field Type

```prisma
model Account {
  // Was: balance Decimal @db.Decimal(12,2)
  balance Decimal @db.Decimal(15,2) // Increased precision
}
```

Command: `npx prisma migrate dev --name "increase_balance_precision"`

## Migrations Folder Structure

```
prisma/
├── migrations/
│   ├── 20251001114219_init/
│   │   └── migration.sql
│   ├── 20251002120000_add_user_avatar/
│   │   └── migration.sql
│   └── migration_lock.toml
├── schema.prisma
|── MIGRATIONS.md
└── seed.js
```

## Important Notes

### Be Careful with Production

- Always make a backup before applying migrations in production
- Use `migrate deploy` instead of `migrate dev` in production
- Test migrations on a copy of production data

### Rolling Back Migrations

Prisma does not support automatic migration rollback. To roll back:

1. Create a new migration that undoes the changes
2. Or use `migrate reset` (removes all data!)

### 📝 Naming Migrations

Use descriptive names:

- ✅ `add_user_avatar_field`
- ✅ `create_notifications_table`
- ✅ `update_transaction_constraints`
- ❌ `fix1`
- ❌ `update`

### Commands via npm scripts

Preconfigured commands in `package.json`:

```bash
npm run db:migrate    # prisma migrate dev
npm run db:reset      # prisma migrate reset --force
npm run db:push       # prisma db push (for quick sync)
npm run db:generate   # prisma generate
npm run db:studio     # prisma studio
```

## Troubleshooting

### "Migration failed" Error

1. Check the syntax in `schema.prisma`
2. Make sure the database is accessible
3. Check the DB user's permissions

### Schema Not Syncing

```bash
# Force sync (development only!)
npx prisma db push
```

### Migration Conflict

1. Check status: `npx prisma migrate status`
2. If needed, reset: `npx prisma migrate reset`
3. Create a new migration: `npx prisma migrate dev`
