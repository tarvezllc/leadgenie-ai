import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabase } from '@/lib/supabase';
import { AIService } from '@/lib/ai-service';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const from = body.get('From') as string;
    const to = body.get('To') as string;
    const messageBody = body.get('Body') as string;
    const messageSid = body.get('MessageSid') as string;

    console.log('WhatsApp webhook received:', { from, to, messageBody });

    // Extract phone number from WhatsApp format
    const phoneNumber = from.replace('whatsapp:', '');
    
    // Find or create lead
    let lead = await findOrCreateLead(phoneNumber, messageBody);
    
    if (!lead) {
      return new NextResponse('Lead not found', { status: 404 });
    }

    // Get or create conversation
    let conversation = await getOrCreateConversation(lead.id, messageSid);
    
    // Add user message to conversation
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageBody,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...conversation.messages, userMessage];

    // Generate AI response
    const aiService = AIService.getInstance();
    const aiResponse = await aiService.generateChatResponse(updatedMessages, {
      userInfo: { company_name: 'Premier Realty Group' },
      properties: await getPropertiesForUser(lead.user_id),
      qualificationData: await getLeadQualificationData(lead.id),
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
        lead_id: lead.id,
        user_id: lead.user_id,
        interaction_type: 'whatsapp',
        content: messageBody,
        direction: 'inbound',
        metadata: { message_sid: messageSid, phone_number: phoneNumber },
      });

    // Send WhatsApp response
    await sendWhatsAppMessage(to, from, aiResponse);

    // Extract and update qualification data
    const extractedData = await aiService.extractQualificationData(messageBody);
    if (Object.keys(extractedData).length > 0) {
      await updateLeadQualificationData(lead.id, extractedData);
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

async function findOrCreateLead(phoneNumber: string, messageBody: string) {
  // Try to find existing lead
  const { data: existingLead } = await supabase
    .from('leads')
    .select('*')
    .eq('phone', phoneNumber)
    .single();

  if (existingLead) {
    return existingLead;
  }

  // Extract name from message if possible
  const nameMatch = messageBody.match(/(?:my name is|i'm|i am)\s+([a-zA-Z\s]+)/i);
  const firstName = nameMatch ? nameMatch[1].split(' ')[0] : 'Unknown';
  const lastName = nameMatch && nameMatch[1].split(' ').length > 1 
    ? nameMatch[1].split(' ').slice(1).join(' ') 
    : 'Lead';

  // Create new lead (using first user as default)
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (!users || users.length === 0) {
    return null;
  }

  const { data: newLead, error } = await supabase
    .from('leads')
    .insert({
      user_id: users[0].id,
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
      source: 'whatsapp',
      whatsapp_conversation_id: `whatsapp_${phoneNumber}`,
      notes: `Created from WhatsApp message: "${messageBody}"`,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }

  return newLead;
}

async function getOrCreateConversation(leadId: string, messageSid: string) {
  const { data: existingConversation } = await supabase
    .from('chatbot_conversations')
    .select('*')
    .eq('lead_id', leadId)
    .eq('platform', 'whatsapp')
    .eq('is_active', true)
    .single();

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation
  const { data: newConversation, error } = await supabase
    .from('chatbot_conversations')
    .insert({
      lead_id: leadId,
      session_id: `whatsapp_${messageSid}`,
      platform: 'whatsapp',
      messages: [],
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return newConversation;
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

async function sendWhatsAppMessage(to: string, from: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      from: to, // This should be your Twilio WhatsApp number
      to: from, // This is the customer's WhatsApp number
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}
