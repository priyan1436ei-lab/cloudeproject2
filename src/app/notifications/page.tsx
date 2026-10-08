"use client";

import React from "react";
import Link from "next/link";
import { useExchange } from "@/context/ExchangeContext";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Repeat,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
  CheckCheck,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useExchange();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to view notifications</h2>
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case "exchange_request":
        return <Repeat className="w-4 h-4 text-blue-600" />;
      case "request_accepted":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "session_scheduled":
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case "resource_uploaded":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "review_received":
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>Cloud Push & Firestore Event Trigger</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500">
            Real-time alerts triggered by serverless Cloud Functions
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-3">
        {userNotifications.length > 0 ? (
          userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                notif.read
                  ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 opacity-80"
                  : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs shrink-0 mt-0.5">
                  {getIconForType(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {notif.link && (
                <Link
                  href={notif.link}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                >
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto opacity-50" />
            <p>You have no notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
