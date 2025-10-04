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
git clone https://github.com/tarvezllc/leadgenie-ai.git
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

// CustomizeAI personality
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

```