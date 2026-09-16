"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const [billingData, setBillingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  
  // Replaced generic boolean with specific ID tracking for individual button loading states
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  // Added Toast Notification State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchBillingData = async () => {
    try {
      const res = await fetchApi("/api/payments/my-billing/");
      if (res.ok) {
        const data = await res.json();
        setBillingData(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleOpenUpgradeModal = async () => {
    setIsUpgradeModalOpen(true);
    setIsLoadingPlans(true);
    try {
      const res = await fetchApi("/api/payments/plans/");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Updated Subscription Handler to intercept 400 errors safely
  const handleSubscribe = async (planId: string) => {
    setProcessingPlanId(planId);
    
    try {
      const res = await fetchApi('/api/payments/subscribe/', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId })
      });

      const data = await res.json();

      // Catch the exact 400 Bad Request error from the backend (Downgrade protection)
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout.");
      }

      // If successful, redirect the user to the Stripe Gateway
      if (data.gateway_url) {
        window.location.href = data.gateway_url;
      }

    } catch (error: any) {
      console.error("Subscription Error:", error);
      // Safely display the rejection reason to the user
      showToast(error.message, "error");
    } finally {
      setProcessingPlanId(null);
    }
  };

  const currentSub = billingData?.current_subscription;
  const invoices = billingData?.invoices || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fixer-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

      {/* Upgrade Modal - Restructured for clean scrolling and isolated button states */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 py-8 sm:p-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-5xl shadow-2xl relative mx-auto animate-in zoom-in-95 max-h-[90vh] overflow-y-auto flex flex-col">
            
            <button
              onClick={() => processingPlanId === null && setIsUpgradeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
              disabled={processingPlanId !== null}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8 shrink-0 mt-4 md:mt-0">
              <h2 className="text-3xl font-extrabold text-fixer-darkBg mb-2">Upgrade Your Plan</h2>
              <p className="text-sm font-medium text-fixer-muted">Select a plan to scale your automated outreach and pipeline processing.</p>
            </div>

            {isLoadingPlans ? (
              <div className="py-20 flex justify-center items-center flex-1">
                <div className="w-10 h-10 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan: any) => {
                  const isProcessingThisPlan = processingPlanId === plan.id;
                  const isAnyProcessing = processingPlanId !== null;

                  return (
                    <div key={plan.id || plan.name} className="border-2 border-gray-100 hover:border-fixer-primary/50 bg-white rounded-2xl p-8 transition-all flex flex-col justify-between shadow-sm hover:shadow-md relative">
                      <div>
                        <h3 className="text-xl font-bold text-fixer-darkBg mb-2">{plan.name || plan.plan_name}</h3>
                        <div className="text-4xl font-extrabold text-fixer-primary mb-6">
                          {plan.currency === 'USD' ? '$' : plan.currency}{plan.price}
                        </div>
                        <ul className="space-y-4 mb-8 text-sm font-medium text-fixer-muted">
                          <li className="flex items-center gap-3">
                            <div className="bg-emerald-50 text-emerald-500 rounded-full p-1 shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{plan.limit ? Number(plan.limit).toLocaleString() : "1,000"} Monthly API Credits</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="bg-emerald-50 text-emerald-500 rounded-full p-1 shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Automated Map & LinkedIn Scrapes</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="bg-emerald-50 text-emerald-500 rounded-full p-1 shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-700">AI Deep-Scan Audits & Copywriting</span>
                          </li>
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isAnyProcessing}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all flex justify-center items-center gap-2 mt-2 ${
                          isProcessingThisPlan 
                            ? 'bg-fixer-primary/80 text-white cursor-wait shadow-inner' 
                            : 'bg-fixer-darkBg hover:bg-black text-white hover:shadow-md disabled:opacity-50 disabled:hover:bg-fixer-darkBg'
                        }`}
                      >
                        {isProcessingThisPlan ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : "Checkout via Stripe"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Billing Dashboard */}
      <div className="pt-20">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-fixer-darkBg">Billing & Subscription</h1>
                <p className="text-sm font-medium text-fixer-muted mt-1">
                  Manage your plan, track usage credits, and view payment history.
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-fixer-darkBg">Current Plan</h2>
                    <p className="text-sm text-fixer-muted mt-1">
                      You are currently on the <span className="font-bold text-fixer-primary capitalize">{currentSub?.plan_name || "Free"} Plan</span>.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      currentSub?.status === "active"
                        ? "bg-emerald-50 text-fixer-accent border-emerald-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {currentSub?.status ? currentSub.status.toUpperCase() : "INACTIVE"}
                  </span>
                </div>

                <div className="text-4xl font-extrabold text-fixer-darkBg mb-6">
                  {currentSub?.currency === 'USD' ? '$' : currentSub?.currency || "$"}{currentSub?.price || "0.00"}
                  <span className="text-lg text-gray-400 font-medium">/cycle</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm font-medium text-fixer-muted">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited leads & basic scraping
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced AI Scoring & Audits
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Full Email Automation
                  </li>
                </ul>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={handleOpenUpgradeModal}
                  className="flex-1 bg-fixer-primary hover:bg-fixer-primaryHover text-white py-3 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Change Subscription Plan
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-fixer-muted mb-1">Cycle End Date</h3>
                  <p className="text-xl font-extrabold text-fixer-darkBg">{formatDate(currentSub?.end_date)}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-fixer-muted mb-1">Cycle Rate</h3>
                  <p className="text-xl font-extrabold text-fixer-darkBg">
                    {currentSub?.currency === 'USD' ? '$' : currentSub?.currency || "$"}{currentSub?.price || "0.00"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-fixer-darkBg">Payment Processing</h2>
                  </div>

                  <div className="flex items-center gap-4 p-4 border border-blue-100 rounded-xl bg-blue-50/30">
                    <div className="w-12 h-10 bg-blue-100 rounded text-blue-600 flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-fixer-darkBg">Stripe Secure Checkout</p>
                      <p className="text-xs font-medium text-fixer-muted mt-0.5">Global Credit & Debit Card Processing</p>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Encrypted
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                  Payments are encrypted and processed through Stripe's certified PCI-compliant checkout. Your financial credentials are never stored directly on our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h2 className="text-lg font-bold text-fixer-darkBg mb-6">Monthly Usage Credits</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-fixer-text">Map Scrapes</h3>
                    <p className="text-xs text-fixer-muted mt-0.5">Data extractions</p>
                  </div>
                  <span className="text-sm font-bold text-fixer-darkBg">Unlimited</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-fixer-primary h-2.5 rounded-full w-full opacity-50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-fixer-text">AI Audits</h3>
                    <p className="text-xs text-fixer-muted mt-0.5">Website deep scans</p>
                  </div>
                  <span className="text-sm font-bold text-fixer-darkBg">Unlimited</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-fixer-secondary h-2.5 rounded-full w-full opacity-50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-fixer-text">Agent API Actions</h3>
                    <p className="text-xs text-fixer-muted mt-0.5">Emails Drafted & Sent</p>
                  </div>
                  <span className="text-sm font-bold text-fixer-darkBg">
                    {currentSub?.usage?.calls_made?.toLocaleString() || 0}
                    <span className="text-gray-400 font-medium">
                      / {currentSub?.usage?.limit?.toLocaleString() || 0}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      (currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1) > 0.9
                        ? "bg-red-500"
                        : "bg-purple-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        ((currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                {(currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1) > 0.9 && (
                  <p className="text-xs font-medium text-red-500 mt-1">Approaching API limit. Consider upgrading your plan to continue automated outreach.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
              <h3 className="text-lg font-bold text-fixer-darkBg">Invoice History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white text-xs uppercase tracking-wider text-fixer-muted font-bold border-b border-gray-200">
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.length > 0 ? (
                    invoices.map((invoice: any) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-fixer-darkBg text-sm">{invoice.id}</td>
                        <td className="px-6 py-4 text-sm text-fixer-muted">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-fixer-text">{invoice.plan}</td>
                        <td className="px-6 py-4 text-sm font-bold text-fixer-darkBg">{invoice.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              invoice.status === "VALID"
                                ? "bg-emerald-50 text-fixer-accent border border-emerald-100"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={!invoice.receipt}
                            className="p-2 text-gray-400 hover:text-fixer-primary hover:bg-blue-50 rounded-lg transition-colors inline-flex disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                            title="Download PDF"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-fixer-muted">
                        No billing history found.
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