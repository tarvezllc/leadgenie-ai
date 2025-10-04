'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, LeadQualificationData, Property } from '@/types';
import { AIService } from '@/lib/ai-service';
import { supabase } from '@/lib/supabase';
import { Send, X, Home, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

interface ChatbotWidgetProps {
  userId: string;
  properties?: Property[];
  onLeadCreated?: (lead: any) => void;
  className?: string;
}

export default function ChatbotWidget({ 
  userId, 
  properties = [], 
  onLeadCreated,
  className = '' 
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qualificationData, setQualificationData] = useState<LeadQualificationData>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = AIService.getInstance();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: "Hi there! 👋 I'm Sarah, your AI real estate assistant. I'm here to help you find your perfect property! What brings you here today? Are you looking to buy, rent, or sell?",
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    
    // Create conversation record
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({
          session_id: sessionId,
          platform: 'website',
          messages: [welcomeMessage],
          is_active: true,
        })
        .select()
        .single();

      if (data && !error) {
        setConversationId(data.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Extract qualification data from user message
      console.log('🔍 Extracting qualification data from:', userMessage.content);
      const extractedData = await aiService.extractQualificationData(userMessage.content);
      console.log('📊 Extracted data:', extractedData);
      setQualificationData(prev => {
        const updated = { ...prev, ...extractedData };
        console.log('📈 Updated qualification data:', updated);
        return updated;
      });

      // Generate AI response
      const aiResponse = await aiService.generateChatResponse(newMessages, {
        userInfo: { company_name: 'Premier Realty Group' },
        properties,
        qualificationData: { ...qualificationData, ...extractedData },
      });

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      // Update conversation in database
      if (conversationId) {
        await supabase
          .from('chatbot_conversations')
          .update({ messages: finalMessages })
          .eq('id', conversationId);
      }

      // Check if we have enough information to create a lead
      if (shouldCreateLead(finalMessages)) {
        await createLead(finalMessages);
      }

    } catch (error) {
      console.error('Error handling message:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again or contact us directly.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const shouldCreateLead = (messages: ChatMessage[]): boolean => {
    // Much more flexible lead qualification - like real platforms
    const hasName = messages.some(msg => 
      msg.role === 'user' && 
      (msg.content.toLowerCase().includes('my name is') || 
       msg.content.toLowerCase().includes('i\'m ') ||
       msg.content.toLowerCase().includes('i am ') ||
       msg.content.toLowerCase().includes('call me') ||
       msg.content.toLowerCase().includes('i\'m ') ||
       msg.content.toLowerCase().includes('name is'))
    );
    
    const hasPhone = messages.some(msg => 
      msg.role === 'user' && 
      /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(msg.content)
    );

    const hasEmail = messages.some(msg => 
      msg.role === 'user' && 
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(msg.content)
    );

    const hasBudget = !!(qualificationData.budget_min || qualificationData.budget_max);
    const hasLocation = !!qualificationData.preferred_locations?.length;
    const hasTransactionType = !!qualificationData.transaction_type;
    const hasPropertyType = !!qualificationData.property_types?.length;

    // Check if user has shown real estate interest
    const hasRealEstateInterest = messages.some(msg => 
      msg.role === 'user' && 
      (msg.content.toLowerCase().includes('house') ||
       msg.content.toLowerCase().includes('apartment') ||
       msg.content.toLowerCase().includes('flat') ||
       msg.content.toLowerCase().includes('property') ||
       msg.content.toLowerCase().includes('buy') ||
       msg.content.toLowerCase().includes('rent') ||
       msg.content.toLowerCase().includes('sell') ||
       msg.content.toLowerCase().includes('home') ||
       msg.content.toLowerCase().includes('looking for') ||
       msg.content.toLowerCase().includes('need') ||
       msg.content.toLowerCase().includes('want'))
    );

    console.log('🔍 Lead qualification check:', {
      hasName,
      hasPhone,
      hasEmail,
      hasBudget,
      hasLocation,
      hasTransactionType,
      hasPropertyType,
      hasRealEstateInterest,
      qualificationData,
      messageCount: messages.length
    });

    // Much more flexible: Create lead if user has shown interest AND has contact info
    return hasRealEstateInterest && (hasName || hasPhone || hasEmail) && messages.length >= 3;
  };

  const createLead = async (messages: ChatMessage[]) => {
    try {
      // Extract lead information from conversation (more flexible)
      const nameMatch = messages.find(msg => 
        msg.role === 'user' && 
        (msg.content.toLowerCase().includes('my name is') || 
         msg.content.toLowerCase().includes('i\'m ') ||
         msg.content.toLowerCase().includes('i am ') ||
         msg.content.toLowerCase().includes('call me') ||
         msg.content.toLowerCase().includes('name is'))
      )?.content;

      const phoneMatch = messages.find(msg => 
        msg.role === 'user' && 
        /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(msg.content)
      )?.content;

      const emailMatch = messages.find(msg => 
        msg.role === 'user' && 
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(msg.content)
      )?.content;

      let firstName = 'Unknown';
      let lastName = 'Lead';
      let phone = '';
      let email = null;

      if (nameMatch) {
        // More flexible name extraction
        const namePatterns = [
          /my name is\s+(\w+)/i,
          /i'm\s+(\w+)/i,
          /i am\s+(\w+)/i,
          /call me\s+(\w+)/i,
          /name is\s+(\w+)/i
        ];
        
        for (const pattern of namePatterns) {
          const match = nameMatch.match(pattern);
          if (match) {
            firstName = match[1];
            break;
          }
        }
      }

      if (phoneMatch) {
        const phoneRegex = /\d{3}[-.]?\d{3}[-.]?\d{4}/;
        const match = phoneMatch.match(phoneRegex);
        if (match) {
          phone = match[0];
        }
      }

      if (emailMatch) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = emailMatch.match(emailRegex);
        if (match) {
          email = match[0];
        }
      }

      const leadData = {
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        phone: phone || 'Not provided',
        email: email,
        budget_min: qualificationData.budget_min || null,
        budget_max: qualificationData.budget_max || null,
        preferred_locations: qualificationData.preferred_locations || null,
        property_types: qualificationData.property_types || null,
        transaction_type: qualificationData.transaction_type || 'buy',
        bedrooms_min: qualificationData.bedrooms_min || null,
        bedrooms_max: qualificationData.bedrooms_max || null,
        bathrooms_min: qualificationData.bathrooms_min || null,
        bathrooms_max: qualificationData.bathrooms_max || null,
        move_in_date: qualificationData.move_in_date || null,
        source: 'website_chat' as const,
        website_session_id: sessionId,
        notes: `Qualified through chatbot conversation. Session: ${sessionId}`,
      };

      const { data: lead, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (lead && !error) {
        console.log('✅ Lead created successfully:', lead);
        
        // Update conversation with lead_id
        if (conversationId) {
          await supabase
            .from('chatbot_conversations')
            .update({ lead_id: lead.id })
            .eq('id', conversationId);
        }

        // Create initial interaction record
        await supabase
          .from('lead_interactions')
          .insert({
            lead_id: lead.id,
            user_id: userId,
            interaction_type: 'chat',
            content: `Initial chatbot conversation (${messages.length} messages)`,
            direction: 'inbound',
            metadata: { session_id: sessionId, message_count: messages.length },
          });

        console.log('🔄 Calling onLeadCreated callback...');
        onLeadCreated?.(lead);
        console.log('✅ onLeadCreated callback completed');

        // Generate property suggestions
        const suggestedProperties = await aiService.suggestProperties(qualificationData, properties);
        console.log('🏠 Suggested properties:', suggestedProperties);

        // Add success message with property suggestions
        let successContent = "Perfect! I've gathered your information and created your profile. ";
        
        if (suggestedProperties.length > 0) {
          successContent += `I found ${suggestedProperties.length} properties that match your criteria:\n\n`;
          suggestedProperties.forEach((property, index) => {
            successContent += `${index + 1}. **${property.title}** - $${property.price?.toLocaleString()}\n`;
            successContent += `   ${property.city}, ${property.state} • ${property.bedrooms} bed, ${property.bathrooms} bath\n\n`;
          });
          successContent += "One of our real estate agents will contact you within 24 hours to schedule viewings! 🏠✨";
        } else {
          successContent += "One of our real estate agents will contact you within 24 hours to discuss your property needs in more detail. Thank you for choosing us! 🏠✨";
        }

        const successMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: successContent,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Home className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Sarah - Real Estate Assistant</h3>
              <p className="text-sm opacity-90">Online now</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
