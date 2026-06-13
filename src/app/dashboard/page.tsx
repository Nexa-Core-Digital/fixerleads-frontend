"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch User Profile, Dashboard Stats, and Leads simultaneously
        const [userRes, statsRes, leadsRes] = await Promise.all([
          fetchApi('/api/users/me/'),
          fetchApi('/api/leads/dashboard_stats/'),
          fetchApi('/api/leads/')
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setDashboardStats(statsData);
        }

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setRecentLeads(leadsData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Map dynamic backend data into the stats array (removed trend arrows)
  const stats = [
    {
      name: "Total Leads Generated",
      value: dashboardStats?.total_leads || "0",
      icon: (
        <svg className="w-6 h-6 text-fixer-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: "Emails Sent",
      value: dashboardStats?.emails_sent || "0",
      icon: (
        <svg className="w-6 h-6 text-fixer-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Active Campaigns",
      value: dashboardStats?.active_campaigns || "0",
      icon: (
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      name: "AI Score Average",
      value: dashboardStats?.ai_score_average || "0",
      icon: (
        <svg className="w-6 h-6 text-fixer-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fixer-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fixer-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixer-bg pb-12">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content wrapper with top padding to offset the fixed Navbar */}
      <div className="pt-20">
        
        {/* Page Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                
                {/* Dynamic Profile Image */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-fixer-primary to-fixer-secondary p-0.5 shrink-0">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {user?.basic_info?.profile_picture ? (
                      <img 
                        src={user.basic_info.profile_picture} 
                        alt={user.basic_info.full_name || "Profile"} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-fixer-primary uppercase">
                        {user?.basic_info?.full_name ? user.basic_info.full_name.charAt(0) : "U"}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-extrabold text-fixer-darkBg">
                    Welcome back, {user?.basic_info?.full_name || "User"}
                  </h1>
                  <p className="text-sm font-medium text-fixer-muted mt-1">
                    {user?.profile?.job_title || "Professional"} at {user?.profile?.company_name || "Company"} • <span className="text-fixer-accent font-bold capitalize">{user?.account_type || "Standard"} Plan</span>
                  </p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/dashboard/reports" className="bg-white border border-gray-200 text-fixer-text hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
                  View Reports
                </Link>
                <Link href="/dashboard/campaigns" className="bg-fixer-primary hover:bg-fixer-primaryHover text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  New Campaign
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Quick Actions Mobile (Visible only on small screens) */}
          <div className="sm:hidden flex gap-3 mb-6">
            <Link href="/dashboard/campaigns" className="flex-1 text-center bg-fixer-primary text-white py-2.5 rounded-lg text-sm font-bold shadow-md">New Campaign</Link>
            <Link href="/dashboard/reports" className="flex-1 text-center bg-white border border-gray-200 text-fixer-text py-2.5 rounded-lg text-sm font-bold shadow-sm">Reports</Link>
          </div>

          {/* Overview Stats Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-fixer-darkBg mb-4">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-fixer-muted mb-1">{stat.name}</h3>
                  <p className="text-3xl font-extrabold text-fixer-darkBg">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area: Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Leads Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-fixer-darkBg">Recently Captured Leads</h3>
                <Link href="/dashboard/leads" className="text-sm font-bold text-fixer-primary hover:text-fixer-primaryHover">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase tracking-wider text-fixer-muted font-bold">
                      <th className="px-6 py-4 border-b border-gray-100">Company Name</th>
                      <th className="px-6 py-4 border-b border-gray-100">Location</th>
                      <th className="px-6 py-4 border-b border-gray-100">AI Score</th>
                      <th className="px-6 py-4 border-b border-gray-100">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentLeads.length > 0 ? (
                      recentLeads.slice(0, 5).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-fixer-darkBg text-sm">{row.name}</td>
                          <td className="px-6 py-4 text-fixer-muted text-sm">{row.location}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-fixer-accent border border-emerald-100">
                              {row.ai_score} / 10
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold capitalize ${
                              row.status === 'approved_to_send' ? 'text-fixer-primary' : 
                              row.status === 'emailed' ? 'text-purple-600' : 
                              row.status === 'audited' ? 'text-fixer-secondary' : 'text-orange-500'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                row.status === 'approved_to_send' ? 'bg-fixer-primary' : 
                                row.status === 'emailed' ? 'bg-purple-600' : 
                                row.status === 'audited' ? 'bg-fixer-secondary' : 'bg-orange-500 animate-pulse'
                              }`}></span>
                              {row.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-fixer-muted">
                          No leads generated yet. Start a search to capture leads!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Setup / System Status Card */}
            <div className="bg-fixer-darkBg rounded-2xl shadow-xl border border-gray-800 p-6 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fixer-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <h3 className="text-lg font-bold text-white mb-6 relative z-10">System Status</h3>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-300">API Credit Usage</span>
                    <span className="text-white">{dashboardStats?.system_status?.usage_percentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-fixer-secondary h-2 rounded-full" 
                      style={{ width: `${dashboardStats?.system_status?.usage_percentage || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {dashboardStats?.system_status?.api_limit - (dashboardStats?.system_status?.api_used || 0)} / {dashboardStats?.system_status?.api_limit || 1000} scrapes remaining this cycle
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 relative z-10">
                <button className="w-full bg-white text-fixer-darkBg font-bold py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}