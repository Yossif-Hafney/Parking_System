# Parking Car System - Database Setup Guide

## Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL JDBC Driver

## Step 1: Install PostgreSQL

### Windows

1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer and follow prompts
3. Remember the password you set for `postgres` user
4. Default port is `5432`

## Step 2: Create Database

Open Command Prompt and run:

```cmd
psql -U postgres
```

Enter your password, then run:

```sql
CREATE DATABASE parking_db;
\q
```

## Step 3: Run Setup Script

```cmd
psql -U postgres -d parking_db -f sql/setup.sql
```

Or manually connect and paste the contents of `sql/setup.sql`.

## Step 4: Download JDBC Driver

1. Download PostgreSQL JDBC driver from:
   https://jdbc.postgresql.org/download/

2. Get the latest version (e.g., `postgresql-42.7.1.jar`)

3. Place it in the `lib/` folder

## Step 5: Configure Connection (Optional)

The application uses these defaults:

- Host: `localhost`
- Port: `5432`
- Database: `parking_db`
- User: `postgres`
- Password: `postgres`

To customize, set environment variables:

```cmd
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=parking_db
set DB_USER=postgres
set DB_PASSWORD=your_password
```

## Step 6: Compile and Run

```cmd
cd backend

REM Create lib folder if not exists
mkdir lib

REM Compile with JDBC driver in classpath
javac -cp "lib/*" -d out src/*.java src/**/*.java

REM Run the application
java -cp "out;lib/*" Main
```

## Step 7: Test the Server

Open a browser or use curl:

- **Home**: http://localhost:8080/
- **Status**: http://localhost:8080/status
- **Park a car**: POST to http://localhost:8080/park
  ```json
  { "plate": "ABC123", "type": "car", "color": "red" }
  ```
- **Remove vehicle**: POST to http://localhost:8080/remove
  ```json
  { "plate": "ABC123" }
  ```
- **Find vehicle**: http://localhost:8080/find?plate=ABC123
- **History**: http://localhost:8080/history
- **Revenue**: http://localhost:8080/revenue

## Troubleshooting

### Connection Refused

- Ensure PostgreSQL is running:
  ```cmd
  pg_isready -h localhost -p 5432
  ```

### Authentication Failed

- Check username and password
- Verify `pg_hba.conf` allows local connections

### Database Does Not Exist

- Run: `CREATE DATABASE parking_db;`

### JDBC Driver Not Found

- Ensure the .jar file is in the `lib/` folder
- Check the classpath includes `lib/*`
