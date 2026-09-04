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

  // Accordion Expand State
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  const [industryFilter, setIndustryFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
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

  // Toggle Lead Accordion
  const toggleLeadAccordion = (id: string) => {
    setExpandedLeadId((prev) => (prev === id ? null : id));
  };

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
              <option value="real estate">Real Estate</option>
            </select>

            <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)} className="bg-white border border-gray-200 text-fixer-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fixer-primary focus:ring-1 focus:ring-fixer-primary font-medium cursor-pointer shadow-sm">
              <option value="">Min. AI Score</option>
              <option value="10">10</option>
              <option value="9">9.0+</option>
              <option value="8">8.0+</option>
              <option value="6">6.0+</option>
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
                    filteredLeads.map((lead) => {
                      const isExpanded = expandedLeadId === lead.id;

                      return (
                        <tr key={lead.id} className="contents group">
                          {/* Main Row */}
                          <tr 
                            onClick={() => toggleLeadAccordion(lead.id)}
                            className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                              isExpanded ? "bg-blue-50/50" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90 text-fixer-primary" : ""}`}>
                                  ▶
                                </span>
                                <div>
                                  <div className="font-bold text-fixer-darkBg text-sm group-hover:text-fixer-primary transition-colors">
                                    {lead.name}
                                  </div>
                                  <div className="text-xs text-fixer-muted mt-1 flex items-center gap-1.5 flex-wrap">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                                      {lead.category || "Service"}
                                    </span>
                                    <span>• {lead.location}</span>
                                    {lead.audit_data?.tech_stack && (
                                      <span className="bg-purple-50 text-purple-700 border border-purple-100 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                                        {lead.audit_data.tech_stack}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {lead.email ? (
                                  <span className="text-sm text-fixer-text flex items-center gap-1.5 font-medium">
                                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {lead.email}
                                  </span>
                                ) : (
                                  <span className="text-xs text-red-400 italic">No email found</span>
                                )}
                                {lead.phone && lead.phone !== "N/A" && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {lead.phone}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                lead.ai_score >= 8 ? 'bg-emerald-50 text-fixer-accent border-emerald-100' :
                                lead.ai_score >= 6 ? 'bg-blue-50 text-fixer-primary border-blue-100' :
                                'bg-red-50 text-red-600 border-red-200'
                              }`}>
                                {lead.ai_score !== null && lead.ai_score !== undefined ? `${lead.ai_score} / 10` : "Unscored"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                                lead.status === 'approved_to_send' ? 'bg-emerald-50 text-fixer-accent' : 
                                lead.status === 'emailed' ? 'bg-purple-50 text-purple-700' : 
                                lead.status === 'audited' ? 'bg-cyan-50 text-fixer-secondary' : 
                                lead.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {lead.status ? lead.status.replace(/_/g, ' ') : 'New'}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
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

                          {/* Expanded Inspection Drawer */}
                          {isExpanded && (
                            <tr className="bg-slate-50 border-b border-gray-200">
                              <td colSpan={5} className="p-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                  
                                  {/* Header Info Banner */}
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-base font-extrabold text-fixer-darkBg">{lead.name}</h3>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                                          Site Status: <strong className="capitalize">{lead.site_status || "N/A"}</strong>
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5">{lead.address || "Address not provided"}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      {lead.website && lead.website !== "N/A" && (
                                        <a
                                          href={lead.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                          Visit Website
                                        </a>
                                      )}
                                      {lead.screenshot_path && (
                                        <a
                                          href={lead.screenshot_path}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                          View Audit PDF
                                        </a>
                                      )}
                                    </div>
                                  </div>

                                  {/* Grid Details */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Identified Framework</span>
                                      <p className="text-sm font-extrabold text-fixer-darkBg mt-1">
                                        {lead.audit_data?.tech_stack || "Unknown / Not Detected"}
                                      </p>
                                    </div>

                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Infrastructure Score</span>
                                      <p className="text-sm font-extrabold text-fixer-primary mt-1">
                                        {lead.audit_data?.score !== undefined ? `${lead.audit_data.score} / 100` : "N/A"}
                                      </p>
                                    </div>

                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Google Reputation</span>
                                      <p className="text-sm font-extrabold text-fixer-darkBg mt-1">
                                        ★ {lead.rating || "0"} ({lead.reviews || "0"} reviews)
                                      </p>
                                    </div>

                                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">AI Evaluation Reason</span>
                                      <p className="text-xs font-medium text-gray-700 mt-1 line-clamp-2" title={lead.ai_reason}>
                                        {lead.ai_reason || "No evaluation notes available."}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Technical Issues & Optimization Bottlenecks */}
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                      Detected Technical Issues & Optimization Gaps:
                                    </h4>
                                    {lead.audit_data?.issues && lead.audit_data.issues.length > 0 ? (
                                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {lead.audit_data.issues.map((issue: string, idx: number) => (
                                          <li
                                            key={idx}
                                            className="text-xs font-medium text-red-700 bg-red-50/70 border border-red-100 rounded-md px-3 py-2 flex items-start gap-2"
                                          >
                                            <span className="text-red-500 font-bold shrink-0">•</span>
                                            <span>{issue}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-md border border-emerald-100 font-medium">
                                        ✔ No critical technical issues detected for this website.
                                      </p>
                                    )}
                                  </div>

                                  {/* AI Pitch & Subject Line Preview (If Composed) */}
                                  {(lead.email_subject || lead.email_body) && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700">
                                          Composed Outreach Pitch:
                                        </h4>
                                        <span className="text-[11px] font-semibold text-gray-400">Claude AI Generated</span>
                                      </div>
                                      {lead.email_subject && (
                                        <p className="text-xs font-bold text-gray-900 mb-1.5">
                                          <span className="text-gray-500 font-normal">Subject: </span>
                                          {lead.email_subject}
                                        </p>
                                      )}
                                      {lead.email_body && (
                                        <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-2 bg-white p-3 rounded border border-gray-100 font-mono">
                                          {lead.email_body}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                </div>
                              </td>
                            </tr>
                          )}
                        </tr>
                      );
                    })
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