# Family Finance Database with Prisma ORM

A project for managing family finances using PostgreSQL and Prisma ORM.

## Project Structure

- `Dockerfile` - configuration for the PostgreSQL container
- `docker-compose.yml` - service orchestration
- `prisma/schema.prisma` - Prisma database schema
- `init.sql` - database initialization script

## Installation and Startup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Or build and start
docker-compose up --build -d
```

### 3. Prisma Setup

```bash
# Generate Prisma client
npm run db:generate

# Create and apply the first migration
npm run db:migrate

# Seed the database with test data
npm run db:seed

# Test the connection
npm run db:test
```

### 4. View Data

```bash
# Launch Prisma Studio
npm run db:studio
```

## Working with Migrations

### Create a New Migration

```bash
# After editing schema.prisma
npx prisma migrate dev --name "description_of_changes"
```

### Check Migration Status

```bash
npx prisma migrate status
```

### Apply Migrations in Production

```bash
npx prisma migrate deploy
```

📖 **Detailed migration guide**: see [MIGRATIONS.md](./MIGRATIONS.md)

## Database Schema

### Main Entities:

- **Users** - system users
- **Groups** - user groups (families, teams, etc.)
- **UserGroups** - links users to groups and their roles
- **Accounts** - financial accounts (bank, cash, etc.)
- **AccountsGroups** - links accounts to groups
- **Categories** - transaction categories
- **Transactions** - financial operations
- **Notifications** - notifications for users
- **Goals** - financial goals for groups

### Table Structure:

#### Users

- id, email, password_hash, name, role, birthdate
- created_at, updated_at

#### Groups

- id, name, created_by (ref: users.id)
- created_at, updated_at

#### UserGroups

- id, user_id, group_id, role, joined_at
- Many-to-many relationship between Users and Groups

#### Accounts

- id, title, type, balance, currency
- group_id, user_id, created_by
- created_at, updated_at

#### AccountsGroups

- id, account_id, group_id
- Many-to-many relationship between Accounts and Groups

#### Transactions

- id, user_id, group_id, account_id, category_id
- amount, date, created_at, updated_at

#### Categories

- id, title, type

#### Notifications

- id, user_id, title, message, type, is_read
- created_at

#### Goals

- id, title, description, target_amount, current_amount
- target_date, group_id, created_by, is_achieved
- created_at, updated_at

## Database Commands

```bash
# Reset the database
npm run db:reset

# Seed with test data
npm run db:seed

# View migration status
npx prisma migrate status

# Create a new migration
npx prisma migrate dev --name "migration_name"

# Generate Prisma client
npm run db:generate

# Run usage example
npm run dev
```

## Environment Variables

Copy `.env` and configure as needed:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/family_finance?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

## Docker Commands

```bash
# View logs
docker-compose logs postgres

# Stop services
docker-compose down

# Stop and remove volumes (caution!)
docker-compose down -v
```

## Table Structure

The schema is based on the diagram: https://dbdiagram.io/d/FF-686beec1f413ba3508abc688

You can edit the schema in `prisma/schema.prisma` and apply changes via migrations.
