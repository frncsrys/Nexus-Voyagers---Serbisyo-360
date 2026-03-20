# Serbisyo360 — Setup Guide

## Prerequisites

Make sure you have these installed before starting:

- **Node.js** v18 or higher — https://nodejs.org
- **PostgreSQL** v14 or higher — https://www.postgresql.org/download/windows/
- **Git** — https://git-scm.com

---

## Step-by-Step Setup

### Step 1 — Install dependencies

Open your terminal inside the project folder and run:

```bash
npm install
```

---

### Step 2 — Create the database

Open a new terminal and run:

```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

Then inside the PostgreSQL prompt:

```sql
CREATE DATABASE serbisyo360;
\q
```

---

### Step 3 — Create the .env file

In your project root (same folder as `package.json`), create a file called `.env` and paste this:

```properties
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/serbisyo360"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET_KEY"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> Replace `YOUR_PASSWORD` with your actual PostgreSQL password.
> Replace `YOUR_LONG_RANDOM_SECRET_KEY` with any long random string.

---

### Step 4 — Add seed config to package.json

Open `package.json` and add this block at the very end, before the last closing `}`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Your `package.json` should end like this:

```json
  "devDependencies": {
    ...
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

### Step 5 — Run database migrations

This creates all the tables in your PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

Expected output:

```
Applying migration `20260320174754_init`
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

---

### Step 6 — Seed demo data

This creates the demo accounts and sample data:

```bash
npx prisma db seed
```

Expected output:

```
LGU Admin created
Workers created
Reviews created
Seed complete!

  LGU Admin:  admin@manila.gov.ph  /  Admin@123
  Worker:     jane.doe@email.com   /  Worker@123
  Worker:     john.smith@email.com /  Worker@123
  Worker:     maria.cruz@email.com /  Worker@123
  Worker:     carlo.santos@email.com / Worker@123 (pending)
```

---

### Step 7 — Start the app

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

---

## Quick Login Test

Once the app is running, go to `/login` and try:

| Role | Email | Password |
|------|-------|----------|
| LGU Admin | admin@manila.gov.ph | Admin@123 |
| Worker | jane.doe@email.com | Worker@123 |

LGU Admin should land on `/lgu/dashboard` with real data  
Worker should land on `/worker/dashboard` with Jane's profile
