"use client";

import React, { useState } from "react";
import { Exchange } from "@/types";
import { useExchange } from "@/context/ExchangeContext";
import { RatingStars } from "@/components/ui/RatingStars";
import { X, Award, CheckCircle2 } from "lucide-react";

interface WriteReviewModalProps {
  exchange: Exchange;
  isOpen: boolean;
  onClose: () => void;
}

export function WriteReviewModal({
  exchange,
  isOpen,
  onClose,
}: WriteReviewModalProps) {
  const { currentUser, submitReview } = useExchange();

  const isUserA = currentUser?.id === exchange.userA.id;
  const peerUser = isUserA ? exchange.userB : exchange.userA;

  const [teachingQuality, setTeachingQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [knowledge, setKnowledge] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [overallExperience, setOverallExperience] = useState(5);
  const [comment, setComment] = useState(
    "Extremely helpful peer tutor! Explained challenging concepts clearly with practical code examples."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await submitReview({
      exchangeId: exchange.id,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserPhoto: currentUser.photoURL,
      toUserId: peerUser.id,
      teachingQuality,
      communication,
      knowledge,
      punctuality,
      overallExperience,
      comment,
    });

    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Rate & Review Peer Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating {peerUser.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Review submitted! {peerUser.name}&apos;s reputation updated on campus.</span>
            </div>
          )}

          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Overall Experience
              </span>
              <RatingStars
                rating={overallExperience}
                onRate={setOverallExperience}
                interactive
                size={18}
                showValue
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Teaching Quality
              </span>
              <RatingStars
                rating={teachingQuality}
                onRate={setTeachingQuality}
                interactive
                size={16}
                showValue
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Communication
              </span>
              <RatingStars
                rating={communication}
                onRate={setCommunication}
                interactive
                size={16}
                showValue
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Knowledge
              </span>
              <RatingStars
                rating={knowledge}
                onRate={setKnowledge}
                interactive
                size={16}
                showValue
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Punctuality
              </span>
              <RatingStars
                rating={punctuality}
                onRate={setPunctuality}
                interactive
                size={16}
                showValue
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback / Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
              required
            />
          </div>

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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              <Award className="w-3.5 h-3.5" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
