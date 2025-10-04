import { LeadQualificationData, ChatMessage, QualificationQuestion } from '@/types';

export interface MarketContext {
  currentMarket: string;
  marketTrends: MarketTrendData;
  localInsights: LocalInsights;
}

export interface MarketTrendData {
  avgDaysOnMarket: number;
  medianPrice: number;
  inventoryLevel: 'low' | 'moderate' | 'high';
  marketType: 'buyers' | 'sellers' | 'balanced';
  seasonalAdvice: string;
}

export interface LocalInsights {
  popularNeighborhoods: string[];
  upcomingDevelopments: string[];
  schoolDistricts: string[];
  amenities: string[];
  commuteHubs: string[];
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateChatResponse(
    messages: ChatMessage[],
    context: {
      userInfo?: any;
      properties?: any[];
      qualificationData?: LeadQualificationData;
      location?: string;
    }
  ): Promise<string> {
    // Get market context for intelligent responses
    const marketContext = await this.getMarketContext(context.location);
    const systemPrompt = this.buildSystemPrompt(context, marketContext);
    
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    try {
             // Check if we have a real OpenAI API key
             const hasRealApiKey = process.env.OPENAI_API_KEY &&
                                  process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' &&
                                  process.env.OPENAI_API_KEY.length > 20;

             if (!hasRealApiKey) {
               // Mock response for testing
               console.log('🤖 Using mock AI response for testing');
               return this.getMockResponse(messages[messages.length - 1]?.content || '');
             }

             console.log('🤖 Using real OpenAI API for AI responses');

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          system: systemPrompt,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'AI request failed');
      }

      const data = await response.json();
      return data.text || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, but I\'m having trouble responding right now. Please try again.';
    }
  }

  private getMockResponse(userMessage: string): string {
    const responses = [
      "Hi! I'm Sarah, your AI real estate assistant. I'd love to help you find your perfect property! What type of home are you looking for?",
      "That sounds great! What's your budget range for your new home?",
      "Perfect! Which areas are you most interested in? I have some amazing properties in San Francisco and Los Angeles.",
      "Excellent! Are you looking to buy or rent?",
      "Wonderful! How many bedrooms and bathrooms do you need?",
      "I have some fantastic options that match your criteria! Would you like me to show you a few properties?",
      "Great choice! I'd love to schedule a call to discuss your needs in more detail. What's the best way to reach you?",
      "Perfect! I'll connect you with one of our expert real estate agents who can help you find exactly what you're looking for."
    ];
    
    // Simple keyword-based responses for testing
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return responses[0];
    } else if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('price')) {
      return responses[1];
    } else if (userMessage.toLowerCase().includes('location') || userMessage.toLowerCase().includes('area')) {
      return responses[2];
    } else if (userMessage.toLowerCase().includes('buy') || userMessage.toLowerCase().includes('rent')) {
      return responses[3];
    } else if (userMessage.toLowerCase().includes('bedroom') || userMessage.toLowerCase().includes('bathroom')) {
      return responses[4];
    } else if (userMessage.toLowerCase().includes('show') || userMessage.toLowerCase().includes('property')) {
      return responses[5];
    } else if (userMessage.toLowerCase().includes('call') || userMessage.toLowerCase().includes('contact')) {
      return responses[6];
    } else {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  async extractQualificationData(message: string): Promise<Partial<LeadQualificationData>> {
    console.log('🤖 AI Service: Extracting qualification data from:', message);
    
    const prompt = `
    Extract real estate information from this casual message. Return ONLY valid JSON.
    
    Message: "${message}"
    
    Look for ANY of these (be very flexible):
    - budget_min/budget_max: Numbers with k/thousand/lakh/crore/million, or just numbers
    - preferred_locations: City names, areas, neighborhoods (any capitalized words)
    - property_types: house/home/flat/apartment/villa/condo/townhouse
    - transaction_type: buy/purchase/own/rent/rental/lease/sell/sale
    - bedrooms_min/bedrooms_max: Numbers with "bedroom" or "bed"
    - bathrooms_min/bathrooms_max: Numbers with "bathroom" or "bath"
    
    Examples:
    - "20k" → {"budget_max": 20000}
    - "around 50k" → {"budget_max": 50000}
    - "BTM Bangalore" → {"preferred_locations": ["BTM", "Bangalore"]}
    - "house" → {"property_types": ["single_family"]}
    - "2 bedroom" → {"bedrooms_min": 2}
    - "I want to buy" → {"transaction_type": "buy"}
    - "looking for rent" → {"transaction_type": "rent"}
    
    Be VERY liberal. Extract anything that could be relevant.
    Return ONLY valid JSON, no explanations. If nothing found, return {}.
    `;

    try {
      console.log('📡 AI Service: Calling API for qualification extraction...');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: 300, temperature: 0.1 }),
      });
      
      if (!res.ok) {
        console.error('❌ AI Service: API call failed:', res.status, res.statusText);
        return {};
      }
      
      const response = (await res.json()).text;
      console.log('📝 AI Service: Raw API response:', response);
      
      if (response) {
        // Clean up markdown code blocks if present
        let cleanResponse = response.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        console.log('🧹 AI Service: Cleaned response:', cleanResponse);
        
        const parsed = JSON.parse(cleanResponse);
        console.log('✅ AI Service: Parsed qualification data:', parsed);
        
        // If AI returned empty object, try regex fallback
        if (Object.keys(parsed).length === 0) {
          console.log('🔄 AI Service: AI returned empty, trying regex fallback...');
          const fallbackData = this.extractWithRegex(message);
          if (Object.keys(fallbackData).length > 0) {
            console.log('✅ AI Service: Regex fallback found data:', fallbackData);
            return fallbackData;
          }
        }
        
        return parsed;
      }
    } catch (error) {
      console.error('❌ AI Service: Error extracting qualification data:', error);
    }
    
    console.log('⚠️ AI Service: Returning empty qualification data');
    return {};
  }

  private extractWithRegex(message: string): Partial<LeadQualificationData> {
    const data: Partial<LeadQualificationData> = {};
    const lowerMessage = message.toLowerCase();

    // Extract budget (more flexible patterns)
    const budgetPatterns = [
      /(\d+)\s*(k|thousand)/i,
      /(\d+)\s*(lakh|lac)/i,
      /(\d+)\s*(crore)/i,
      /(\d+)\s*(million)/i,
      /budget.*?(\d+)/i,
      /around.*?(\d+)/i,
      /upto.*?(\d+)/i,
      /max.*?(\d+)/i
    ];

    for (const pattern of budgetPatterns) {
      const match = message.match(pattern);
      if (match) {
        const num = parseInt(match[1]);
        const unit = match[2]?.toLowerCase();
        if (unit === 'k' || unit === 'thousand') {
          data.budget_max = num * 1000;
        } else if (unit === 'lakh' || unit === 'lac') {
          data.budget_max = num * 100000;
        } else if (unit === 'crore') {
          data.budget_max = num * 10000000;
        } else if (unit === 'million') {
          data.budget_max = num * 1000000;
        } else {
          // Just a number, assume it's in thousands
          data.budget_max = num * 1000;
        }
        break;
      }
    }

    // Extract property types (more flexible)
    const propertyTypes = [
      { keywords: ['house', 'home', 'bungalow'], type: 'single_family' },
      { keywords: ['flat', 'apartment', 'apt'], type: 'apartment' },
      { keywords: ['condo', 'condominium'], type: 'condo' },
      { keywords: ['villa', 'mansion'], type: 'single_family' },
      { keywords: ['townhouse', 'town house'], type: 'townhouse' },
      { keywords: ['commercial', 'office'], type: 'commercial' }
    ];

    for (const { keywords, type } of propertyTypes) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        data.property_types = [type as any];
        break;
      }
    }

    // Extract transaction type (more flexible)
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('own')) {
      data.transaction_type = 'buy';
    } else if (lowerMessage.includes('rent') || lowerMessage.includes('rental') || lowerMessage.includes('lease')) {
      data.transaction_type = 'rent';
    } else if (lowerMessage.includes('sell') || lowerMessage.includes('sale')) {
      data.transaction_type = 'sell';
    }

    // Extract locations (better heuristic)
    const commonWords = ['house', 'flat', 'apartment', 'villa', 'condo', 'townhouse', 'single', 'family', 'looking', 'for', 'want', 'need', 'budget', 'around', 'near', 'in'];
    const words = message.split(/\s+/).filter(word => 
      word.length > 2 && 
      /^[A-Za-z]+$/.test(word) && 
      !commonWords.includes(word.toLowerCase())
    );
    
    // Look for capitalized words (likely place names)
    const capitalizedWords = words.filter(word => /^[A-Z]/.test(word));
    if (capitalizedWords.length > 0) {
      data.preferred_locations = capitalizedWords;
    }

    return data;
  }

  async generateFollowUpMessage(lead: any, properties: any[]): Promise<string> {
    const prompt = `
    Generate a personalized follow-up message for a real estate lead.
    
    Lead Information:
    - Name: ${lead.first_name} ${lead.last_name}
    - Transaction Type: ${lead.transaction_type}
    - Budget: $${lead.budget_min?.toLocaleString()} - $${lead.budget_max?.toLocaleString()}
    - Preferred Locations: ${lead.preferred_locations?.join(', ') || 'Not specified'}
    - Property Types: ${lead.property_types?.join(', ') || 'Not specified'}
    
    Available Properties (${properties.length}):
    ${properties.slice(0, 3).map(p => 
      `- ${p.title} in ${p.city}, ${p.state} - $${p.price?.toLocaleString()} (${p.property_type}, ${p.bedrooms} bed, ${p.bathrooms} bath)`
    ).join('\n')}
    
    Write a warm, professional follow-up message that:
    1. References their specific requirements
    2. Mentions 1-2 relevant properties
    3. Offers to schedule a viewing or call
    4. Keeps it concise (2-3 sentences)
    
    Tone: Professional but friendly, like a trusted real estate advisor.
    `;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.8 }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      return data.text || 'Thank you for your interest! I\'d love to help you find the perfect property.';
    } catch (error) {
      console.error('Error generating follow-up message:', error);
      return 'Thank you for your interest! I\'d love to help you find the perfect property.';
    }
  }

  async suggestProperties(qualificationData: LeadQualificationData, availableProperties: any[]): Promise<any[]> {
    const prompt = `
    Given these property requirements and available properties, suggest the best matches.
    
    Requirements:
    - Budget: $${qualificationData.budget_min?.toLocaleString()} - $${qualificationData.budget_max?.toLocaleString()}
    - Locations: ${qualificationData.preferred_locations?.join(', ') || 'Any'}
    - Property Types: ${qualificationData.property_types?.join(', ') || 'Any'}
    - Transaction: ${qualificationData.transaction_type}
    - Bedrooms: ${qualificationData.bedrooms_min || 'Any'} - ${qualificationData.bedrooms_max || 'Any'}
    - Bathrooms: ${qualificationData.bathrooms_min || 'Any'} - ${qualificationData.bathrooms_max || 'Any'}
    
    Available Properties:
    ${availableProperties.map((p, i) => 
      `${i + 1}. ${p.title} - $${p.price?.toLocaleString()} - ${p.city}, ${p.state} - ${p.property_type} - ${p.bedrooms} bed, ${p.bathrooms} bath`
    ).join('\n')}
    
    Return a JSON array of property IDs that best match the requirements, ordered by relevance (best match first).
    Include only the property IDs as strings in the array.
    `;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.1 }),
      });
      if (!res.ok) return availableProperties.filter(p => {
        if (qualificationData.budget_max && p.price && p.price > qualificationData.budget_max) return false;
        if (qualificationData.budget_min && p.price && p.price < qualificationData.budget_min) return false;
        if (qualificationData.property_types?.length && !qualificationData.property_types.includes(p.property_type)) return false;
        return true;
      }).slice(0, 3);
      const response = (await res.json()).text;
      if (response) {
        const suggestedIds = JSON.parse(response);
        return availableProperties.filter(p => suggestedIds.includes(p.id));
      }
    } catch (error) {
      console.error('Error suggesting properties:', error);
    }
    
    // Fallback: return properties that match basic criteria
    return availableProperties.filter(p => {
      if (qualificationData.budget_max && p.price && p.price > qualificationData.budget_max) return false;
      if (qualificationData.budget_min && p.price && p.price < qualificationData.budget_min) return false;
      if (qualificationData.property_types?.length && !qualificationData.property_types.includes(p.property_type)) return false;
      return true;
    }).slice(0, 3);
  }

  // Market Intelligence Methods
  async getMarketContext(location?: string): Promise<MarketContext> {
    // For now, return mock data - in production this would query real estate APIs
    const mockMarket: MarketContext = {
      currentMarket: location || 'San Francisco Bay Area',
      marketTrends: {
        avgDaysOnMarket: 28,
        medianPrice: 850000,
        inventoryLevel: 'low',
        marketType: 'balanced',
        seasonalAdvice: 'Spring is prime buying season! Inventory typically increases 15% and competition heats up.'
      },
      localInsights: {
        popularNeighborhoods: ['Downtown', 'Mission District', 'Castro', 'Noe Valley', 'Pacific Heights'],
        upcomingDevelopments: ['Central Park Towers (2024)', 'Bayview Heights Redevelopment', 'Transit Village Phase 2'],
        schoolDistricts: ['San Francisco Unified', 'Private schools: Sacred Heart, UHS'],
        amenities: ['Golden Gate Park', 'SFMoMA', 'Chase Center', 'Baker Beach'],
        commuteHubs: ['Caltrain', 'BART', 'Muni Metro', 'Ferry Building']
      }
    };
    
    return mockMarket;
  }

  getMarketInsight(context: MarketContext, userQuery: string): string {
    const trends = context.marketTrends;
    const insights = context.localInsights;
    
    // Generate contextual advice based on current market
    if (userQuery.toLowerCase().includes('market')) {
      if (trends.marketType === 'sellers') {
        return `Great time to sell! We're in a seller's market with properties averaging ${trends.avgDaysOnMarket} days on market and low inventory.`;
      } else if (trends.marketType === 'buyers') {
        return `Buyer-friendly market! With ${trends.inventoryLevel} inventory, you have more negotiating power and selection.`;
      } else {
        return `Balanced market conditions! Properties are moving at a healthy pace with fair pricing across most neighborhoods.`;
      }
    }
    
    if (userQuery.toLowerCase().includes('neighborhood')) {
      return `Popular areas right now include ${insights.popularNeighborhoods.slice(0, 3).join(', ')} - each offers unique lifestyle options worth exploring!`;
    }
    
    if (userQuery.toLowerCase().includes('investment') || userQuery.toLowerCase().includes('roi')) {
      return `Smart thinking! With median prices at $${trends.medianPrice.toLocaleString()}, consider neighborhoods near upcoming developments like ${insights.upcomingDevelopments[0]}.`;
    }
    
    return '';
  }

  private buildSystemPrompt(context: any, marketContext: MarketContext): string {
    const trends = marketContext.marketTrends;
    const insights = marketContext.localInsights;
    
    return `You are Sarah, an experienced real estate advisor with deep local market knowledge. You help clients make informed property decisions.

MARKET EXPERTISE (CURRENT ${marketContext.currentMarket} MARKET):
- Market Type: ${trends.marketType} market - ${trends.avgDaysOnMarket || 28} days average on market
- Median Price: $${trends.medianPrice.toLocaleString()}
- Inventory Level: ${trends.inventoryLevel}
- Seasonal Advice: ${trends.seasonalAdvice}

LOCAL INSIGHTS:
- Popular Neighborhoods: ${insights.popularNeighborhoods.join(', ')}
- Upcoming Developments: ${insights.upcomingDevelopments.join(', ')}
- Top School Districts: ${insights.schoolDistricts.join(', ')}
- Key Amenities: ${insights.amenities.join(', ')}
- Commute Options: ${insights.commuteHubs.join(', ')}

EXPERTISE AREAS:
- You have insider knowledge of local market conditions
- You understand pricing trends, inventory levels, and seasonal patterns
- You know neighborhood nuances, school districts, and amenities
- You can advise on investment potential and market timing
- Share specific market data when relevant (median prices, days on market, inventory levels)

PERSONALITY:
- Warm, conversational, and helpful
- Like talking to a knowledgeable friend who happens to be a real estate expert
- Share market insights naturally when relevant
- Ask questions naturally, not like a form
- Be encouraging and supportive

HOW TO QUALIFY LEADS:
Instead of rigid questions, have natural conversations about:
- What they're looking for (casually ask about budget, location, type)
- Their timeline and needs
- Contact info (phone/email) when it feels natural

CONVERSATION STYLE:
- Talk like a real person, not a robot
- Ask follow-up questions based on what they say
- Share relevant market insights and property info when you have it
- Be flexible - if they mention budget/location/type in passing, acknowledge it
- Don't force specific questions if they're already sharing info
- Reference current market conditions naturally ("In this market..." "Given today's inventory levels...")

EXAMPLES OF ENHANCED CONVERSATION:
- "That sounds great! What's your budget range? Median prices are around $${trends.medianPrice.toLocaleString()} here, so I can suggest neighborhoods that fit."
- "Oh nice! What area are you thinking? ${insights.popularNeighborhoods.slice(0).join(' and ')} are especially hot right now!"
- "Perfect! When are you looking to move? ${trends.seasonalAdvice}"

RESPONSE GUIDELINES:
- Keep responses conversational (1-2 sentences typically)
- Use natural language, not formal business speak
- Ask one thing at a time, but be flexible
- If they share multiple things, acknowledge and ask follow-ups
- Insert relevant market data naturally ("A typical condo in this area...", "Competition is ${trends.inventoryLevel === 'low' ? 'tough with low inventory' : 'moderate'} these days")
- Use emojis occasionally to keep it friendly
- If they go off-topic, gently redirect: "That's interesting! So about your property search..."

${context.userInfo ? `You're representing ${context.userInfo.company_name || 'our real estate team'}.` : ''}
${context.properties?.length ? `You have ${context.properties.length} properties to suggest when relevant.` : ''}

Remember: You're not just a chatbot - you're a knowledgeable market expert who happens to chat naturally. Share insights that position you as the local expert!`;
  }
}
