# LeadGenie AI - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Supabase account
- OpenAI API key
- Twilio account (optional)

### Step 1: Fork Repository
1. Go to the LeadGenie AI repository
2. Click "Fork" to create your own copy
3. Clone your forked repository locally

### Step 2: Set up Supabase
1. **Create new project** at [supabase.com](https://supabase.com)
2. **Run migrations**:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize project
   supabase init
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   
   # Seed with sample data
   supabase db seed
   ```

3. **Get your keys**:
   - Project URL
   - Anon key
   - Service role key

### Step 3: Deploy to Vercel
1. **Connect GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "LeadGenie AI" project

2. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=sk-your_openai_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   NEXTAUTH_SECRET=your_random_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Step 4: Configure WhatsApp (Optional)
1. **Set up Twilio**:
   - Create Twilio account
   - Get WhatsApp sandbox number
   - Configure webhook URL: `https://your-domain.vercel.app/api/whatsapp/webhook`

2. **Test integration**:
   - Send test message to WhatsApp number
   - Verify webhook receives messages
   - Check dashboard for new leads

## 🐳 Docker Deployment

### Build Docker Image
```bash
# Build image
docker build -t leadgenie-ai .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  leadgenie-ai
```

### Docker Compose
```yaml
version: '3.8'
services:
  leadgenie-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Required Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Application Configuration
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-domain.com
```

### Optional Variables
```env
# 360Dialog Alternative
DIALOG360_API_KEY=your_dialog360_key
DIALOG360_WHATSAPP_NUMBER=your_whatsapp_number

# n8n Integration
N8N_WEBHOOK_URL=your_n8n_webhook_url

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token
```

## 📊 Monitoring & Analytics

### Vercel Analytics
1. **Enable Vercel Analytics**:
   - Go to project settings
   - Enable Analytics
   - View performance metrics

### Error Monitoring
1. **Sentry Integration**:
   ```bash
   npm install @sentry/nextjs
   ```
   
2. **Configure Sentry**:
   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### Database Monitoring
1. **Supabase Dashboard**:
   - Monitor database performance
   - View query analytics
   - Check error logs

## 🔒 Security Configuration

### Supabase Security
1. **Row Level Security**:
   ```sql
   -- Enable RLS on leads table
   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
   
   -- Create policy for users
   CREATE POLICY "Users can view their own leads" ON leads
     FOR ALL USING (auth.uid() = user_id);
   ```

2. **API Security**:
   - Use service role key only server-side
   - Validate all inputs
   - Implement rate limiting

### Environment Security
1. **Never commit secrets**:
   - Use `.env.local` for local development
   - Use Vercel environment variables for production
   - Rotate keys regularly

2. **CORS Configuration**:
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
             { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
             { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
           ],
         },
       ];
     },
   };
   ```

## 🚀 Production Optimization

### Performance
1. **Enable ISR**:
   ```javascript
   export async function getStaticProps() {
     return {
       props: { data },
       revalidate: 60, // Revalidate every minute
     };
   }
   ```

2. **Image Optimization**:
   ```javascript
   import Image from 'next/image';
   
   <Image
     src="/property.jpg"
     alt="Property"
     width={500}
     height={300}
     priority
   />
   ```

3. **Bundle Analysis**:
   ```bash
   npm install -g @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

### Caching
1. **API Route Caching**:
   ```javascript
   export async function GET() {
     return new Response(data, {
       headers: {
         'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
       },
     });
   }
   ```

2. **Database Query Optimization**:
   ```javascript
   // Use indexes for common queries
   const { data } = await supabase
     .from('leads')
     .select('*')
     .eq('user_id', userId)
     .eq('status', 'new')
     .order('created_at', { ascending: false })
     .limit(20);
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions
The project includes a complete CI/CD pipeline:

1. **Testing**: Automated tests on every push
2. **Building**: Production build verification
3. **Deployment**: Automatic deployment to Vercel
4. **Security**: Security scanning with Snyk

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add OPENAI_API_KEY
# ... add all required variables
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables
   - Verify TypeScript errors
   - Check dependency versions

2. **Database Connection**:
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review database permissions

3. **WhatsApp Integration**:
   - Verify Twilio credentials
   - Check webhook URL configuration
   - Test with sandbox number first

4. **AI Responses**:
   - Verify OpenAI API key
   - Check API rate limits
   - Review prompt configuration

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## 📞 Support

### Getting Help
- **Documentation**: Check README.md
- **Issues**: GitHub Issues
- **Community**: Discord Server
- **Email**: support@leadgenieai.com

### Professional Support
- **Setup Assistance**: $200/hour
- **Custom Development**: $150/hour
- **Training Sessions**: $100/hour
- **Priority Support**: $500/month

---

**Ready to deploy? Follow the Quick Deployment guide above and you'll be live in under 10 minutes!**
