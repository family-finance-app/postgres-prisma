-- Database initialization for Family Finance
-- This file is executed on the first run of the PostgreSQL container
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Basic settings
ALTER DATABASE family_finance
SET
    timezone TO 'UTC';