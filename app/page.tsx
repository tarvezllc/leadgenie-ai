'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lead, Property, LeadInteraction } from '@/types';
import ChatbotWidget from '@/components/ChatbotWidget';

// Utility functions
const formatNumberString = (numStr: string) => {
  return new Intl.NumberFormat('en-US').format(parseInt(numStr));
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
import { 
  Users, 
  Home, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  DollarSign,
  Filter,
  Search,
  Plus,
  Eye,
  MessageSquare,
  Trash2,
  Edit,
  MoreVertical,
  CheckCircle,
  Clock,
  Star,
  Filter as FilterIcon,
  Download,
  Share2,
  PhoneCall
} from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [interactions, setInteractions] = useState<LeadInteraction[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    closedWon: 0,
    totalValue: 0,
  });

  // Enhanced CRM state
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editLeadData, setEditLeadData] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Demo user ID - in production, this would come from authentication
  const userId = '550e8400-e29b-41d4-a716-446655440001';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('🔄 Loading dashboard data...');
      console.log('📍 User ID:', userId);
      
      // Load leads
      console.log('📊 Fetching leads...');
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('❌ Leads error:', leadsError);
        throw leadsError;
      }
      console.log('✅ Leads loaded:', leadsData?.length || 0);
      setLeads(leadsData || []);

      // Load properties
      console.log('🏠 Fetching properties...');
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (propertiesError) {
        console.error('❌ Properties error:', propertiesError);
        throw propertiesError;
      }
      console.log('✅ Properties loaded:', propertiesData?.length || 0);
      setProperties(propertiesData || []);

      // Calculate stats
      const totalLeads = leadsData?.length || 0;
      const newLeads = leadsData?.filter(l => l.status === 'new').length || 0;
      const qualifiedLeads = leadsData?.filter(l => l.status === 'qualified').length || 0;
      const closedWon = leadsData?.filter(l => l.status === 'closed_won').length || 0;
      const totalValue = leadsData
        ?.filter(l => l.status === 'closed_won')
        .reduce((sum, l) => sum + (l.budget_max || 0), 0) || 0;

      console.log('📈 Stats calculated:', { totalLeads, newLeads, qualifiedLeads, closedWon, totalValue });

      setStats({
        totalLeads,
        newLeads,
        qualifiedLeads,
        closedWon,
        totalValue,
      });

      console.log('🎉 Dashboard data loaded successfully!');

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      // Set some default data so the UI doesn't break
      setLeads([]);
      setProperties([]);
      setStats({
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        closedWon: 0,
        totalValue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLeadInteractions = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    loadLeadInteractions(lead.id);
  };

  const handleLeadCreated = (newLead: Lead) => {
    console.log('🎉 Dashboard: New lead received:', newLead);
    setLeads(prev => {
      const updated = [newLead, ...prev];
      console.log('📊 Dashboard: Updated leads count:', updated.length);
      return updated;
    });
    setStats(prev => ({
      ...prev,
      totalLeads: prev.totalLeads + 1,
      newLeads: prev.newLeads + 1,
    }));
    console.log('✅ Dashboard: Lead added to state');
  };

  // Enhanced CRM Functions
  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      setStats(prev => ({
        ...prev,
        totalLeads: prev.totalLeads - 1,
        newLeads: Math.max(0, prev.newLeads - 1),
      }));
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .in('id', selectedLeads);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
      setStats(prev => ({
        ...prev,
        totalLeads: prev.totalLeads - selectedLeads.length,
        newLeads: Math.max(0, prev.newLeads - selectedLeads.length),
      }));
      setSelectedLeads([]);
    } catch (error) {
      console.error('Error bulk deleting leads:', error);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: status as any, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: status as any } : lead
      ));
      
      // Update stats
      loadDashboardData();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Filter and sort leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      (`${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aVal = a[sortBy as keyof Lead];
    const bVal = b[sortBy as keyof Lead];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? 
        aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus as any } : lead
      ));

      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'status-new',
      contacted: 'status-contacted',
      qualified: 'status-qualified',
      site_visit: 'status-site-visit',
      negotiation: 'status-negotiation',
      closed_won: 'status-closed-won',
      closed_lost: 'status-closed-lost',
    };
    return colors[status as keyof typeof colors] || 'status-new';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gradient">LeadGenie AI</h1>
              <p className="text-gray-600 mt-1">AI-Powered Real Estate CRM</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold">Sarah Johnson</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                SJ
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed Won</p>
                <p className="text-2xl font-bold text-gray-900">{stats.closedWon}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button className="btn-secondary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleLeadSelect(lead)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {lead.first_name[0]}{lead.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{lead.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`status-badge ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                      {lead.budget_max && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${lead.budget_min?.toLocaleString()} - ${lead.budget_max.toLocaleString()}
                        </div>
                      )}
                      {lead.preferred_locations?.length && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {lead.preferred_locations.join(', ')}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        {lead.transaction_type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Lead Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                      className="mt-1 input-field"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="site_visit">Site Visit</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Info</label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedLead.phone}
                      </div>
                      {selectedLead.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedLead.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedLead.budget_max && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Budget</label>
                      <p className="mt-1 text-sm text-gray-900">
                        ${selectedLead.budget_min?.toLocaleString()} - ${selectedLead.budget_max.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedLead.preferred_locations?.length && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedLead.preferred_locations.join(', ')}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property Types</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.property_types?.join(', ') || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {selectedLead.bedrooms_min && selectedLead.bedrooms_max && (
                        <p>Bedrooms: {selectedLead.bedrooms_min} - {selectedLead.bedrooms_max}</p>
                      )}
                      {selectedLead.bathrooms_min && selectedLead.bathrooms_max && (
                        <p>Bathrooms: {selectedLead.bathrooms_min} - {selectedLead.bathrooms_max}</p>
                      )}
                      {selectedLead.move_in_date && (
                        <p>Move-in: {new Date(selectedLead.move_in_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Interactions</h4>
                  <div className="space-y-2">
                    {interactions.slice(0, 3).map((interaction) => (
                      <div key={interaction.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{interaction.interaction_type}</span>
                          <span className="text-gray-500">
                            {new Date(interaction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{interaction.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lead</h3>
                <p className="text-gray-600">
                  Choose a lead from the list to view detailed information and interactions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Leads Management */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Leads Management ({filteredLeads.length})
              {selectedLeads.length > 0 && (
                <span className="ml-2 text-sm text-blue-600">
                  ({selectedLeads.length} selected)
                </span>
              )}
            </h3>
            
            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="site_visit">Site Visit</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>

              {/* Bulk Actions */}
              {selectedLeads.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete ({selectedLeads.length})
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                        {lead.email && (
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                        lead.status === 'closed_won' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="site_visit">Site Visit</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed_won">Closed Won</option>
                      <option value="closed_lost">Closed Lost</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.budget_min && lead.budget_max ? (
                      `${formatNumberString(lead.budget_min.toString())} - ${formatNumberString(lead.budget_max.toString())}`
                    ) : (
                      'Not specified'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {lead.source.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLeadSelect(lead)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setLeadToDelete(lead.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find leads.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete Lead</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this lead? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLeadToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => leadToDelete && handleDeleteLead(leadToDelete)}
                className="px-4 py-2 text-sm font-medium text-black bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Widget */}
      <ChatbotWidget
        userId={userId}
        properties={properties}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
}
