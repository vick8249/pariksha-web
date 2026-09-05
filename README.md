# Pariksha - Exam Portal Platform

Pariksha is a modern, blazing fast exam portal built with Next.js 16 (App Router), Tailwind CSS v4, and PostgreSQL (via Supabase & Prisma).

## Features
- **Student Portal:** Take exams with a live timer, interactive question palette, negative marking calculation, and instant detailed review reports.
- **Admin Dashboard:** Fully secure owner portal to manage Categories, Subjects, Exams, and individual Questions.
- **Analytics:** Track student progress, view global pass rates, and see detailed reports of every exam attempt.
- **Auto-Saving:** Student progress is synced to the database every 15 seconds.

---

## Deploying to Vercel (Production)

This project is completely optimized and ready to be deployed to Vercel for free.

### Step 1: Push to GitHub
1. Create a new repository on your GitHub account.
2. Open your terminal in this project folder and run:
   ```bash
   git add .
   git commit -m "Initial commit - Pariksha ready for production"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New... > Project**.
3. Import your newly created GitHub repository.

### Step 3: Configure Environment Variables
Before clicking "Deploy", open the **Environment Variables** section in Vercel and paste the variables from your local `.env.local` file:
- `DATABASE_URL` (Your Supabase connection pooler URL, port 6543)
- `DIRECT_URL` (Your Supabase direct URL, port 5432)
- `SESSION_SECRET` (Your secure random string)

### Step 4: Deploy
Click **Deploy**. Vercel will automatically detect Next.js, run `npm install`, and run `npm run build`. 
Within 2 minutes, your exam portal will be live on the internet!

---

## Local Development Setup

If you want to continue building locally:

```bash
# Install dependencies
npm install

# Push database schema (make sure URLs are in .env.local)
npx prisma db push

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to view the student portal, and `http://localhost:3000/admin/login` for the admin dashboard.
