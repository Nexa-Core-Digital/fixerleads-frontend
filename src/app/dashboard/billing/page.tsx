"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";

export default function BillingPage() {
  const [billingData, setBillingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const res = await fetchApi('/api/payments/my-billing/');
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

    fetchBillingData();
  }, []);

  const handleOpenUpgradeModal = async () => {
    setIsUpgradeModalOpen(true);
    setIsLoadingPlans(true);
    try {
      const res = await fetchApi('/api/payments/plans/');
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

  const handleSubscribe = async (planId: string) => {
    setIsProcessingPayment(true);
    try {
      const res = await fetchApi('/api/payments/subscribe/', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId })
      });
      
      const data = await res.json();
      
      if (res.ok && data.gateway_url) {
        window.location.href = data.gateway_url;
      } else {
        throw new Error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to initiate secure checkout. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const currentSub = billingData?.current_subscription;
  const invoices = billingData?.invoices || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="min-h-screen bg-fixer-bg pb-12">
      <Navbar />

      {/* Plans Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => !isProcessingPayment && setIsUpgradeModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isProcessingPayment}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-2">Upgrade Your Plan</h2>
            <p className="text-sm text-fixer-muted mb-6">Select a plan to continue your automated outreach.</p>
            
            {isLoadingPlans ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan: any) => (
                  <div key={plan.id || plan.name} className="border border-gray-200 rounded-xl p-6 hover:border-fixer-primary transition-all">
                    <h3 className="text-xl font-bold text-fixer-darkBg mb-1">{plan.name || plan.plan_name}</h3>
                    <div className="text-3xl font-extrabold text-fixer-primary mb-4">
                      {plan.currency || "BDT"} {plan.price}
                    </div>
                    <ul className="space-y-2 mb-6 text-sm text-fixer-muted">
                      <li className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> {plan.limit || plan.usage_limit || "10,000"} Email Credits</li>
                      <li className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Unlimited Map Scrapes</li>
                      <li className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Unlimited AI Audits</li>
                    </ul>
                    <button 
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isProcessingPayment}
                      className="w-full bg-fixer-darkBg hover:bg-black text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isProcessingPayment ? "Redirecting..." : "Checkout via SSLCommerz"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
            
            {/* Current Subscription Card */}
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
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    currentSub?.status === 'active' ? 'bg-emerald-50 text-fixer-accent border-emerald-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {currentSub?.status ? currentSub.status.toUpperCase() : "INACTIVE"}
                  </span>
                </div>
                
                <div className="text-4xl font-extrabold text-fixer-darkBg mb-6">
                  {currentSub?.currency || "$"}{currentSub?.price || "0.00"}
                  <span className="text-lg text-gray-400 font-medium">/cycle</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-sm font-medium text-fixer-muted">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Unlimited leads & basic scraping</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Advanced AI Scoring & Audits</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Full Email Automation</li>
                </ul>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleOpenUpgradeModal}
                  className="flex-1 bg-fixer-primary hover:bg-fixer-primaryHover text-white py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Payment Processing & Next Billing */}
            <div className="flex flex-col gap-8">
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-fixer-muted mb-1">Cycle End Date</h3>
                  <p className="text-xl font-extrabold text-fixer-darkBg">{formatDate(currentSub?.end_date)}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-fixer-muted mb-1">Cycle Rate</h3>
                  <p className="text-xl font-extrabold text-fixer-darkBg">{currentSub?.currency || "$"}{currentSub?.price || "0.00"}</p>
                </div>
              </div>

              {/* SSLCommerz Payment Method Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-fixer-darkBg">Payment Processing</h2>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 border border-emerald-100 rounded-xl bg-emerald-50/30">
                    <div className="w-12 h-10 bg-emerald-100 rounded text-emerald-600 flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-fixer-darkBg">SSLCommerz Secure Gateway</p>
                      <p className="text-xs font-medium text-fixer-muted mt-0.5">Mobile Banking, Cards & Net Banking</p>
                    </div>
                    <span className="text-xs font-bold text-fixer-accent bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Protected</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                  Payments are processed securely via the SSLCommerz gateway. For your security, we do not store or tokenize your card or banking information. You will be redirected to authorize payments per billing cycle.
                </p>
              </div>
            </div>

          </div>

          {/* Usage Credits Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h2 className="text-lg font-bold text-fixer-darkBg mb-6">Monthly Usage Credits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Scraping Limit - Hardcoded Unlimited */}
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

              {/* AI Analysis Limit - Hardcoded Unlimited */}
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

              {/* Email Outbound Limit */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-fixer-text">Emails Sent</h3>
                    <p className="text-xs text-fixer-muted mt-0.5">Automated outreach</p>
                  </div>
                  <span className="text-sm font-bold text-fixer-darkBg">
                    {currentSub?.usage?.calls_made?.toLocaleString() || 0} <span className="text-gray-400 font-medium">/ {currentSub?.usage?.limit?.toLocaleString() || 0}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      (currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1) > 0.9 ? 'bg-red-500' : 'bg-purple-500'
                    }`} 
                    style={{ width: `${Math.min(((currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                {(currentSub?.usage?.calls_made || 0) / (currentSub?.usage?.limit || 1) > 0.9 && (
                  <p className="text-xs font-medium text-red-500">Approaching limit. Consider upgrading your plan.</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-fixer-muted">Need higher limits before your cycle ends?</p>
              <button 
                onClick={handleOpenUpgradeModal}
                className="text-sm font-bold text-fixer-primary hover:text-fixer-primaryHover transition-colors"
              >
                Buy extra credits &rarr;
              </button>
            </div>
          </div>

          {/* Invoice History Table */}
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
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                            invoice.status === 'VALID' ? 'bg-emerald-50 text-fixer-accent border border-emerald-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            disabled={!invoice.receipt}
                            className="p-2 text-gray-400 hover:text-fixer-primary hover:bg-blue-50 rounded-lg transition-colors inline-flex disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400" 
                            title="Download PDF"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
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