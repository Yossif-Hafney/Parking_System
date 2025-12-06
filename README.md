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

### 4. Troubleshooting

- If you see database errors, check your PostgreSQL is running and credentials are correct.
- If you see missing dependency errors, run `npm install` in `frontend` and check the JDBC jar in `backend/lib/`.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
