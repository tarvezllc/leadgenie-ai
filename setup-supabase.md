# Supabase Setup Guide for LeadGenie AI

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub/Google
3. Click "New Project"
4. Choose **FREE** plan
5. Fill in:
   - **Name**: `leadgenie-ai`
   - **Database Password**: Generate strong password
   - **Region**: US East (or closest to you)

### 2. Get Your Keys
Go to **Settings** → **API** and copy:
- **Project URL**: `https://your-project-ref.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role secret key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Environment Variables
Replace the placeholder values in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Database Setup
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push the database schema
supabase db push

# Seed with sample data
supabase db seed
```

### 5. Test the Setup
```bash
# Restart the development server
npm run dev
```

## 🎯 What You Get (Free Tier)

- **500MB Database Storage** (plenty for MVP)
- **2GB Bandwidth** per month
- **50,000 Monthly Active Users**
- **Real-time subscriptions**
- **Row Level Security**
- **API auto-generation**

## 🔧 Alternative: Manual Setup

If you prefer to set up the database manually:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL
4. Copy and paste the contents of `supabase/seed/001_sample_data.sql`
5. Run the seed data

## 🚨 Troubleshooting

**"Invalid supabaseUrl" error:**
- Make sure your URL starts with `https://`
- Check that you copied the full URL

**"Invalid API key" error:**
- Make sure you're using the correct anon key
- Check for extra spaces or characters

**Database connection issues:**
- Verify your project is active in Supabase dashboard
- Check that you're using the correct project reference

## 📞 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
