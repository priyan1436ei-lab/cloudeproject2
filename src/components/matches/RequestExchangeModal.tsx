"use client";

import React, { useState } from "react";
import { StudentProfile } from "@/types";
import { useExchange } from "@/context/ExchangeContext";
import { X, Send, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface RequestExchangeModalProps {
  targetStudent: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestExchangeModal({
  targetStudent,
  isOpen,
  onClose,
  onSuccess,
}: RequestExchangeModalProps) {
  const { currentUser, sendExchangeRequest } = useExchange();

  const [teachSkill, setTeachSkill] = useState(
    currentUser?.skillsToTeach[0]?.skillName || "Figma"
  );
  const [learnSkill, setLearnSkill] = useState(
    targetStudent.skillsToTeach[0]?.skillName || "Python"
  );
  const [message, setMessage] = useState(
    `Hi ${targetStudent.name.split(" ")[0]}, I would love to exchange skills! I can teach you ${
      currentUser?.skillsToTeach[0]?.skillName || "design"
    } and learn ${targetStudent.skillsToTeach[0]?.skillName || "programming"} from you.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setStatusMessage({ type: "error", text: "Please log in to send a request." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await sendExchangeRequest(targetStudent.id, teachSkill, learnSkill, message);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: "Exchange request sent successfully! 🎉" });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1400);
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to send request." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Propose Skill Exchange
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peer learning with {targetStudent.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Peer Target Banner */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={targetStudent.photoURL}
              alt={targetStudent.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div className="text-xs">
              <div className="font-semibold text-slate-900 dark:text-white">
                {targetStudent.name}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                {targetStudent.college} • {targetStudent.department}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Reputation: ⭐ {targetStudent.reputationScore} / 5.0
              </div>
            </div>
          </div>

          {/* Skill Selections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                You Teach:
              </label>
              <select
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentUser?.skillsToTeach.map((s) => (
                  <option key={s.skillName} value={s.skillName}>
                    {s.skillName} ({s.level})
                  </option>
                )) || <option value="Figma">Figma</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                You Want to Learn:
              </label>
              <select
                value={learnSkill}
                onChange={(e) => setLearnSkill(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {targetStudent.skillsToTeach.map((s) => (
                  <option key={s.skillName} value={s.skillName}>
                    {s.skillName} ({s.level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Personal Note / Learning Pitch:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain how you can help each other and your preferred learning hours..."
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Sending..." : "Send Exchange Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
