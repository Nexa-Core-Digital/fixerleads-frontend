"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LeadFinderPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  
  const [leads, setLeads] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [industryFilter, setIndustryFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Toast Notification
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetchApi('/api/leads/dashboard_stats/'),
        fetchApi('/api/leads/')
      ]);
      
      if (statsRes.ok) setDashboardStats(await statsRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SUBSCRIPTION CHECK
  const validateSubscription = () => {
    if (!dashboardStats) {
      showToast("Agent access denied. Please activate a subscription plan.", "error");
      setTimeout(() => router.push('/dashboard/billing'), 2000);
      return false;
    }
    if (dashboardStats.system_status.api_used >= dashboardStats.system_status.api_limit) {
      showToast("Monthly execution limit reached. Please upgrade your plan.", "error");
      setTimeout(() => router.push('/dashboard/billing'), 2000);
      return false;
    }
    return true;
  };

  // INDIVIDUAL MANUAL PIPELINE ACTIONS
  const executePipelineAction = async (leadId: string, endpoint: string, method: string = 'POST') => {
    if (!validateSubscription()) return;
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/leads/${leadId}/${endpoint}/`, { method });
      if (!res.ok) throw new Error(`Action ${endpoint} failed.`);
      
      showToast(`Action successful! Lead has been updated.`, "success");
      fetchData(); 
    } catch (error) {
      console.error(error);
      showToast("Action failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Client-side filtering logic
  const filteredLeads = leads.filter((lead) => {
    if (industryFilter && !lead.category?.toLowerCase().includes(industryFilter.toLowerCase())) return false;
    if (scoreFilter && lead.ai_score < parseInt(scoreFilter)) return false;
    if (statusFilter && lead.status !== statusFilter) return false;
    if (keyword && !lead.name?.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (location && !lead.location?.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  const handleClearFilters = () => {
    setIndustryFilter("");
    setScoreFilter("");
    setStatusFilter("");
    setKeyword("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-fixer-bg pb-12 relative">
      <Navbar />

      {/* Global Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-[150] px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right-8 fade-in ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-fixer-accent' : 
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 
          'bg-blue-50 border-blue-200 text-fixer-primary'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : toast.type === 'error' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="pt-20">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-fixer-darkBg">Lead Finder</h1>
                <p className="text-sm font-medium text-fixer-muted mt-1">
                  Search, scrape, and filter high-quality business leads instantly.
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Main Search Bar Section */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full md:flex-1 flex items-center">
              <div className="absolute left-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-fixer-text font-medium placeholder-gray-400 outline-none"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200"></div>
            <div className="relative w-full md:flex-1 flex items-center border-t border-gray-100 md:border-t-0 pt-2 md:pt-0">
              <div className="absolute left-4 text-fixer-secondary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="City, state, or country..." 
                className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-fixer-text font-medium placeholder-gray-400 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-sm font-bold text-fixer-darkBg mr-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters:
            </span>
            
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="bg-white border border-gray-200 text-fixer-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fixer-primary focus:ring-1 focus:ring-fixer-primary font-medium cursor-pointer shadow-sm">
              <option value="">Any Industry</option>
              <option value="restaurant">Restaurant</option>
              <option value="software">Software</option>
              <option value="agency">Agency</option>
              <option value="healthcare">Healthcare</option>
            </select>

            <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="bg-white border border-gray-200 text-fixer-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fixer-primary focus:ring-1 focus:ring-fixer-primary font-medium cursor-pointer shadow-sm">
              <option value="">Min. AI Score</option>
              <option value="10">10</option>
              <option value="9">9.0+</option>
              <option value="8">8.0+</option>
            </select>

            <button onClick={handleClearFilters} className="text-sm text-fixer-muted hover:text-fixer-primary font-medium ml-auto">
              Clear All
            </button>
          </div>

          {/* Leads Data Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <span className="text-sm font-bold text-fixer-muted">Found <span className="text-fixer-darkBg">{filteredLeads.length}</span> leads</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-white text-xs uppercase tracking-wider text-fixer-muted font-bold border-b border-gray-200">
                    <th className="px-6 py-4">Business Info</th>
                    <th className="px-6 py-4">Contact Details</th>
                    <th className="px-6 py-4">AI Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Individual Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-fixer-muted">
                        <div className="inline-block w-8 h-8 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
                      </td>
                    </tr>
                  ) : filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-fixer-darkBg text-sm">{lead.name}</div>
                          <div className="text-xs text-fixer-muted mt-1 flex items-center gap-1.5">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{lead.category}</span>
                            • {lead.location}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {lead.email ? (
                              <span className="text-sm text-fixer-text flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {lead.email}
                              </span>
                            ) : (
                              <span className="text-xs text-red-400 italic">No email found</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                            lead.ai_score >= 9 ? 'bg-emerald-50 text-fixer-accent border-emerald-100' :
                            lead.ai_score >= 7 ? 'bg-blue-50 text-fixer-primary border-blue-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {lead.ai_score} / 10
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                            lead.status === 'approved_to_send' ? 'bg-emerald-50 text-fixer-accent' : 
                            lead.status === 'emailed' ? 'bg-purple-50 text-purple-700' : 
                            lead.status === 'audited' ? 'bg-cyan-50 text-fixer-secondary' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {lead.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Feature 1: Manual Step-by-Step Logic */}
                            {!lead.audited_at ? (
                              <button 
                                disabled={isProcessing}
                                onClick={() => executePipelineAction(lead.id, 'trigger_pdf')}
                                className="px-3 py-1.5 text-xs font-bold text-fixer-secondary bg-cyan-50 border border-cyan-100 rounded-lg hover:bg-cyan-100 transition-colors disabled:opacity-50"
                              >
                                Trigger Audit
                              </button>
                            ) : !lead.email_drafted_at ? (
                              <button 
                                disabled={isProcessing}
                                onClick={() => executePipelineAction(lead.id, 'compose_draft')}
                                className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                              >
                                Compose Draft
                              </button>
                            ) : lead.status !== 'approved_to_send' && !lead.emailed_at ? (
                              <button 
                                disabled={isProcessing}
                                onClick={() => executePipelineAction(lead.id, 'approve_draft', 'PATCH')}
                                className="px-3 py-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50"
                              >
                                Approve Draft
                              </button>
                            ) : !lead.emailed_at ? (
                              <button 
                                disabled={isProcessing}
                                onClick={() => executePipelineAction(lead.id, 'send_email')}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-fixer-accent rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                              >
                                Send Email
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-gray-400 px-3">Completed</span>
                            )}
                            
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-fixer-muted">
                        No leads found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}