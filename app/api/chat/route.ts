import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { leadId, message, userId } = await request.json();

    if (!leadId || !message || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get lead information
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', userId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Get conversation
    const { data: conversation } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('lead_id', leadId)
      .eq('is_active', true)
      .single();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Add user message
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...conversation.messages, userMessage];

    // Generate AI response
    const aiService = AIService.getInstance();
    const properties = await getPropertiesForUser(userId);
    const qualificationData = await getLeadQualificationData(leadId);

    const aiResponse = await aiService.generateChatResponse(updatedMessages, {
      userInfo: { company_name: 'Premier Realty Group' },
      properties,
      qualificationData,
    });

    const assistantMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    const finalMessages = [...updatedMessages, assistantMessage];

    // Update conversation
    await supabase
      .from('chatbot_conversations')
      .update({ messages: finalMessages })
      .eq('id', conversation.id);

    // Record interaction
    await supabase
      .from('lead_interactions')
      .insert({
        lead_id: leadId,
        user_id: userId,
        interaction_type: 'chat',
        content: message,
        direction: 'outbound',
        metadata: { platform: 'dashboard' },
      });

    // Extract qualification data
    const extractedData = await aiService.extractQualificationData(message);
    if (Object.keys(extractedData).length > 0) {
      await updateLeadQualificationData(leadId, extractedData);
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messages: finalMessages,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getPropertiesForUser(userId: string) {
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  return properties || [];
}

async function getLeadQualificationData(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (!lead) return {};

  return {
    budget_min: lead.budget_min,
    budget_max: lead.budget_max,
    preferred_locations: lead.preferred_locations,
    property_types: lead.property_types,
    transaction_type: lead.transaction_type,
    bedrooms_min: lead.bedrooms_min,
    bedrooms_max: lead.bedrooms_max,
    bathrooms_min: lead.bathrooms_min,
    bathrooms_max: lead.bathrooms_max,
    move_in_date: lead.move_in_date,
  };
}

async function updateLeadQualificationData(leadId: string, data: any) {
  const updateData: any = {};
  
  if (data.budget_min) updateData.budget_min = data.budget_min;
  if (data.budget_max) updateData.budget_max = data.budget_max;
  if (data.preferred_locations) updateData.preferred_locations = data.preferred_locations;
  if (data.property_types) updateData.property_types = data.property_types;
  if (data.transaction_type) updateData.transaction_type = data.transaction_type;
  if (data.bedrooms_min) updateData.bedrooms_min = data.bedrooms_min;
  if (data.bedrooms_max) updateData.bedrooms_max = data.bedrooms_max;
  if (data.bathrooms_min) updateData.bathrooms_min = data.bathrooms_min;
  if (data.bathrooms_max) updateData.bathrooms_max = data.bathrooms_max;
  if (data.move_in_date) updateData.move_in_date = data.move_in_date;
  if (data.email) updateData.email = data.email;

  if (Object.keys(updateData).length > 0) {
    await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId);
  }
}
