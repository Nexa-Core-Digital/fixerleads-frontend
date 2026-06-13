"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";


const getSecurePdfUrl = (path: string | null) => {
  if (!path) return '#';
  
  if (path.startsWith('http')) {
    return path; 
  }


  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8001';
  

  return `${baseUrl}${path}`;
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetchApi('/api/leads/');
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);


  const reportLeads = leads.filter((lead) => 
    ['report_ready', 'emailed', 'approved_to_send'].includes(lead.status) && lead.screenshot_path
  );


  const filteredReports = reportLeads.filter((lead) => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (path: string | null) => {
    const secureUrl = getSecurePdfUrl(path);
    if (secureUrl !== '#') {
      window.open(secureUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-fixer-bg pb-12">
      <Navbar />

      <div className="pt-20">
        
        {/* Page Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-fixer-darkBg">Reports</h1>
                <p className="text-sm font-medium text-fixer-muted mt-1">
                  Manage, view, and download your AI-generated PDF outreach reports.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Generate New Report
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Top Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <svg className="w-6 h-6 text-fixer-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-fixer-muted">Reports Generated</p>
                <p className="text-2xl font-extrabold text-fixer-darkBg">{reportLeads.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <svg className="w-6 h-6 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-fixer-muted">Total Downloads</p>
                <p className="text-2xl font-extrabold text-fixer-darkBg">--</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200">
                <svg className="w-6 h-6 text-fixer-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-fixer-muted">Storage Used</p>
                  <p className="text-xs font-bold text-fixer-text">Active</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-fixer-secondary h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Table Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Table Toolbar */}
            <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-fixer-primary focus:border-fixer-primary outline-none text-sm font-medium transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <select className="bg-white border border-gray-300 text-fixer-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fixer-primary focus:ring-1 focus:ring-fixer-primary font-medium cursor-pointer flex-1 sm:flex-none">
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-fixer-muted font-bold border-b border-gray-200">
                    <th className="px-6 py-4">Report Name</th>
                    <th className="px-6 py-4">Target Keyword & Location</th>
                    <th className="px-6 py-4">Date Generated</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-fixer-muted">
                        <div className="inline-block w-8 h-8 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-sm font-medium">Loading reports...</p>
                      </td>
                    </tr>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292h-1.5v-6.584h1.5v6.584zm1.5-6.584h1.5v6.584h-1.5v-6.584zm2.75 0h1.5v6.584h-1.5v-6.584zm2.75 0h1.5v6.584h-1.5v-6.584z" clipRule="evenodd" fillRule="evenodd" opacity="0.2"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                            </div>
                            <span className="font-bold text-fixer-darkBg text-sm">{report.name} Audit Report</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-fixer-muted">{report.category} • {report.location}</span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-fixer-muted">
                            {new Date(report.audited_at || report.scraped_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-fixer-text bg-gray-100 px-2 py-1 rounded">PDF</span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-fixer-accent border border-emerald-100">
                            Ready
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDownload(report.screenshot_path)}
                              className="p-2 text-gray-400 hover:text-fixer-primary hover:bg-blue-50 rounded-lg transition-colors" 
                              title="View PDF"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button 
                              onClick={() => handleDownload(report.screenshot_path)}
                              className="p-2 text-gray-400 hover:text-fixer-accent hover:bg-emerald-50 rounded-lg transition-colors" 
                              title="Download PDF"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-fixer-muted">
                        No reports found. Generate leads and run audits to create reports.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredReports.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
                <span className="text-sm text-fixer-muted">Showing <span className="font-bold text-fixer-text">1</span> to <span className="font-bold text-fixer-text">{filteredReports.length}</span> of <span className="font-bold text-fixer-text">{reportLeads.length}</span> reports</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">Previous</button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-fixer-text hover:bg-gray-50 transition-colors">Next</button>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}