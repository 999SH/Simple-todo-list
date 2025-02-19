\c postgres

-- Create the 'twiceme' database if it doesn't already exist
SELECT 'CREATE DATABASE twiceme'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'twiceme')
\gexec

-- Create the user 'twiceme_admin' with the password 'secure' if it doesn't already exist
SELECT 'CREATE USER twiceme_admin WITH PASSWORD ''secure'''
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'twiceme_admin')
\gexec

-- Grant all privileges on the 'twiceme' database to 'twiceme_admin'
GRANT ALL PRIVILEGES ON DATABASE twiceme TO twiceme_admin;

-- Connect to the 'twiceme' database
\c twiceme

-- Grant twiceme_admin privileges on the public schema to allow table creation
GRANT ALL ON SCHEMA public TO twiceme_admin;

-- Switch to the 'twiceme_admin' role so that new objects will be owned by this user
SET ROLE twiceme_admin;

-- Create the todos table (owned by twiceme_admin)
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  complete BOOLEAN NOT NULL DEFAULT FALSE
);

