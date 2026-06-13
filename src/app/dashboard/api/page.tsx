"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Helper component for sleek code blocks
const CodeBlock = ({ title, code }: { title?: string, code: string }) => (
  <div className="rounded-xl bg-[#0F172A] border border-gray-800 overflow-hidden my-4 shadow-lg">
    {title && (
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs font-mono text-gray-400 flex justify-between items-center">
        <span>{title}</span>
        <button className="hover:text-white transition-colors" title="Copy to clipboard">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
      </div>
    )}
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono text-gray-300 whitespace-pre"><code dangerouslySetInnerHTML={{ __html: code }} /></pre>
    </div>
  </div>
);

// Helper for Method Badges
const MethodBadge = ({ method }: { method: "GET" | "POST" }) => (
  <span className={`text-xs font-bold px-2 py-1 rounded-md ${method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
    {method}
  </span>
);

export default function ApiDocumentationPage() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const dummyApiKey = "fl_live_9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p";

  return (
    <div className="min-h-screen bg-fixer-bg pb-12">
      {/* Global Navbar */}
      <Navbar />

      <div className="pt-20">
        {/* API Hero Section */}
        <section className="bg-fixer-darkBg py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fixer-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-fixer-secondary text-xs font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-fixer-secondary animate-pulse"></span>
                v1.0 API Now Live
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                FixerLeads API
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Integrate AI-powered lead generation, business enrichment, report generation, and email automation directly into your own applications.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/25 transition-all">
                  Get API Key
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-3 rounded-lg text-sm font-bold transition-all">
                  View Documentation
                </button>
              </div>
            </div>

            {/* API Usage Dashboard Mini-Card */}
            <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                Authentication
              </h3>
              
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 mb-2 block">Your Secret API Key</label>
                <div className="flex items-center gap-2">
                  <input 
                    type={apiKeyVisible ? "text" : "password"} 
                    value={dummyApiKey} 
                    readOnly 
                    className="flex-1 bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none font-mono"
                  />
                  <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
                    {apiKeyVisible ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-orange-400 mt-2">Never share your secret key in public repositories.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">API Requests</p>
                  <p className="text-xl font-extrabold text-white">4,281 <span className="text-xs font-medium text-gray-500">/ 10k</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-1">API Status</p>
                  <p className="text-sm font-bold text-fixer-accent flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-fixer-accent"></span> Operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Content Layout */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <div className="sticky top-28">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">Overview</h4>
              <ul className="space-y-3 text-sm font-medium text-fixer-text mb-8">
                <li><Link href="#capabilities" className="hover:text-fixer-primary transition-colors">What can developers do?</Link></li>
                <li><Link href="#authentication" className="hover:text-fixer-primary transition-colors">Authentication</Link></li>
                <li><Link href="#rate-limits" className="hover:text-fixer-primary transition-colors">Rate Limits</Link></li>
                <li><Link href="#target-audience" className="hover:text-fixer-primary transition-colors">Who Needs the API?</Link></li>
              </ul>

              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">Endpoints</h4>
              <ul className="space-y-3 text-sm font-medium text-fixer-text mb-8">
                <li><Link href="#endpoint-search" className="hover:text-fixer-primary transition-colors">Lead Generation</Link></li>
                <li><Link href="#endpoint-get" className="hover:text-fixer-primary transition-colors">Get Generated Leads</Link></li>
                <li><Link href="#endpoint-score" className="hover:text-fixer-primary transition-colors">AI Lead Scoring</Link></li>
                <li><Link href="#endpoint-audit" className="hover:text-fixer-primary transition-colors">Website Audit</Link></li>
                <li><Link href="#endpoint-report" className="hover:text-fixer-primary transition-colors">PDF Generation</Link></li>
                <li><Link href="#endpoint-email" className="hover:text-fixer-primary transition-colors">Email Automation</Link></li>
              </ul>

              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">Advanced</h4>
              <ul className="space-y-3 text-sm font-medium text-fixer-text">
                <li><Link href="#webhooks" className="hover:text-fixer-primary transition-colors">Webhooks</Link></li>
                <li><Link href="#sdks" className="hover:text-fixer-primary transition-colors">SDKs (Future)</Link></li>
                <li><Link href="#playground" className="text-fixer-primary font-bold hover:text-fixer-primaryHover transition-colors flex items-center gap-1.5"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> API Playground</Link></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            
            {/* Overview */}
            <section id="capabilities" className="mb-16">
              <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-4">What can developers do?</h2>
              <p className="text-fixer-muted mb-6 leading-relaxed">
                The FixerLeads REST API allows you to programmatically access all dashboard features. Build custom CRM integrations, automate your agency's pipeline, or enhance your SaaS product.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Search businesses from Google Maps", "Generate qualified leads", 
                  "Retrieve business information", "Run AI website audits", 
                  "Generate PDF reports", "Send outreach emails", 
                  "Track lead generation status", "Manage credits and usage"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <svg className="w-5 h-5 text-fixer-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span className="text-sm font-bold text-fixer-text">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16">
              <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-4">Authentication</h2>
              <p className="text-fixer-muted mb-4 leading-relaxed">
                Authenticate your account by sending your secret API key in the `Authorization` header of your HTTP requests.
              </p>
              <CodeBlock title="Headers" code={`Authorization: Bearer YOUR_API_KEY`} />
              <CodeBlock 
                title="cURL Example" 
                code={`curl -X GET https://api.fixerleads.com/v1/leads \\
  -H "Authorization: Bearer YOUR_API_KEY"`} 
              />
            </section>

            <hr className="border-gray-200 my-12" />

            <h2 className="text-3xl font-extrabold text-fixer-darkBg mb-8">Available Endpoints</h2>

            {/* Endpoint: Search */}
            <section id="endpoint-search" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/leads/search</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Initiate an asynchronous lead generation job from Google Maps data.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Request Body</h4>
                  <CodeBlock code={`{\n  <span style="color:#7DD3FC">"keyword"</span>: "Dentist",\n  <span style="color:#7DD3FC">"location"</span>: "New York"\n}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (202 Accepted)</h4>
                  <CodeBlock code={`{\n  <span style="color:#7DD3FC">"job_id"</span>: "12345",\n  <span style="color:#7DD3FC">"status"</span>: "processing"\n}`} />
                </div>
              </div>
            </section>

            {/* Endpoint: Get Leads */}
            <section id="endpoint-get" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/leads/&#123;job_id&#125;</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Retrieve the results of a completed lead generation job.</p>
              
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (200 OK)</h4>
              <CodeBlock code={`{\n  <span style="color:#7DD3FC">"business_name"</span>: "ABC Dental",\n  <span style="color:#7DD3FC">"website"</span>: "https://abcdental.com",\n  <span style="color:#7DD3FC">"email"</span>: "contact@abcdental.com",\n  <span style="color:#7DD3FC">"phone"</span>: "+123456789"\n}`} />
            </section>

            {/* Endpoint: Score */}
            <section id="endpoint-score" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/score</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Pass business data to receive an AI-generated conversion probability score.</p>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (200 OK)</h4>
              <CodeBlock code={`{\n  <span style="color:#7DD3FC">"lead_score"</span>: 8.7,\n  <span style="color:#7DD3FC">"recommendation"</span>: "High Potential"\n}`} />
            </section>

            {/* Endpoint: Audit */}
            <section id="endpoint-audit" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/audit</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Trigger a deep AI audit of a target website.</p>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (200 OK)</h4>
              <CodeBlock code={`{\n  <span style="color:#7DD3FC">"seo_score"</span>: 78,\n  <span style="color:#7DD3FC">"mobile_score"</span>: 92,\n  <span style="color:#7DD3FC">"recommendations"</span>: [...]\n}`} />
            </section>

            {/* Endpoint: Report */}
            <section id="endpoint-report" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/report</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Generate a white-labeled PDF report based on audit data.</p>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (201 Created)</h4>
              <CodeBlock code={`{\n  <span style="color:#7DD3FC">"pdf_url"</span>: "https://cdn.fixerleads.com/reports/12345.pdf"\n}`} />
            </section>

            {/* Endpoint: Email */}
            <section id="endpoint-email" className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="POST" />
                <h3 className="text-lg font-mono font-bold text-fixer-text">/api/v1/email/send</h3>
              </div>
              <p className="text-sm text-fixer-muted mb-4">Dispatch an automated outreach email to a generated lead.</p>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Response (200 OK)</h4>
              <CodeBlock code={`{\n  <span style="color:#7DD3FC">"status"</span>: "sent"\n}`} />
            </section>

            <hr className="border-gray-200 my-12" />

            {/* Rate Limits */}
            <section id="rate-limits" className="mb-16">
              <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-4">Rate Limits</h2>
              <p className="text-fixer-muted mb-6 leading-relaxed">
                To protect our Google Maps costs, Anthropic AI usage, and server infrastructure, API requests are throttled based on your active billing plan.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Monthly Request Limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm font-medium">
                    <tr>
                      <td className="px-6 py-4 text-fixer-darkBg">Starter</td>
                      <td className="px-6 py-4 text-fixer-muted">1,000 / month</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-fixer-primary font-bold">Professional</td>
                      <td className="px-6 py-4 text-fixer-muted">10,000 / month</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-fixer-darkBg">Agency</td>
                      <td className="px-6 py-4 text-fixer-muted">100,000 / month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="mb-16">
              <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-4">Webhooks</h2>
              <p className="text-fixer-muted mb-4 leading-relaxed">
                Many of our operations (like scraping entire cities or generating complex AI reports) are long-running jobs. Use webhooks to get notified when processing completes.
              </p>
              <ul className="list-disc pl-5 mb-6 text-sm text-fixer-muted space-y-2 font-medium">
                <li><code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">lead.completed</code> - Lead generation finished</li>
                <li><code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">report.ready</code> - PDF generation finished</li>
                <li><code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">email.delivered</code> - Outreach email landed in inbox</li>
              </ul>
              <CodeBlock title="Webhook Payload Example" code={`{\n  <span style="color:#7DD3FC">"event"</span>: "lead.completed",\n  <span style="color:#7DD3FC">"job_id"</span>: "12345"\n}`} />
            </section>

            {/* SDKs */}
            <section id="sdks" className="mb-16">
              <h2 className="text-2xl font-extrabold text-fixer-darkBg mb-4">SDKs & Libraries</h2>
              <p className="text-fixer-muted mb-4 leading-relaxed">
                We are actively developing official SDKs to make integrating FixerLeads even easier. Planned support includes: <span className="font-bold text-fixer-text">Python, JavaScript, Node.js, and PHP</span>.
              </p>
              <CodeBlock 
                title="Node.js Usage (Preview)" 
                code={`<span style="color:#C586C0">const</span> fixerleads = <span style="color:#569CD6">new</span> <span style="color:#4EC9B0">FixerLeads</span>(API_KEY);\n\n<span style="color:#C586C0">const</span> leads = <span style="color:#C586C0">await</span> fixerleads.<span style="color:#DCDCAA">search</span>({\n  keyword: <span style="color:#CE9178">"Dentist"</span>,\n  location: <span style="color:#CE9178">"New York"</span>\n});`} 
              />
            </section>

            {/* Playground & Audience Footer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-fixer-primary to-blue-800 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-xl font-extrabold mb-3 relative z-10">Interactive API Playground</h3>
                <p className="text-blue-100 text-sm mb-6 relative z-10">
                  Enter your API key, test endpoints live, and see real JSON responses without writing any code.
                </p>
                <button className="bg-white text-fixer-primary px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-gray-50 transition-colors relative z-10">
                  Launch Playground
                </button>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-extrabold text-fixer-darkBg mb-3">Who needs this API?</h3>
                <p className="text-fixer-muted text-sm mb-4 leading-relaxed">
                  While most users rely purely on our dashboard, the API provides immense value to builders requiring native integration.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["CRM Developers", "Agencies", "Enterprise", "SaaS Founders", "Zapier Users"].map(tag => (
                    <span key={tag} className="bg-gray-100 border border-gray-200 text-fixer-text text-xs font-bold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}