"use client";

import React from "react";
import Link from "next/link";
import { useExchange } from "@/context/ExchangeContext";
import { calculateMatchScore } from "@/lib/matching/engine";
import { RatingStars } from "@/components/ui/RatingStars";
import { SkillBadge } from "@/components/ui/SkillBadge";
import {
  Sparkles,
  Repeat,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Video,
  Clock,
  BookOpen,
  Award,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, users, exchanges, sessions, notifications } = useExchange();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to access your dashboard</h2>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Active exchanges for currentUser
  const myExchanges = exchanges.filter(
    (e) => e.userA.id === currentUser.id || e.userB.id === currentUser.id
  );

  // Upcoming sessions for currentUser
  const mySessions = sessions
    .filter(
      (s) =>
        (s.mentorId === currentUser.id || s.learnerId === currentUser.id) &&
        s.status === "upcoming"
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Top 3 Recommended Matches
  const recommendedMatches = users
    .filter((u) => u.id !== currentUser.id)
    .map((student) => ({
      student,
      match: calculateMatchScore(currentUser, student),
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-3xl shadow-xl shadow-blue-500/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-medium backdrop-blur-xs">
              Student Dashboard
            </span>
            <span className="text-xs text-blue-100">• {currentUser.college}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good day, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Here is your active skill exchange overview, upcoming scheduled peer sessions, and campus matches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/discover"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 shadow-md transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Discover Peers
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            Edit Skills
          </Link>
        </div>
      </div>

      {/* OVERVIEW STATS CARDS (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Skills I Teach
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.skillsToTeach.length}
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
            Active Mentor
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Skills I Learn
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.skillsToLearn.length}
          </div>
          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
            Active Learner
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Active Exchanges
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {myExchanges.length}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Private Rooms
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Sessions Done
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currentUser.sessionsCompleted || 18}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            Reputation
          </div>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
            <span>{currentUser.reputationScore}</span>
            <span className="text-sm">⭐</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {currentUser.reviewCount} Reviews
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Recommended Matches & Learning Progress */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: RECOMMENDED MATCHES (TOP 3 COMPATIBLE STUDENTS) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Recommended Matches
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest compatibility based on your skills & learning goals
                  </p>
                </div>
              </div>
              <Link
                href="/discover"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedMatches.map(({ student, match }) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between hover:border-blue-400 transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={student.photoURL}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                      />
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                        {match.score}% Match
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {student.college}
                    </p>

                    <div className="mt-2 text-[11px]">
                      <span className="text-slate-400 block font-medium">Teaches:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 truncate block">
                        {student.skillsToTeach[0]?.skillName || "Tech"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/profile?id=${student.id}`}
                    className="w-full py-1.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-2xs"
                  >
                    View & Connect
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: LEARNING PROGRESS (Section 13) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Learning Progress & Milestones
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Syllabus progress for your active skill exchanges
                  </p>
                </div>
              </div>
              <Link
                href="/matches"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All Exchanges <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {myExchanges.map((ex) => {
                const isUserA = ex.userA.id === currentUser.id;
                const myLearningSkill = isUserA ? ex.skillB : ex.skillA;
                const peerUser = isUserA ? ex.userB : ex.userA;
                const progressPct = isUserA ? ex.progressA : ex.progressB;

                return (
                  <div
                    key={ex.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Repeat className="w-4 h-4 text-blue-600" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {myLearningSkill} Mastery
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Peer Tutor: {peerUser.name} ({peerUser.college})
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/exchange/${ex.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Enter Room →
                      </Link>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>Sessions: {ex.sessionsCount} Completed</span>
                      <span>Compatibility: {ex.compatibilityScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Sessions & Recent Activity */}
        <div className="lg:col-span-4 space-y-8">
          {/* UPCOMING SESSIONS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upcoming Sessions
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold">
                {mySessions.length}
              </span>
            </div>

            <div className="space-y-3">
              {mySessions.length > 0 ? (
                mySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {session.title}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {session.date} • {session.time} ({session.durationMinutes}m)
                        </span>
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        Mentor: {session.mentorName}
                      </div>
                    </div>

                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Google Meet
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No upcoming sessions. Schedule one in an Exchange Room!
                </div>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY & NOTIFICATIONS (Section 18) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                href="/notifications"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
