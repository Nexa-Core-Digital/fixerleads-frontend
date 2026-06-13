"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    workEmail: "",
    phoneNumber: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({ fullName: "", companyName: "", workEmail: "", phoneNumber: "", subject: "General Inquiry", message: "" });
  };

  return (
    <div className="min-h-screen bg-fixer-bg font-sans text-fixer-text">
      <Navbar />

      <main className="pt-24 pb-16">
        
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-fixer-darkBg mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-fixer-muted max-w-3xl mx-auto leading-relaxed">
            Have questions about FixerLeads? Need help with your account, API integration, or enterprise plan? Our team is here to help.
          </p>
        </section>

        {/* CONTACT CARDS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sales Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <svg className="w-6 h-6 text-fixer-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-fixer-darkBg mb-3">Talk to Sales</h3>
              <p className="text-sm text-fixer-muted mb-6 leading-relaxed flex-grow">
                Learn how FixerLeads can help your team generate qualified leads, automate outreach, and scale customer acquisition.
              </p>
              <div className="mb-6">
                <p className="text-xs font-bold text-fixer-darkBg uppercase tracking-wider mb-2">Best for:</p>
                <ul className="text-sm font-medium text-fixer-muted space-y-1">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Agencies</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Sales Teams</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Enterprise Customers</li>
                </ul>
              </div>
              <button className="w-full py-3 rounded-lg border-2 border-fixer-primary text-fixer-primary font-bold hover:bg-blue-50 transition-colors">
                Contact Sales
              </button>
            </div>

            {/* Support Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
                <svg className="w-6 h-6 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-fixer-darkBg mb-3">Customer Support</h3>
              <p className="text-sm text-fixer-muted mb-6 leading-relaxed flex-grow">
                Need help with billing, account setup, lead generation, reports, or email campaigns? Our support team is highly responsive.
              </p>
              <div className="mt-auto">
                <button className="w-full py-3 rounded-lg bg-fixer-primary hover:bg-fixer-primaryHover text-white font-bold transition-all shadow-md shadow-blue-500/20">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Partnerships Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6 border border-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-fixer-darkBg mb-3">Partnership Opportunities</h3>
              <p className="text-sm text-fixer-muted mb-6 leading-relaxed flex-grow">
                Interested in API integrations, strategic partnerships, affiliate programs, or enterprise reseller opportunities? Let's grow together.
              </p>
              <div className="mt-auto">
                <button className="w-full py-3 rounded-lg border-2 border-gray-200 text-fixer-text font-bold hover:bg-gray-50 transition-colors">
                  Become a Partner
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* FORM & INFO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left: Contact Form */}
            <div className="flex-1 p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-fixer-darkBg mb-8">Send Us a Message</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-emerald-50 text-fixer-accent rounded-lg border border-emerald-100 font-bold flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-fixer-text mb-2">Full Name *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-fixer-text mb-2">Company Name *</label>
                    <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm" placeholder="Acme Corp" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-fixer-text mb-2">Work Email *</label>
                    <input required type="email" name="workEmail" value={formData.workEmail} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm" placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-fixer-text mb-2">Phone Number (Optional)</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text mb-2">Subject *</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm bg-white cursor-pointer">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Sales Question">Sales Question</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="API Access">API Access</option>
                    <option value="Partnership Request">Partnership Request</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-fixer-text mb-2">Message *</label>
                  <textarea required name="message" rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-fixer-primary focus:border-fixer-primary outline-none transition-colors sm:text-sm shadow-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                  Submit Request
                </button>
              </form>
            </div>

            {/* Right: Contact Information */}
            <div className="w-full lg:w-96 bg-fixer-darkBg text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fixer-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Directory</h4>
                    <ul className="space-y-3 font-medium">
                      <li>
                        <span className="text-gray-400 text-sm block">Support</span>
                        <a href="mailto:support@fixerleads.com" className="hover:text-fixer-secondary transition-colors">support@fixerleads.com</a>
                      </li>
                      <li>
                        <span className="text-gray-400 text-sm block">Sales</span>
                        <a href="mailto:sales@fixerleads.com" className="hover:text-fixer-secondary transition-colors">sales@fixerleads.com</a>
                      </li>
                      <li>
                        <span className="text-gray-400 text-sm block">Partnerships</span>
                        <a href="mailto:partners@fixerleads.com" className="hover:text-fixer-secondary transition-colors">partners@fixerleads.com</a>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Hours</h4>
                    <p className="font-bold">Monday – Friday</p>
                    <p className="text-gray-400 text-sm mt-1">9:00 AM – 6:00 PM (UTC)</p>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Response Times</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span> Standard Support: Within 24 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-fixer-accent"></span> Priority Support: Within 4 hours
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-fixer-darkBg mb-12">Before Contacting Us</h2>
          <div className="space-y-6">
            {[
              {
                q: "How does FixerLeads generate leads?",
                a: "FixerLeads discovers businesses through location-based searches, enriches business data using AI, and generates actionable lead reports."
              },
              {
                q: "Can I export my leads?",
                a: "Yes. Leads can be exported in multiple formats and easily shared with your team or CRM system."
              },
              {
                q: "Do you offer API access?",
                a: "Yes. Native API access is available on selected plans like Agency and Enterprise."
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time right from your billing dashboard."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-fixer-darkBg">{faq.q}</h4>
                <p className="text-fixer-muted mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
          <div className="bg-fixer-darkBg rounded-[2rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fixer-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fixer-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10">Need a Custom Solution?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Looking for high-volume lead generation, dedicated account support, custom API integrations, or enterprise onboarding?
            </p>
            <button className="bg-white text-fixer-darkBg text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:bg-gray-50 relative z-10">
              Schedule a Consultation
            </button>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="bg-gradient-to-r from-fixer-primary to-blue-800 py-24 px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Next Customers?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Generate qualified leads, create professional reports, and automate outreach—all from one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-white text-fixer-primary text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Start Free Trial
            </Link>
            <Link href="/#pricing" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl font-bold transition-all">
              View Pricing
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}