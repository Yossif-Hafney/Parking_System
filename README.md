## How to Run This Project

### 1. Backend (Java + PostgreSQL)

**Requirements:**

- Java 17+ (JDK)
- PostgreSQL 12+
- PostgreSQL JDBC Driver (`lib/postgresql-42.7.4.jar`)

**Setup:**

1. Install PostgreSQL and create the database:
   ```sh
   psql -U postgres
   CREATE DATABASE parking_db;
   \q
   ```
2. Run the SQL setup:
   ```sh
   psql -U postgres -d parking_db -f backend/sql/setup.sql
   ```
3. Download the JDBC driver from [here](https://jdbc.postgresql.org/download/) and place it in `backend/lib/`.

4. (Optional) Set environment variables if you use a custom DB user/password.

**Build and Run:**

```sh
cd backend
javac -cp "lib/*" -d out src/*.java src/**/*.java
java -cp "out;lib/*" Main
```

The backend will start at [http://localhost:8080](http://localhost:8080).

---

### 2. Frontend (Next.js)

**Requirements:**

- Node.js 18+
- npm (comes with Node.js)

**Setup & Run:**

```sh
cd frontend
npm install
npm run dev
```

The frontend will start at [http://localhost:3000](http://localhost:3000).

---

### 3. Usage

- Open [http://localhost:3000](http://localhost:3000) for the dashboard.
- The frontend talks to the backend at [http://localhost:8080](http://localhost:8080).

---
