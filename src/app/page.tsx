"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useExchange } from "@/context/ExchangeContext";
import { getSkillRecommendations, AIRecommendationResult } from "@/lib/ai/recommendation";
import {
  Sparkles,
  ArrowRight,
  Repeat,
  Calendar,
  Award,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Cloud,
  CheckCircle2,
  Users,
  Search,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { users, skills, exchanges, sessions } = useExchange();

  // AI Recommendation State
  const [aiGoal, setAiGoal] = useState("I want to become a full-stack developer");
  const [aiResult, setAiResult] = useState<AIRecommendationResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGoal.trim()) return;
    setIsAiLoading(true);
    const result = await getSkillRecommendations(aiGoal, users);
    setAiResult(result);
    setIsAiLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cloud Project Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <Cloud className="w-3.5 h-3.5 text-blue-200" />
        <span>
          B.Tech Cloud Computing Mini Project: Powered by Firebase Auth, Cloud Firestore, Cloud Storage & Serverless Functions
        </span>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-radial from-blue-50/50 via-slate-50 to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Smart Skill Exchange for Students</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Learn. Teach. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  Exchange. Grow.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Turn your skills into knowledge and learn from students around you.
                Exchange skills peer-to-peer without paid tutoring or expensive bootcamps.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/discover"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  Find a Skill Partner
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/skills"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all text-center flex items-center justify-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore Skills Catalog
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Campus Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Currency • 100% Peer Exchange</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time Compatibility Matcher</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual - Priyan <-> Arun Exchange Interactive Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 shadow-2xl border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl">
                {/* Glow backdrop */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />

                <div className="relative space-y-5">
                  {/* Match Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Perfect Skill Match 🎯
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800">
                      96% Match
                    </span>
                  </div>

                  {/* Student A (Priyan) */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                        alt="Priyan"
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Priyan Sharma
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          3rd Year CSE
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Teaches
                      </div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                        Figma (Expert)
                      </div>
                    </div>
                  </div>

                  {/* Bi-directional Exchange Symbol */}
                  <div className="flex items-center justify-center -my-2 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-slate-900 animate-bounce duration-1000">
                      <Repeat className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Student B (Arun) */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"
                        alt="Arun"
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Arun Kumar
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          3rd Year CSE
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Teaches
                      </div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                        Python (Expert)
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Exchange Pill Card */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl border border-blue-200/70 dark:border-blue-900/60 text-center">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                      Knowledge Exchange Active
                    </p>
                    <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                      Figma ↔ Python • 8 Sessions Completed
                    </p>
                  </div>

                  <Link
                    href="/exchange/exchange-priyan-arun"
                    className="w-full block py-2.5 text-center text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-xl transition-all shadow-sm"
                  >
                    Enter Live Exchange Room →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 py-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                {users.length * 150}+
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Students
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {skills.length}+
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Skills Cataloged
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-violet-600 dark:text-violet-400">
                {exchanges.length * 85}+
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Skill Exchanges
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {sessions.length * 240}+
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sessions Completed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI RECOMMENDATION SPOTLIGHT (Section 17) */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-800/50">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Zap className="w-4 h-4 text-amber-400" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  AI-Powered Learning Advisor
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  What do you want to become or learn?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Our Cloud AI engine breaks down your goal into required technical skills and pairs you with student mentors on campus.
                </p>
              </div>

              <form onSubmit={handleAskAi} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  placeholder="e.g. I want to become a full-stack developer, cloud architect, ML researcher..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAiLoading ? "Analyzing..." : "Generate Roadmap"}
                </button>
              </form>

              {aiResult && (
                <div className="p-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md space-y-4 animate-in fade-in">
                  <div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Recommended Skill Path:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {aiResult.recommendedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 border border-blue-400/30 text-blue-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiResult.explanation}
                  </p>

                  <div>
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                      Compatible Campus Mentors:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {aiResult.matchedMentors.map(({ student, canTeachSkills }) => (
                        <Link
                          key={student.id}
                          href={`/discover?search=${student.name}`}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={student.photoURL}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="truncate">
                            <div className="font-semibold text-white truncate">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              Teaches: {canTeachSkills.join(", ")}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES (Section 3 & 2) */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Platform Modules
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered for Modern Peer Learning
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Everything needed to discover, match, schedule, and track peer skills in a cloud-native workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Smart Skill Matching
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                5-Factor algorithm measuring teaching skill complement (40%), learning overlap (30%), schedule availability (15%), and expertise level (10%).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Peer Learning
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect directly with students in your university or across partner colleges. Zero tutoring fees; exchange knowledge organically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Repeat className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Exchange Workspace Room
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A collaborative workspace per exchange with live chat, shared resource files, scheduled calendar sessions, and progress trackers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Session Scheduling
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated calendar appointments with Google Meet links, reminder notifications, agenda tracking, and duration logs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Reputation & Badges
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                5-Factor review matrix evaluating teaching quality, communication, knowledge, and punctuality. Earn verified badges like Top Mentor.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-900 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Learning Progress
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visual progress bars for both student participants tracking curriculum goals, practice exercises, and milestone completions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Section 3) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Simple 5-Step Flow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How CloudSkill Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: "01",
                title: "Create Profile",
                desc: "Sign up with university email, set your college and availability.",
              },
              {
                step: "02",
                title: "Add Skills",
                desc: "List skills you can teach and skills you want to learn.",
              },
              {
                step: "03",
                title: "Find Matches",
                desc: "Discover students with high mutual compatibility scores.",
              },
              {
                step: "04",
                title: "Exchange Knowledge",
                desc: "Schedule video sessions, share resources, and code together.",
              },
              {
                step: "05",
                title: "Track & Rate",
                desc: "Advance syllabus progress bars and earn reputation badges.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 relative"
              >
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {item.step}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOUD COMPUTING ARCHITECTURE HIGHLIGHTS */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 shadow-2xl space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Cloud Computing Mini Project
              </span>
              <h3 className="text-3xl font-bold tracking-tight">
                Built on Real Cloud Architecture Principles
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Demonstrating key cloud engineering paradigms required for production modern applications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h5 className="text-sm font-bold">Cloud Authentication</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Firebase Auth & Google OAuth token verification, role-based access control.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <Cloud className="w-6 h-6 text-blue-400" />
                <h5 className="text-sm font-bold">Cloud Firestore Database</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  NoSQL document collections for users, exchanges, sessions, and notifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <Zap className="w-6 h-6 text-amber-400" />
                <h5 className="text-sm font-bold">Serverless Functions</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated compatibility scoring triggers, session reminders, and reputation updates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h5 className="text-sm font-bold">Cloud Object Storage</h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Secure buckets with strict security rules for exchange PDFs, kits, and avatars.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Start Your Skill Exchange?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join Priyan, Arun, and hundreds of students trading knowledge today on CloudSkill Exchange.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/discover"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/25 transition-all text-sm"
            >
              Start Your Skill Exchange
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 dark:text-white">CloudSkill Exchange</span>
            <span>— Peer Learning & Skill Exchange</span>
          </div>
          <div>
            B.Tech Cloud Computing Mini Project • Next.js & Firebase Cloud Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
