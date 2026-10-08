"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useExchange } from "@/context/ExchangeContext";
import { CreateSessionModal } from "@/components/exchange/CreateSessionModal";
import { UploadResourceModal } from "@/components/exchange/UploadResourceModal";
import { WriteReviewModal } from "@/components/exchange/WriteReviewModal";
import { RatingStars } from "@/components/ui/RatingStars";
import {
  Repeat,
  Calendar,
  FileText,
  TrendingUp,
  MessageSquare,
  Award,
  Video,
  Plus,
  Trash2,
  Send,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    exchangeId: string;
  }>;
}

export default function ExchangeRoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { exchangeId } = resolvedParams;

  const {
    currentUser,
    exchanges,
    sessions,
    resources,
    reviews,
    completeSession,
    deleteResource,
  } = useExchange();

  const [activeTab, setActiveTab] = useState<
    "overview" | "sessions" | "resources" | "progress" | "chat" | "reviews"
  >("overview");

  // Modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Chat local state
  const [chatMessages, setChatMessages] = useState<
    { id: string; senderId: string; senderName: string; text: string; time: string }[]
  >([
    {
      id: "m-1",
      senderId: "user-arun",
      senderName: "Arun Kumar",
      text: "Hey Priyan! Excited to start our exchange. I prepared the FastAPI and async Python notes for our first session.",
      time: "Yesterday, 4:15 PM",
    },
    {
      id: "m-2",
      senderId: "user-priyan",
      senderName: "Priyan Sharma",
      text: "Awesome Arun! I have the Figma design system kit ready as well. Let's do our first session this weekend!",
      time: "Yesterday, 5:30 PM",
    },
  ]);
  const [newMsgText, setNewMsgText] = useState("");

  const exchange = exchanges.find((e) => e.id === exchangeId);

  if (!exchange) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Exchange room not found</h2>
        <Link
          href="/matches"
          className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to Matches
        </Link>
      </div>
    );
  }

  const isUserA = currentUser?.id === exchange.userA.id;
  const peerUser = isUserA ? exchange.userB : exchange.userA;
  const myTeachingSkill = isUserA ? exchange.skillA : exchange.skillB;
  const myLearningSkill = isUserA ? exchange.skillB : exchange.skillA;
  const myProgress = isUserA ? exchange.progressA : exchange.progressB;
  const peerProgress = isUserA ? exchange.progressB : exchange.progressA;

  // Filter exchange-specific data
  const exchangeSessions = sessions.filter((s) => s.exchangeId === exchange.id);
  const exchangeResources = resources.filter((r) => r.exchangeId === exchange.id);
  const exchangeReviews = reviews.filter((r) => r.exchangeId === exchange.id);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !currentUser) return;
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMsgText.trim(),
      time: "Just now",
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMsgText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Room header */}
      <div className="space-y-4">
        <Link
          href="/matches"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Matches
        </Link>

        {/* WORKSPACE ROOM BANNER (Section 11) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Private Exchange Room
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                  🎯 {exchange.compatibilityScore}% Compatibility
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {exchange.userA.name} ↔ {exchange.userB.name}
              </h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-1">
                {exchange.skillA} ↔ {exchange.skillB}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Session
              </button>
              <button
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6 WORKSPACE TABS (Section 11) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: Sparkles },
          { key: "sessions", label: `Sessions (${exchangeSessions.length})`, icon: Calendar },
          { key: "resources", label: `Resources (${exchangeResources.length})`, icon: FileText },
          { key: "progress", label: "Progress", icon: TrendingUp },
          { key: "chat", label: `Chat (${chatMessages.length})`, icon: MessageSquare },
          { key: "reviews", label: `Reviews (${exchangeReviews.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exchange Terms & Collaboration Agreement
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Both students have agreed to an equal, reciprocal exchange of expertise.
                No fees are exchanged. Students schedule 1-on-1 video sessions, share curriculum notes,
                and review each other upon completion of milestone goals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    What You Teach
                  </span>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {myTeachingSkill}
                  </div>
                  <p className="text-xs text-slate-500">
                    Mentoring {peerUser.name} on best practices & frameworks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    What You Learn
                  </span>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {myLearningSkill}
                  </div>
                  <p className="text-xs text-slate-500">
                    Learning directly from {peerUser.name}&apos;s practical experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Peer Partner
              </h3>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={peerUser.photoURL}
                  alt={peerUser.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {peerUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {peerUser.college}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {peerUser.department}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Room ID:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {exchange.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SESSIONS (Section 12) */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled Learning Sessions
            </h3>
            <button
              onClick={() => setShowSessionModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Session
            </button>
          </div>

          {exchangeSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exchangeSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                        Topic: {sess.skill}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sess.title}
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        sess.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                      }`}
                    >
                      {sess.status === "completed" ? "Completed" : "Upcoming"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {sess.description}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {sess.date} at {sess.time} ({sess.durationMinutes} minutes)
                      </span>
                    </div>
                    <div>Mentor: {sess.mentorName} • Learner: {sess.learnerName}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={sess.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Google Meet
                    </a>

                    {sess.status !== "completed" && (
                      <button
                        onClick={() => completeSession(sess.id)}
                        className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                No sessions scheduled yet
              </h3>
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Schedule Your First Session
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESOURCES (Section 14) */}
      {activeTab === "resources" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shared Cloud Resources
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded to Firebase Storage for this exchange
              </p>
            </div>
            <button
              onClick={() => setShowResourceModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload File
            </button>
          </div>

          {exchangeResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exchangeResources.map((res) => (
                <div
                  key={res.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                        {res.fileType.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">{res.fileSize}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white break-all">
                      {res.name}
                    </h4>

                    {res.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400">
                      Uploaded by {res.uploadedBy.name} on {res.createdAt}
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>

                      <button
                        onClick={() => deleteResource(res.id)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                No files shared yet
              </h3>
              <button
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Upload PDF / Kit
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROGRESS (Section 13) */}
      {activeTab === "progress" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Learning: {myLearningSkill}
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress Milestone</span>
                <span className="text-blue-600 font-bold">{myProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${myProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Milestone Checklist:
              </div>
              {[
                { label: "1. Core Syntax & Architecture Basics", done: myProgress >= 20 },
                { label: "2. Hands-on Interactive Practice Exercises", done: myProgress >= 40 },
                { label: "3. Real-world Project Mini-Build", done: myProgress >= 60 },
                { label: "4. Code Review & Performance Optimization", done: myProgress >= 80 },
                { label: "5. Production Readiness & Viva Demo", done: myProgress >= 100 },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      task.done ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                  <span className={task.done ? "line-through opacity-70" : ""}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {peerUser.name}&apos;s Learning: {myTeachingSkill}
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress Milestone</span>
                <span className="text-indigo-600 font-bold">{peerProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${peerProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              As you mark learning sessions as completed, the syllabus progress automatically increments on Firestore!
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: CHAT */}
      {activeTab === "chat" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Direct Peer Exchange Messages
            </span>
            <span className="text-[11px] text-slate-400">
              Real-time Firestore Socket
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => {
              const isMine = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5">
                    {msg.senderName} • {msg.time}
                  </span>
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              placeholder="Type message to your skill exchange partner..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: REVIEWS (Section 15) */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reviews & Reputation Feedback
              </h3>
              <p className="text-xs text-slate-500">
                5-Factor review ratings evaluating teaching quality and punctuality
              </p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              Write Review
            </button>
          </div>

          {exchangeReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exchangeReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      From: {rev.fromUserName}
                    </span>
                    <RatingStars rating={rev.overallExperience} showValue size={14} />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                    &quot;{rev.comment}&quot;
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div>Teaching: ⭐ {rev.teachingQuality}</div>
                    <div>Knowledge: ⭐ {rev.knowledge}</div>
                    <div>Communication: ⭐ {rev.communication}</div>
                    <div>Punctuality: ⭐ {rev.punctuality}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                No reviews submitted for this exchange yet
              </h3>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
              >
                Submit Review for Peer
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      {showSessionModal && (
        <CreateSessionModal
          exchange={exchange}
          isOpen={showSessionModal}
          onClose={() => setShowSessionModal(false)}
        />
      )}

      {showResourceModal && (
        <UploadResourceModal
          exchange={exchange}
          isOpen={showResourceModal}
          onClose={() => setShowResourceModal(false)}
        />
      )}

      {showReviewModal && (
        <WriteReviewModal
          exchange={exchange}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
