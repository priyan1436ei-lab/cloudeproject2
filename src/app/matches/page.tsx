"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useExchange } from "@/context/ExchangeContext";
import { calculateMatchScore } from "@/lib/matching/engine";
import { StudentCard } from "@/components/matches/StudentCard";
import {
  Repeat,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Send,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function MatchesPage() {
  const {
    currentUser,
    users,
    exchanges,
    requests,
    acceptExchangeRequest,
    rejectExchangeRequest,
  } = useExchange();

  const [activeTab, setActiveTab] = useState<"active" | "requests" | "recommended" | "completed">("active");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view your matches</h2>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // 1. Active Exchanges for currentUser
  const myActiveExchanges = exchanges.filter(
    (e) => (e.userA.id === currentUser.id || e.userB.id === currentUser.id) && e.status === "active"
  );

  // 2. Pending requests involving currentUser
  const incomingRequests = requests.filter(
    (r) => r.toUserId === currentUser.id && r.status === "pending"
  );
  const outgoingRequests = requests.filter(
    (r) => r.fromUserId === currentUser.id && r.status === "pending"
  );

  // 3. Recommended matches
  const recommendedMatches = users
    .filter((u) => u.id !== currentUser.id)
    .map((student) => ({
      student,
      match: calculateMatchScore(currentUser, student),
    }))
    .sort((a, b) => b.match.score - a.match.score);

  // 4. Completed Exchanges
  const completedExchanges = exchanges.filter(
    (e) => (e.userA.id === currentUser.id || e.userB.id === currentUser.id) && e.status === "completed"
  );

  const handleAccept = async (requestId: string) => {
    const exchangeId = await acceptExchangeRequest(requestId);
    if (exchangeId) {
      setActionMessage("Exchange accepted! Workspace room created.");
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleReject = async (requestId: string) => {
    await rejectExchangeRequest(requestId);
    setActionMessage("Request declined.");
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Repeat className="w-3.5 h-3.5" />
          <span>Peer Matches & Exchange Requests</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Skill Exchanges & Match Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your active private exchange rooms, respond to student proposals, and explore high-compatibility peers.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* TABS HEADER */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Repeat className="w-4 h-4" />
          Active Exchanges ({myActiveExchanges.length})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "requests"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Send className="w-4 h-4" />
          Pending Requests ({incomingRequests.length + outgoingRequests.length})
          {incomingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("recommended")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "recommended"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Recommended ({recommendedMatches.length})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "completed"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Completed ({completedExchanges.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE EXCHANGES */}
      {activeTab === "active" && (
        <div className="space-y-6">
          {myActiveExchanges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myActiveExchanges.map((ex) => {
                const isUserA = ex.userA.id === currentUser.id;
                const peerUser = isUserA ? ex.userB : ex.userA;
                const teachSkill = isUserA ? ex.skillA : ex.skillB;
                const learnSkill = isUserA ? ex.skillB : ex.skillA;
                const myProgress = isUserA ? ex.progressA : ex.progressB;

                return (
                  <div
                    key={ex.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-5"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          Status: Active Exchange
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-extrabold border border-blue-200 dark:border-blue-800">
                        🎯 {ex.compatibilityScore}% Match
                      </span>
                    </div>

                    {/* Peer Connection Visual */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      <div className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.name}
                          className="w-12 h-12 rounded-xl object-cover mx-auto ring-2 ring-blue-500/20"
                        />
                        <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">
                          You
                        </div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                          Teach: {teachSkill}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                          <Repeat className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ex.sessionsCount} Sessions
                        </span>
                      </div>

                      <div className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={peerUser.photoURL}
                          alt={peerUser.name}
                          className="w-12 h-12 rounded-xl object-cover mx-auto ring-2 ring-indigo-500/20"
                        />
                        <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">
                          {peerUser.name.split(" ")[0]}
                        </div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          Teach: {learnSkill}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Your Learning in {learnSkill}</span>
                        <span className="text-blue-600 font-bold">{myProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${myProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/exchange/${ex.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                    >
                      <span>Open Exchange Room</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <Repeat className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No active exchanges yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Explore recommended matches and propose a skill exchange with fellow students!
              </p>
              <button
                onClick={() => setActiveTab("recommended")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Browse Recommended Matches
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENDING REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-8">
          {/* Incoming Requests */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Incoming Exchange Proposals ({incomingRequests.length})
            </h3>

            {incomingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={req.fromUserPhoto}
                          alt={req.fromUserName}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {req.fromUserName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {req.fromUserCollege}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        {req.compatibilityScore}% Match
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs space-y-1">
                      <div>
                        <span className="text-slate-400 font-medium">They Offer to Teach: </span>
                        <strong className="text-blue-600 dark:text-blue-400">{req.teachSkill}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">They Want to Learn: </span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{req.learnSkill}</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-blue-50/50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                      &quot;{req.message}&quot;
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
                      >
                        Accept & Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No incoming proposals right now.
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Outgoing Requests Sent by You ({outgoingRequests.length})
            </h3>

            {outgoingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 opacity-90"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={req.toUserPhoto}
                          alt={req.toUserName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Sent to {req.toUserName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {req.toUserCollege}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                        Pending
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Trading <strong>{req.teachSkill}</strong> for <strong>{req.learnSkill}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                You haven&apos;t sent any pending requests.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RECOMMENDED MATCHES */}
      {activeTab === "recommended" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedMatches.map(({ student }) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* TAB 4: COMPLETED EXCHANGES */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedExchanges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedExchanges.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Completed Exchange
                    </span>
                    <span className="text-xs text-slate-400">{ex.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ex.skillA} ↔ {ex.skillB}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Participants: {ex.userA.name} and {ex.userB.name} • {ex.sessionsCount} sessions
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No completed exchanges archived yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
