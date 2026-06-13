"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface DashboardStats {
  total_leads: number;
  emails_sent: number;
  ai_score_average: number;
  active_campaigns: number;
  system_status: {
    api_used: number;
    api_limit: number;
    usage_percentage: number;
  }
}

export default function CampaignsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchCampaignData = async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetchApi('/api/leads/dashboard_stats/'),
        fetchApi('/api/leads/')
      ]);

      if (statsRes.ok) {
        setDashboardStats(await statsRes.json());
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        
        // Group leads into campaigns dynamically based on their campaign ID
        const campaignsMap = new Map();
        
        leadsData.forEach((lead: any) => {
          const cid = lead.campaign || 'unassigned';
          if (cid === 'unassigned') return; // Skip unassigned for campaigns view
          
          if (!campaignsMap.has(cid)) {
            campaignsMap.set(cid, {
              id: cid,
              name: `Outreach Campaign (${cid.slice(0,8)})`,
              subject: lead.email_subject || 'Dynamic AI Generated Subject',
              reportAttached: 'Auto_Generated_Report.pdf',
              status: 'Active',
              scraped: 0,
              audited: 0,
              drafted: 0,
              emailed: 0,
            });
          }
          
          const camp = campaignsMap.get(cid);
          camp.scraped += 1;
          if (lead.audited_at) camp.audited += 1;
          if (lead.email_drafted_at) camp.drafted += 1;
          if (lead.emailed_at) camp.emailed += 1;
          
          if (camp.scraped === camp.emailed && camp.scraped > 0) {
            camp.status = 'Completed';
          }
        });

        setCampaigns(Array.from(campaignsMap.values()));
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

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

  const handleStartCampaign = async (mode: 'auto' | 'manual') => {
    if (!validateSubscription()) return;
    
    setIsProcessing(true);
    try {
      const res = await fetchApi('/api/leads/start_campaign/', {
        method: 'POST',
        body: JSON.stringify({ mode })
      });
      if (!res.ok) throw new Error("Failed to start campaign");
      
      showToast(`Campaign started in ${mode.toUpperCase()} mode! Background workers are scraping leads.`, "success");
      setIsModalOpen(false);
      fetchCampaignData(); // Refresh UI
    } catch (error) {
      console.error(error);
      showToast("Failed to initialize campaign. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkAction = async (campaignId: string, endpoint: string, method: string = 'POST') => {
    if (!validateSubscription()) return;
    
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/campaigns/${campaignId}/${endpoint}/`, { method });
      if (!res.ok) throw new Error(`Bulk action ${endpoint} failed`);
      
      showToast(`Action successful! Background workers are processing the pipeline.`, "success");
      fetchCampaignData();
    } catch (error) {
      console.error(error);
      showToast("Failed to execute bulk action. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all') return true;
    return c.status.toLowerCase() === filter;
  });

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

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-2">Deploy New Campaign</h2>
            <p className="text-sm text-fixer-muted mb-6">Choose how you want our agents to process your leads.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleStartCampaign('manual')}
                disabled={isProcessing}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-fixer-primary hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <div className="font-bold text-fixer-darkBg flex items-center gap-2">
                  <svg className="w-5 h-5 text-fixer-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Manual Sequence
                </div>
                <p className="text-xs text-fixer-muted mt-1">Scrapes leads automatically, but waits for your approval before running audits or sending emails.</p>
              </button>

              <button 
                onClick={() => handleStartCampaign('auto')}
                disabled={isProcessing}
                className="w-full text-left p-4 rounded-xl border-2 border-transparent bg-fixer-darkBg hover:bg-black text-white transition-all shadow-xl shadow-black/10 disabled:opacity-50"
              >
                <div className="font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Full Auto-Pilot Mode
                </div>
                <p className="text-xs text-gray-400 mt-1">Fire and forget. Scrapes, audits, builds PDFs, writes copy, and sends emails autonomously.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-20">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-fixer-darkBg">Email Campaigns</h1>
                <p className="text-sm font-medium text-fixer-muted mt-1">
                  Track your automated outreach sequences and pipeline statuses.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Deploy Campaign
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-2xl">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-fixer-primary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-fixer-muted">Total Emails Sent</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-fixer-darkBg">
                  {dashboardStats?.emails_sent || "0"}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-fixer-accent">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-fixer-muted">Active Campaigns</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-fixer-darkBg">
                  {dashboardStats?.active_campaigns || "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            <div className="px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto">
                {['all', 'active', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md capitalize transition-all ${
                      filter === status ? 'bg-white text-fixer-darkBg shadow-sm' : 'text-fixer-muted hover:text-fixer-text'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-fixer-muted font-bold border-b border-gray-200">
                    <th className="px-6 py-4">Campaign Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Pipeline Progress</th>
                    <th className="px-6 py-4 text-right">Manual Pipeline Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-fixer-muted">
                        <div className="inline-block w-8 h-8 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
                      </td>
                    </tr>
                  ) : filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50 transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="font-bold text-fixer-darkBg text-sm">{campaign.name}</div>
                          <div className="text-xs text-fixer-muted mt-1 font-mono">{campaign.id}</div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                            campaign.status === 'Active' ? 'bg-emerald-50 text-fixer-accent border-emerald-100' : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {campaign.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-fixer-accent animate-pulse"></span>}
                            {campaign.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-full min-w-[300px]">
                            <div className="flex justify-between text-xs font-bold text-fixer-muted mb-2">
                              <span>Pipeline Flow</span>
                              <span className="text-fixer-primary">{Math.round((campaign.emailed / campaign.scraped) * 100) || 0}% Emailed</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-medium">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                  <div className="bg-gray-800 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <span className="text-gray-500">{campaign.scraped} Scraped</span>
                              </div>
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                  <div className="bg-fixer-secondary h-1.5 rounded-full" style={{ width: `${(campaign.audited / campaign.scraped) * 100}%` }}></div>
                                </div>
                                <span className="text-gray-500">{campaign.audited} Audited</span>
                              </div>
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(campaign.drafted / campaign.scraped) * 100}%` }}></div>
                                </div>
                                <span className="text-gray-500">{campaign.drafted} Drafted</span>
                              </div>
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                  <div className="bg-fixer-accent h-1.5 rounded-full" style={{ width: `${(campaign.emailed / campaign.scraped) * 100}%` }}></div>
                                </div>
                                <span className="text-gray-500">{campaign.emailed} Emailed</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-2">
                            {campaign.audited < campaign.scraped && (
                              <button 
                                onClick={() => handleBulkAction(campaign.id, 'trigger_pdfs')}
                                disabled={isProcessing}
                                className="px-3 py-1.5 text-xs font-bold text-fixer-secondary bg-cyan-50 border border-cyan-100 rounded-lg hover:bg-cyan-100 transition-colors"
                              >
                                Trigger Bulk Audits
                              </button>
                            )}
                            {campaign.drafted < campaign.audited && (
                              <button 
                                onClick={() => handleBulkAction(campaign.id, 'compose_drafts')}
                                disabled={isProcessing}
                                className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
                              >
                                Generate AI Drafts
                              </button>
                            )}
                            {campaign.emailed < campaign.drafted && (
                              <button 
                                onClick={() => handleBulkAction(campaign.id, 'send_emails', 'PATCH')}
                                disabled={isProcessing}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-fixer-accent rounded-lg hover:bg-emerald-600 transition-colors"
                              >
                                Approve & Send All
                              </button>
                            )}
                            {campaign.status === 'Completed' && (
                              <span className="text-xs font-bold text-gray-400">All Pipeline Actions Complete</span>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-fixer-muted">
                        No campaigns found. Start scraping leads to build your pipeline!
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