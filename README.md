# StockFlow MVP

A minimal multi-tenant SaaS inventory management app built for a 6-hour technical assessment.

**Live demo:** https://stockflow-mvp-ecru.vercel.app/login

## Features

- Sign up and log in with email and password (an organization is created on signup)
- Every record is scoped to the user's organization, so there is no cross-tenant data access
- Product CRUD: name, SKU (unique per organization), description, quantity, cost price, selling price, low stock threshold
- Search products by name or SKU
- Quick stock adjustment with +/- buttons
- Delete with a confirmation dialog
- Dashboard with total products, total units in stock, and a low stock table
- Settings page for the default low stock threshold

## Tech stack

- Next.js (App Router) with TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL (Neon)
- bcryptjs for password hashing, JWT sessions in HTTP-only cookies (jose)
- Deployed on Vercel

## Run locally

1. Clone the repo and install dependencies:

       npm install

2. Create a `.env` file with:

       DATABASE_URL="your-postgres-connection-string"
       AUTH_SECRET="a-long-random-string"

3. Create the database tables:

       npx prisma migrate deploy

4. Start the dev server and open http://localhost:3000:

       npm run dev

## Out of scope (by design)

Multi-warehouse, variants, integrations, purchase orders, email notifications, CSV import, roles and staff users, audit logs, billing.


