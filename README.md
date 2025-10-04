# LeadGenie AI - README

## 🏠 AI-Powered Real Estate CRM & Chatbot

LeadGenie AI is an advanced AI-powered chatbot and mini-CRM system designed specifically for US real estate agents. It captures leads 24/7, qualifies them intelligently, and helps you manage your pipeline with automated follow-ups and property matching.

## ✨ Features

### 🤖 AI-Powered Chatbot
- **24/7 Lead Capture**: Never miss a lead with intelligent chatbot
- **Smart Qualification**: AI automatically gathers budget, location, and preferences
- **Multi-Platform**: Website widget + WhatsApp integration
- **Natural Conversations**: GPT-4o-mini powered responses

### 📊 Mini-CRM Dashboard
- **Lead Management**: Track leads through sales funnel stages
- **Real-time Analytics**: Monitor conversion rates and performance
- **Property Matching**: AI suggests relevant properties
- **Follow-up Automation**: Automated nurturing campaigns

### 📱 WhatsApp Integration
- **Direct Messaging**: Communicate via WhatsApp
- **Automated Responses**: AI handles initial conversations
- **Lead Sync**: All conversations sync to CRM

### 🔄 Smart Automation
- **Follow-up Sequences**: Automated nurturing campaigns
- **Lead Scoring**: Prioritize hottest prospects
- **Property Suggestions**: AI recommendations
- **n8n Integration**: Advanced workflow automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- OpenAI API key
- Twilio account (for WhatsApp)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/leadgenie-ai.git
cd leadgenie-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

4. **Set up Supabase database**
```bash
# Run the migration
supabase db push

# Seed with sample data
supabase db seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-4o-mini
- **Messaging**: Twilio WhatsApp API
- **Automation**: n8n workflows
- **Hosting**: Vercel

### Database Schema

#### Core Tables
- **users**: Real estate agents
- **properties**: Property listings
- **leads**: Lead information and qualification data
- **lead_interactions**: Chat history and interactions
- **lead_follow_ups**: Scheduled follow-up tasks
- **chatbot_conversations**: Chatbot session data

#### Key Relationships
- Users have many Properties and Leads
- Leads have many Interactions and Follow-ups
- Conversations link to Leads and store message history

## 📱 Usage

### Dashboard
1. **View Leads**: See all leads with status and qualification data
2. **Manage Properties**: Add and update property listings
3. **Track Interactions**: Monitor all lead communications
4. **Schedule Follow-ups**: Set automated reminders
5. **View Analytics**: Monitor performance metrics

### Chatbot Widget
1. **Add to Website**: Include the ChatbotWidget component
2. **Configure Settings**: Set AI personality and qualification questions
3. **Monitor Conversations**: View chat history in dashboard
4. **Review Leads**: Check AI-qualified lead data

### WhatsApp Integration
1. **Set up Webhook**: Configure Twilio webhook URL
2. **Test Integration**: Send test messages
3. **Monitor Conversations**: View WhatsApp chats in dashboard
4. **Automate Responses**: AI handles initial conversations

## 🔧 Configuration

### AI Service Configuration
```typescript
// lib/ai-service.ts
const aiService = AIService.getInstance();

// Customize AI personality
const systemPrompt = `You are Sarah, a professional real estate agent assistant...`;

// Configure qualification questions
const qualificationQuestions = [
  {
    question: "What's your budget range?",
    field: "budget",
    type: "range"
  }
];
```

### Chatbot Widget Configuration
```tsx
<ChatbotWidget
  userId={userId}
  properties={properties}
  onLeadCreated={handleLeadCreated}
  className="custom-styles"
/>
```

### WhatsApp Webhook Setup
1. **Configure Twilio**: Set webhook URL to `/api/whatsapp/webhook`
2. **Test Messages**: Send test messages to verify integration
3. **Monitor Logs**: Check webhook logs for errors

## 🤖 AI Features

### Lead Qualification
- **Budget Detection**: Extract price ranges from conversations
- **Location Preferences**: Identify preferred areas
- **Property Types**: Determine property preferences
- **Timeline**: Understand urgency and move-in dates
- **Contact Preferences**: Learn communication preferences

### Property Matching
- **Smart Suggestions**: AI recommends relevant properties
- **Scoring Algorithm**: Rate property-lead compatibility
- **Feature Matching**: Match based on requirements
- **Location Optimization**: Consider commute and preferences

### Follow-up Automation
- **Personalized Messages**: AI generates custom follow-ups
- **Timing Optimization**: Send messages at optimal times
- **Multi-channel**: Email, WhatsApp, and SMS options
- **A/B Testing**: Test different message variations

## 📊 Analytics

### Key Metrics
- **Lead Volume**: Total leads captured
- **Conversion Rate**: Lead to appointment rate
- **Response Time**: Average response to leads
- **Qualification Rate**: Percentage of qualified leads
- **Revenue Impact**: Closed deals and commission

### Dashboard Views
- **Overview**: High-level metrics and trends
- **Lead Pipeline**: Stage-by-stage progression
- **Performance**: Individual agent metrics
- **Properties**: Listing performance and views

## 🔄 Automation Workflows

### n8n Integration
1. **Lead Follow-up**: Automated welcome messages
2. **Daily Nurturing**: Regular check-ins with leads
3. **Property Alerts**: Notify leads of new matches
4. **Appointment Reminders**: Automated scheduling

### Workflow Examples
- **New Lead**: Welcome email → Schedule follow-up → Property suggestions
- **Stale Lead**: Nurturing message → Re-engagement campaign
- **Qualified Lead**: Priority alert → Agent notification → Property tour

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link GitHub to Vercel
2. **Set Environment Variables**: Add all required keys
3. **Deploy**: Automatic deployment on push
4. **Configure Domain**: Set up custom domain

### Environment Variables
```env
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your_openai_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Performance

### Optimization Features
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js image optimization
- **Caching**: Supabase query caching
- **CDN**: Vercel edge network

### Monitoring
- **Error Tracking**: Built-in error monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Database Monitoring**: Supabase performance insights
- **API Monitoring**: Response time tracking

## 🔒 Security

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row-level security policies
- **GDPR Compliance**: Full data protection compliance

### Best Practices
- **Environment Variables**: Never commit secrets
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent API abuse
- **Audit Logging**: Track all data access

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📞 Support

### Documentation
- **API Docs**: `/docs/api`
- **Component Library**: `/docs/components`
- **Deployment Guide**: `/docs/deployment`

### Community
- **Discord**: Join our community
- **GitHub Issues**: Report bugs and feature requests
- **Email Support**: support@leadgenieai.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the GPT-4o-mini API
- **Supabase**: For the excellent backend platform
- **Vercel**: For seamless deployment
- **Twilio**: For WhatsApp integration
- **n8n**: For workflow automation

---

**Built with ❤️ for real estate agents who want to scale their business with AI.**
