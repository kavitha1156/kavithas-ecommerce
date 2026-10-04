# CRAFT - Premium E-Commerce Platform

A production-ready, highly scalable, and modern e-commerce application built with Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI, and Prisma.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **State Management**: Zustand
- **Authentication**: Auth.js (NextAuth)
- **Animations**: Framer Motion
- **Payments**: Stripe (Placeholder)
- **Validation**: Zod & React Hook Form

## Features

- 🎨 **Beautiful UI/UX**: Built with Shadcn UI and Framer Motion for smooth interactions. Dark/Light mode support.
- 🛍️ **Shopping Experience**: Product catalog, filtering, search, cart management, and multi-step checkout.
- 🔐 **Authentication**: Secure email/password and OAuth (Google) via Auth.js.
- 📊 **Dashboards**: Separate views for User (Order history, profile) and Admin (Analytics, inventory management).
- 🤖 **AI Integration**: AI chatbot for product recommendations (Placeholder architecture).
- 📱 **Responsive**: Mobile-first design for perfect rendering on all devices.
- ♿ **Accessible**: Follows WCAG 2.1 AA standards.

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ecommerce-platform
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Copy the `.env` placeholder and fill in your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `NEXTAUTH_SECRET`: Generate one using `openssl rand -base64 32`.
- `NEXTAUTH_URL`: `http://localhost:3000` (for local development).

### 4. Database Setup
Generate Prisma client and push the schema to your database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

*(Optional)* Seed the database with dummy data:
\`\`\`bash
npm run seed
\`\`\`
*(Note: You will need to install `ts-node` or `tsx` and add a seed script to package.json to run this command)*

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on Vercel. 
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Set the environment variables in the Vercel dashboard.
4. Deploy!

For the database, you can use Vercel Postgres, Supabase, or any other PostgreSQL provider.
