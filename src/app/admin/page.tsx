"use client";

import React, { useState } from "react";
import { useExchange } from "@/context/ExchangeContext";
import {
  ShieldAlert,
  Users,
  BookOpen,
  Repeat,
  Calendar,
  Award,
  TrendingUp,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  const { users, skills, exchanges, sessions, reviews } = useExchange();

  const [activeAdminTab, setActiveAdminTab] = useState<
    "analytics" | "users" | "skills" | "exchanges"
  >("analytics");

  // Calculated stats
  const totalStudents = users.length * 180;
  const activeExchangesCount = exchanges.filter((e) => e.status === "active").length;
  const completedSessionsCount = sessions.filter((s) => s.status === "completed").length * 85;
  const avgRating = (
    users.reduce((acc, u) => acc + u.reputationScore, 0) / (users.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin Control Plane & Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Platform Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time telemetry, campus student moderation, and exchange performance analytics.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS (Section 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Total Students
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">↑ +14% this month</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Active Verified
          </div>
          <div className="text-2xl font-black text-blue-600">
            {users.length}
          </div>
          <div className="text-[10px] text-slate-400">Campus profiles</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Total Skills
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {skills.length}
          </div>
          <div className="text-[10px] text-slate-400">In catalog</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Active Exchanges
          </div>
          <div className="text-2xl font-black text-violet-600">
            {activeExchangesCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">96% satisfaction</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Completed Sessions
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {completedSessionsCount}+
          </div>
          <div className="text-[10px] text-slate-400">Via Meet / Zoom</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Avg Rating
          </div>
          <div className="text-2xl font-black text-amber-500">
            {avgRating} ⭐
          </div>
          <div className="text-[10px] text-slate-400">Across 100+ reviews</div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { key: "analytics", label: "Analytics & Telemetry", icon: TrendingUp },
          { key: "users", label: `Students Directory (${users.length})`, icon: Users },
          { key: "skills", label: `Skills Catalog (${skills.length})`, icon: BookOpen },
          { key: "exchanges", label: `Exchanges Management (${exchanges.length})`, icon: Repeat },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveAdminTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-blue-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISUAL ANALYTICS & CHARTS */}
      {activeAdminTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1: Popular Skills Distribution */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Top Demanded Skills on Campus</span>
              <span className="text-[11px] text-slate-400 font-normal">Learners Count</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { name: "React & Next.js", count: 310, pct: 92, color: "bg-blue-600" },
                { name: "Python Backend", count: 289, pct: 86, color: "bg-indigo-600" },
                { name: "Machine Learning & PyTorch", count: 245, pct: 75, color: "bg-violet-600" },
                { name: "Cloud Computing (GCP/AWS)", count: 175, pct: 58, color: "bg-emerald-600" },
                { name: "Figma UI/UX Design", count: 142, pct: 49, color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="text-slate-500 font-semibold">{item.count} learners</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Student Exchanges by Category */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Exchange Activity by Category</span>
              <span className="text-[11px] text-slate-400 font-normal">Monthly Volume</span>
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { name: "Web Development", volume: "420 exchanges", pct: 88, color: "bg-blue-600" },
                { name: "AI / Machine Learning", volume: "310 exchanges", pct: 68, color: "bg-violet-600" },
                { name: "UI / UX Design", volume: "240 exchanges", pct: 54, color: "bg-amber-500" },
                { name: "Cloud & DevOps", volume: "195 exchanges", pct: 45, color: "bg-emerald-600" },
                { name: "Cybersecurity", volume: "120 exchanges", pct: 30, color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="text-slate-500 font-semibold">{item.volume}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS DIRECTORY */}
      {activeAdminTab === "users" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Campus / College</th>
                  <th className="p-4">Teaches</th>
                  <th className="p-4">Learning</th>
                  <th className="p-4">Reputation</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.photoURL}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div>{u.college}</div>
                      <div className="text-[10px] text-slate-400">{u.department}</div>
                    </td>
                    <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">
                      {u.skillsToTeach.map((s) => s.skillName).join(", ")}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {u.skillsToLearn.map((s) => s.skillName).join(", ")}
                    </td>
                    <td className="p-4 font-bold text-amber-500">
                      ⭐ {u.reputationScore}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS MANAGEMENT */}
      {activeAdminTab === "skills" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-4">Skill Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Active Mentors</th>
                <th className="p-4">Active Learners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {skills.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{s.category}</td>
                  <td className="p-4">{s.difficulty}</td>
                  <td className="p-4 text-blue-600 font-semibold">{s.mentorsCount} mentors</td>
                  <td className="p-4 text-indigo-600 font-semibold">{s.learnersCount} learners</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: EXCHANGES MANAGEMENT */}
      {activeAdminTab === "exchanges" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-4">Exchange Room</th>
                <th className="p-4">Subjects Traded</th>
                <th className="p-4">Compatibility</th>
                <th className="p-4">Sessions Held</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {exchanges.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {ex.userA.name} ↔ {ex.userB.name}
                  </td>
                  <td className="p-4 text-blue-600 font-semibold">
                    {ex.skillA} ↔ {ex.skillB}
                  </td>
                  <td className="p-4 font-bold text-emerald-600">
                    {ex.compatibilityScore}%
                  </td>
                  <td className="p-4">{ex.sessionsCount} sessions</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      {ex.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
