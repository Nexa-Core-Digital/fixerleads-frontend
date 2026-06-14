"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || "http://localhost:8001";
      const headers = {
        'Content-Type': 'application/json',
      };

      try {
        // Fetch Home FAQs
        fetch(`${baseUrl}/api/utils/faqs/?page=home`, { headers })
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            setFaqs(data);
            setIsLoadingFaqs(false);
          })
          .catch(() => setIsLoadingFaqs(false));

        // Fetch Plans
        fetch(`${baseUrl}/api/payments/plans/`, { headers })
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            setPlans(data);
            setIsLoadingPlans(false);
          })
          .catch(() => setIsLoadingPlans(false));

      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-fixer-bg min-h-screen font-sans text-fixer-text selection:bg-fixer-primary/20">
      <Navbar />

      <main className="pt-20">
        
        {/* SECTION 1 — HERO */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px]"></div>
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-400/15 blur-[120px]"></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-fixer-primary text-sm font-semibold mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fixer-primary"></span>
              </span>
              AI-Powered Lead Intelligence Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-fixer-darkBg mb-8 leading-tight">
              Find, analyze, and contact <br className="hidden md:block"/> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-fixer-primary to-fixer-secondary">best leads</span> automatically
            </h1>
            <p className="text-lg md:text-xl text-fixer-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              Scrape Google Maps, enrich business data, generate AI-powered reports, and send personalized outreach emails — seamlessly from one intelligent dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/register" className="bg-fixer-primary hover:bg-fixer-primaryHover text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-blue-500/25 hover:-translate-y-1">
                Start Free Trial
              </Link>
              <button className="bg-white border border-gray-200 text-fixer-text hover:border-fixer-secondary hover:text-fixer-secondary text-lg px-8 py-4 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-fixer-secondary transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2 — WHAT IT DOES */}
        <section id="features" className="max-w-7xl mx-auto px-4 py-24 border-t border-gray-100 bg-white/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-fixer-darkBg">Everything you need to scale</h2>
            <p className="mt-4 text-fixer-muted">A complete suite of tools to automate your outbound workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-fixer-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fixer-darkBg">Find Leads</h3>
              <p className="text-fixer-muted leading-relaxed">Extract high-quality business leads directly from Google Maps in any specific niche or location worldwide.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 rounded-xl bg-cyan-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v8l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fixer-darkBg">AI Analyze</h3>
              <p className="text-fixer-muted leading-relaxed">Perform instant website audits, extract deep business insights, and generate intelligent opportunity scoring.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fixer-darkBg">Lead Scoring</h3>
              <p className="text-fixer-muted leading-relaxed">Each captured lead receives an automated 1–10 score based strictly on actual conversion potential and data completeness.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fixer-darkBg">Auto Reports</h3>
              <p className="text-fixer-muted leading-relaxed">Instantly generate beautiful, white-labeled PDF reports detailing business insights to attach to your outreach.</p>
            </div>
            {/* Card 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fixer-darkBg">Outreach Automation</h3>
              <p className="text-fixer-muted leading-relaxed">Generate highly personalized, context-aware emails and dispatch them automatically directly from the platform.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — ONE CLICK MAGIC */}
        <section className="bg-fixer-darkBg relative py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">One Click → Full Sales Pipeline</h2>
            <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">Stop constantly switching between isolated tools. Every step of your workflow happens in one seamless environment.</p>
            
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-lg font-semibold text-gray-300">
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Search</span>
              <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Scrape</span>
              <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Analyze</span>
              <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Score</span>
              <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Report</span>
              <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl backdrop-blur-sm">Email</span>
              <svg className="w-5 h-5 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              <span className="bg-gradient-to-r from-fixer-accent to-emerald-400 text-white px-8 py-3 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">Track</span>
            </div>
          </div>
        </section>

        {/* SECTION 4 — USE CASES */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-fixer-darkBg">Built for serious growth</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <h4 className="text-xl font-bold text-fixer-primary mb-2">Agencies</h4>
              <p className="text-fixer-muted">Find specific clients needing SEO, web design, or marketing services efficiently without manual prospecting.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <h4 className="text-xl font-bold text-fixer-secondary mb-2">Freelancers</h4>
              <p className="text-fixer-muted">Acquire direct business leads from local companies looking to scale their digital presence.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <h4 className="text-xl font-bold text-fixer-accent mb-2">SaaS Founders</h4>
              <p className="text-fixer-muted">Discover startups and established businesses that fit the exact ICP for your software tools.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <h4 className="text-xl font-bold text-purple-600 mb-2">Sales Teams</h4>
              <p className="text-fixer-muted">Automate tedious outbound prospecting so account executives can focus purely on closing deals.</p>
            </div>
          </div>
        </section>

        {/* SECTION 5 — HOW IT WORKS */}
        <section id="how-it-works" className="bg-white border-y border-gray-100 py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-fixer-darkBg">How FixerLeads Works</h2>
            <div className="space-y-6">
              {[
                { title: "Enter Query", desc: "Type your target keyword and location into the intelligent search bar." },
                { title: "AI Collection", desc: "Our engine maps and collects hundreds of verified business records." },
                { title: "Deep Analysis", desc: "The system audits each website, checking for modern standards and tech stack." },
                { title: "Smart Ranking", desc: "You receive a clean list ranked entirely by close-probability." },
                { title: "One-Click Outreach", desc: "Trigger personalized email sequences instantly with attached custom reports." }
              ].map((step, index) => (
                <div key={index} className="flex bg-fixer-bg p-6 rounded-2xl border border-gray-100 items-start gap-6 transition-all hover:shadow-md">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white text-fixer-primary flex items-center justify-center text-xl font-bold border border-gray-200 shadow-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-fixer-darkBg">{step.title}</h4>
                    <p className="text-fixer-muted mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — DEMO PREVIEW */}
        <section id="demo" className="max-w-6xl mx-auto px-4 py-32">
          <div className="bg-fixer-darkBg rounded-[2rem] p-4 shadow-2xl relative">
            {/* Fake Browser Header */}
            <div className="flex gap-2 mb-4 px-4 pt-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {/* Dashboard Area - Replace src with your actual image path */}
            <div className="bg-white rounded-xl h-[300px] md:h-[600px] w-full flex items-center justify-center border border-gray-200 shadow-inner overflow-hidden relative">
              <img 
                src="/DashboardInterfacePreview.png" 
                alt="Dashboard Interface Preview" 
                className="w-full h-full object-contain" /* Changed from object-cover to object-contain */
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* Fallback View if image is missing */}
              <div className="hidden text-center px-4 absolute inset-0 flex-col items-center justify-center bg-gray-50">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p className="text-fixer-muted font-medium text-lg">Dashboard Interface Preview</p>
                <p className="text-gray-400 text-sm mt-2">Displaying Lead Tables, AI Scores, and Email Sequences</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — PRICING */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-16 text-fixer-darkBg">Simple, transparent pricing</h2>
          
          {isLoadingPlans ? (
            <div className="flex justify-center items-center py-12">
               <div className="w-10 h-10 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {plans.map((plan, index) => {
                const isPopular = plan.name?.toLowerCase().includes('pro') || index === 1;

                return (
                  <div key={plan.id || index} className={
                    isPopular 
                    ? "bg-fixer-darkBg p-8 lg:p-10 rounded-3xl shadow-2xl border border-fixer-primary/30 relative transform lg:-translate-y-4"
                    : "bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-gray-200"
                  }>
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-fixer-primary to-fixer-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                        Most Popular
                      </div>
                    )}
                    
                    <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-fixer-darkBg'}`}>
                      {plan.name || plan.plan_name}
                    </h3>
                    <p className={`mb-6 ${isPopular ? 'text-gray-400' : 'text-fixer-muted'}`}>
                      {plan.description || "Perfect for scaling your business."}
                    </p>
                    
                    <div className={`text-4xl font-extrabold mb-8 ${isPopular ? 'text-white' : 'text-fixer-darkBg'}`}>
                      {plan.currency === 'USD' ? '$' : plan.currency}{plan.price}
                      <span className={`text-lg font-medium ${isPopular ? 'text-gray-400' : 'text-gray-400'}`}>/mo</span>
                    </div>
                    
                    <ul className={`space-y-4 mb-8 font-medium ${isPopular ? 'text-gray-300' : 'text-fixer-muted'}`}>
                      <li className="flex items-center gap-3"><svg className="w-5 h-5 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> {plan.limit?.toLocaleString() || "Unlimited"} Leads & Emails</li>
                      <li className="flex items-center gap-3"><svg className="w-5 h-5 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Unlimited Map Scrapes</li>
                      <li className="flex items-center gap-3"><svg className="w-5 h-5 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Advanced AI Scoring & Audits</li>
                      <li className="flex items-center gap-3"><svg className="w-5 h-5 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Automated Sequence Workflow</li>
                    </ul>
                    
                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                      isPopular 
                      ? 'bg-fixer-primary hover:bg-fixer-primaryHover text-white shadow-lg shadow-blue-500/25' 
                      : 'border-2 border-fixer-primary text-fixer-primary hover:bg-blue-50'
                    }`}>
                      Choose {plan.name || plan.plan_name}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 8 — FAQ (Dynamically Fetched) */}
        <section className="max-w-3xl mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-fixer-darkBg">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {isLoadingFaqs ? (
               <div className="flex justify-center items-center py-6">
                 <div className="w-8 h-8 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : faqs.length > 0 ? (
              faqs.map((faq, i) => (
                <div key={faq.id || i} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-fixer-darkBg">{faq.question}</h4>
                  <p className="text-fixer-muted mt-2 leading-relaxed">{faq.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-fixer-muted">No FAQs available at this time.</p>
            )}
          </div>
        </section>

        {/* SECTION 9 — FINAL CTA */}
        <section className="max-w-5xl mx-auto px-4 py-10 mb-20">
          <div className="bg-gradient-to-br from-fixer-primary to-blue-800 rounded-3xl py-20 px-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">Start generating high-quality leads today</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">Join thousands of agencies and founders scaling their outreach entirely on autopilot.</p>
            <Link href="/register" className="inline-block bg-white text-fixer-primary text-lg px-10 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 relative z-10">
              Get Started Free
            </Link>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-fixer-darkBg text-gray-300 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Branding Column */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2 tracking-tight">
                <Image src="/icon.png" alt="FixerLeads Logo" width={32} height={32} className="object-contain brightness-0 invert" />
                Fixer<span className="text-fixer-primary">Leads</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 max-w-sm leading-relaxed">
                AI-Powered Lead Intelligence & Outreach Automation. Find, analyze, score, and contact high-potential business leads automatically.
              </p>
              <div className="flex gap-4">
                {/* Real SVG Social Icons */}
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-fixer-primary transition-colors text-white" aria-label="LinkedIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-fixer-primary transition-colors text-white" aria-label="X (Twitter)">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-fixer-primary transition-colors text-white" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-fixer-primary transition-colors text-white" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </Link>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#features" className="hover:text-fixer-secondary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Lead Finder</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">AI Lead Scoring</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Website Audit</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">PDF Reports</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Email Outreach</Link></li>
                <li><Link href="#pricing" className="hover:text-fixer-secondary transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            {/* Company & Support Column */}
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm mb-8">
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">Affiliates</Link></li>
                <li><Link href="/contact" className="hover:text-fixer-secondary transition-colors">Contact</Link></li>
              </ul>
              
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:support@fixerleads.com" className="hover:text-fixer-secondary transition-colors">support@fixerleads.com</a></li>
                <li><Link href="#" className="hover:text-fixer-secondary transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">GDPR Compliance</Link>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-center font-medium">
               <span className="flex items-center gap-1"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> SSL Secured</span>
               <span className="flex items-center gap-1"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> GDPR Ready</span>
               <span className="flex items-center gap-1 text-fixer-accent"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg> AI Powered</span>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>© 2026 FixerLeads. All rights reserved.</p>
            <p className="mt-2">Made for agencies, freelancers, sales teams, and SaaS founders worldwide.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}