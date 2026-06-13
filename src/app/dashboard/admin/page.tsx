"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";

export default function AdminPanelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Toast Notification
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // --- State for Modules ---
  const [metrics, setMetrics] = useState<any>(null);
  const [celeryStatus, setCeleryStatus] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [vaultKeys, setVaultKeys] = useState<any[]>([]);
  const [externalProjects, setExternalProjects] = useState<any[]>([]);

  // --- Modals State ---
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const [planForm, setPlanForm] = useState({ name: "", slug: "", target_account_type: "organization", price: "", currency: "BDT", duration_months: 1, max_agent_calls: 10000, is_active: true });
  const [vaultForm, setVaultForm] = useState({ service_name: "", api_key: "", is_active: true });
  const [projectForm, setProjectForm] = useState({ project_name: "" });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- Data Fetching ---
  const fetchDashboardData = async () => {
    try {
      const [metricsRes, celeryRes] = await Promise.all([
        fetchApi('/api/admin/dashboard/metrics/'),
        fetchApi('/api/admin/dashboard/celery/')
      ]);
      if (metricsRes.status === 403) {
        showToast("Access Denied. Admins only.", "error");
        return router.push('/dashboard');
      }
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (celeryRes.ok) setCeleryStatus(await celeryRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    const res = await fetchApi('/api/users/accounts/');
    if (res.ok) setUsers(await res.json());
  };

  const fetchPlans = async () => {
    const res = await fetchApi('/api/admin/plans/');
    if (res.ok) setPlans(await res.json());
  };

  const fetchVault = async () => {
    const res = await fetchApi('/api/admin/api-vault/');
    if (res.ok) setVaultKeys(await res.json());
  };

  const fetchProjects = async () => {
    const res = await fetchApi('/api/admin/external-projects/');
    if (res.ok) setExternalProjects(await res.json());
  };

  useEffect(() => {
    setIsLoading(true);
    if (activeTab === "dashboard") fetchDashboardData();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "plans") fetchPlans();
    if (activeTab === "vault") fetchVault();
    if (activeTab === "external") fetchProjects();
    setIsLoading(false);
  }, [activeTab]);

  // --- API Handlers ---
  const extendSubscription = async (userId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/admin/users/${userId}/extend-subscription/`, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to extend subscription.");
      showToast("Subscription extended successfully!");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetchApi('/api/admin/plans/', {
        method: 'POST',
        body: JSON.stringify(planForm)
      });
      if (!res.ok) throw new Error("Failed to create plan.");
      showToast("Plan created successfully!");
      setIsPlanModalOpen(false);
      fetchPlans();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlan = async (planId: string, currentStatus: boolean) => {
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/admin/plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) fetchPlans();
    } finally {
      setIsProcessing(false);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/admin/plans/${planId}/`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Plan deleted.");
        fetchPlans();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetchApi('/api/admin/api-vault/', {
        method: 'POST',
        body: JSON.stringify(vaultForm)
      });
      if (!res.ok) throw new Error("Failed to add key.");
      showToast("Key added securely to vault.");
      setIsVaultModalOpen(false);
      setVaultForm({ service_name: "", api_key: "", is_active: true });
      fetchVault();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVaultKey = async (keyId: string, currentStatus: boolean) => {
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/admin/api-vault/${keyId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) fetchVault();
    } finally {
      setIsProcessing(false);
    }
  };

  const generateProjectKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetchApi('/api/admin/external-projects/generate-doc/', {
        method: 'POST',
        body: JSON.stringify(projectForm)
      });
      
      if (!res.ok) throw new Error("Failed to generate project key.");
      
      // Handle File Download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectForm.project_name.replace(/\s+/g, '_')}_API_Doc.pdf`;
      a.click();
      
      showToast("Project key and PDF generated!");
      setIsProjectModalOpen(false);
      setProjectForm({ project_name: "" });
      fetchProjects();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleProjectKey = async (projectId: string, currentStatus: boolean) => {
    setIsProcessing(true);
    try {
      const res = await fetchApi(`/api/admin/external-projects/${projectId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) fetchProjects();
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen bg-fixer-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixer-bg pb-12 relative">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-[150] px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right-8 fade-in ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-fixer-accent' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="pt-20">
        {/* Admin Header & Tabs */}
        <header className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-extrabold text-fixer-darkBg flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Superadmin Console
            </h1>
            
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard Metrics' },
                { id: 'users', label: 'User Management' },
                { id: 'plans', label: 'Billing Plans' },
                { id: 'vault', label: 'API Vault' },
                { id: 'external', label: 'External Projects' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-fixer-darkBg text-white' : 'bg-gray-100 text-fixer-muted hover:bg-gray-200 text-fixer-darkBg'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

          {/* MODULE 1: Dashboard Metrics */}
          {activeTab === "dashboard" && metrics && (
            <div className="space-y-6">
              
              {/* Celery Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${
                celeryStatus?.status === 'online' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`relative flex h-3 w-3 ${celeryStatus?.status === 'online' ? 'text-emerald-500' : 'text-red-500'}`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${celeryStatus?.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${celeryStatus?.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  </span>
                  <span className="font-bold text-fixer-darkBg">Celery Workers Status: <span className="uppercase">{celeryStatus?.status}</span></span>
                </div>
                <div className="text-sm font-bold text-fixer-muted">
                  Pending Queue: <span className="text-fixer-darkBg">{celeryStatus?.pending_tasks || 0}</span> tasks
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <p className="text-sm font-bold text-fixer-muted mb-1">Total Revenue (All Time)</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{metrics.revenue.currency} {metrics.revenue.total_all_time}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-fixer-primary">
                  <p className="text-sm font-bold text-fixer-muted mb-1">MRR (This Month)</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{metrics.revenue.currency} {metrics.revenue.mrr_this_month}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <p className="text-sm font-bold text-fixer-muted mb-1">Active Users</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{metrics.users.total_active} <span className="text-sm text-emerald-500">+{metrics.users.new_this_month} this month</span></p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <p className="text-sm font-bold text-fixer-muted mb-1">Leads Scraped</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{metrics.utilization.leads_scraped.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <p className="text-sm font-bold text-fixer-muted mb-1">AI Audits Run</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{metrics.utilization.ai_audits.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <p className="text-sm font-bold text-fixer-muted mb-1">Emails Dispatched</p>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">
                        {(metrics.utilization.emails_sent || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: Users Management */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-fixer-darkBg">User Directory</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-fixer-muted uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 border-b">User / Email</th>
                      <th className="px-6 py-4 border-b">Type</th>
                      <th className="px-6 py-4 border-b">Status</th>
                      <th className="px-6 py-4 border-b text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-fixer-darkBg">{user.basic_info?.full_name || user.username}</div>
                          <div className="text-xs text-fixer-muted">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 capitalize">{user.account_type}</td>
                        <td className="px-6 py-4">
                          {user.is_active ? (
                            <span className="bg-emerald-50 text-fixer-accent px-2 py-1 rounded text-xs font-bold">Active</span>
                          ) : (
                            <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-bold">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => extendSubscription(user.id)}
                            disabled={isProcessing}
                            className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                          >
                            +30 Days Acccess
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 3: Plans Management */}
          {activeTab === "plans" && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsPlanModalOpen(true)} className="bg-fixer-primary text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors">+ Create New Plan</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan: any) => (
                  <div key={plan.id} className={`bg-white rounded-2xl p-6 border ${plan.is_active ? 'border-fixer-primary/50 shadow-md' : 'border-gray-200 opacity-70'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-fixer-darkBg">{plan.name}</h3>
                      <button onClick={() => togglePlan(plan.id, plan.is_active)} className={`text-xs font-bold px-2 py-1 rounded ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                        {plan.is_active ? 'Active' : 'Draft'}
                      </button>
                    </div>
                    <div className="text-3xl font-extrabold mb-4">{plan.currency} {plan.price}</div>
                    <ul className="text-sm text-fixer-muted space-y-2 mb-6">
                      <li>Target: <span className="font-bold capitalize">{plan.target_account_type}</span></li>
                      <li>Limits: <span className="font-bold">{plan.max_agent_calls} calls</span></li>
                      <li>Duration: <span className="font-bold">{plan.duration_months} Months</span></li>
                    </ul>
                    <button onClick={() => deletePlan(plan.id)} className="w-full text-red-600 font-bold text-sm bg-red-50 py-2 rounded-lg hover:bg-red-100">Delete Plan</button>
                  </div>
                ))}
              </div>

              {/* Create Plan Modal */}
              {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Create Plan</h2>
                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                      <input type="text" placeholder="Plan Name" required value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full p-2 border rounded" />
                      <input type="number" placeholder="Price" required value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} className="w-full p-2 border rounded" />
                      <input type="number" placeholder="Max Agent Calls" required value={planForm.max_agent_calls} onChange={e => setPlanForm({...planForm, max_agent_calls: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                      <div className="flex gap-2 justify-end pt-4">
                        <button type="button" onClick={() => setIsPlanModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={isProcessing} className="px-4 py-2 font-bold bg-fixer-primary text-white rounded hover:bg-blue-700">Save Plan</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 4: API Key Vault */}
          {activeTab === "vault" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-fixer-darkBg">API Keys (System Core)</h3>
                <button onClick={() => setIsVaultModalOpen(true)} className="text-sm font-bold text-fixer-primary bg-blue-50 px-3 py-1.5 rounded-lg">+ Add Root Key</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-fixer-muted uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 border-b">Service Name</th>
                      <th className="px-6 py-4 border-b">Key (Masked)</th>
                      <th className="px-6 py-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vaultKeys.map((key: any) => (
                      <tr key={key.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-fixer-darkBg">{key.service_name}</td>
                        <td className="px-6 py-4 text-fixer-muted font-mono">{key.api_key.slice(0,10)}...</td>
                        <td className="px-6 py-4">
                           <button 
                            onClick={() => toggleVaultKey(key.id, key.is_active)}
                            disabled={isProcessing}
                            className={`px-3 py-1 text-xs font-bold rounded-full ${key.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}
                          >
                            {key.is_active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isVaultModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Add Root API Key</h2>
                    <form onSubmit={handleVaultSubmit} className="space-y-4">
                      <input type="text" placeholder="Service Name (e.g., Anthropic Claude)" required value={vaultForm.service_name} onChange={e => setVaultForm({...vaultForm, service_name: e.target.value})} className="w-full p-2 border rounded font-bold text-sm" />
                      <input type="text" placeholder="sk-ant-xxxxxxxx" required value={vaultForm.api_key} onChange={e => setVaultForm({...vaultForm, api_key: e.target.value})} className="w-full p-2 border rounded font-mono text-sm" />
                      <div className="flex gap-2 justify-end pt-4">
                        <button type="button" onClick={() => setIsVaultModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={isProcessing} className="px-4 py-2 font-bold bg-fixer-darkBg text-white rounded hover:bg-black">Secure in Vault</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 5: External Projects */}
          {activeTab === "external" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-fixer-darkBg">External White-Label Projects</h3>
                <button onClick={() => setIsProjectModalOpen(true)} className="text-sm font-bold text-fixer-primary bg-blue-50 px-3 py-1.5 rounded-lg">+ Issue Master Key & PDF</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-fixer-muted uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4 border-b">Project Name</th>
                      <th className="px-6 py-4 border-b">Master API Key</th>
                      <th className="px-6 py-4 border-b">Created</th>
                      <th className="px-6 py-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {externalProjects.map((proj: any) => (
                      <tr key={proj.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-fixer-darkBg">{proj.project_name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500 bg-gray-100 rounded px-2">{proj.api_key}</td>
                        <td className="px-6 py-4 text-fixer-muted">{new Date(proj.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <button 
                            onClick={() => toggleProjectKey(proj.id, proj.is_active)}
                            disabled={isProcessing}
                            className={`px-3 py-1 text-xs font-bold rounded-full ${proj.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {proj.is_active ? 'Active' : 'Revoked'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isProjectModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-fixer-darkBg">Issue New Application Key</h2>
                    <p className="text-sm text-fixer-muted mb-4">This will generate a master access key and automatically trigger a PDF download containing API documentation for the developer.</p>
                    <form onSubmit={generateProjectKey} className="space-y-4">
                      <input type="text" placeholder="Project / Client Name" required value={projectForm.project_name} onChange={e => setProjectForm({project_name: e.target.value})} className="w-full p-2 border rounded font-bold text-sm" />
                      <div className="flex gap-2 justify-end pt-4">
                        <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" disabled={isProcessing} className="px-4 py-2 font-bold bg-fixer-primary text-white rounded hover:bg-blue-700 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Generate & Download PDF
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}