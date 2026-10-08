"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentProfile } from "@/types";
import { useExchange } from "@/context/ExchangeContext";
import { calculateMatchScore } from "@/lib/matching/engine";
import { RatingStars } from "@/components/ui/RatingStars";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { RequestExchangeModal } from "@/components/matches/RequestExchangeModal";
import {
  MapPin,
  Clock,
  Sparkles,
  ArrowRightLeft,
  CheckCircle,
} from "lucide-react";

interface StudentCardProps {
  student: StudentProfile;
}

export function StudentCard({ student }: StudentCardProps) {
  const { currentUser } = useExchange();
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Calculate dynamic compatibility score against currently active student
  const compatibility = currentUser
    ? calculateMatchScore(currentUser, student)
    : { score: 85, teachingSkillMatch: 35, learningSkillMatch: 25 };

  const isSelf = currentUser?.id === student.id;

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-900/60 transition-all flex flex-col justify-between">
        {/* Top Header: Avatar, Name, College, Compatibility Badge */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={student.photoURL}
                  alt={student.name}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {student.name}
                  {student.reputationScore >= 4.8 && (
                    <span title="Top Rated Peer Mentor">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50 dark:fill-blue-950" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {student.college}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={student.reputationScore} size={12} showValue />
                  <span className="text-[11px] text-slate-400">
                    ({student.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Compatibility % Pill */}
            {!isSelf && (
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/60 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{compatibility.score}%</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Match
                </div>
              </div>
            )}
          </div>

          {/* Student Bio */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {student.bio}
          </p>

          {/* Skills They Teach */}
          <div className="mb-3">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Can Teach:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skillsToTeach.map((s) => (
                <SkillBadge
                  key={s.skillName}
                  name={s.skillName}
                  level={s.level}
                  type="teach"
                />
              ))}
            </div>
          </div>

          {/* Skills They Want to Learn */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Wants to Learn:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skillsToLearn.map((s) => (
                <SkillBadge
                  key={s.skillName}
                  name={s.skillName}
                  level={s.level}
                  type="learn"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Availability, Location, Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{student.availability}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{student.location.split(",")[0]}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/profile?id=${student.id}`}
              className="w-full py-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              View Profile
            </Link>

            {isSelf ? (
              <span className="w-full py-2 text-center text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                Your Profile
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 group-hover:scale-[1.01] transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Exchange
              </button>
            )}
          </div>
        </div>
      </div>

      {showRequestModal && (
        <RequestExchangeModal
          targetStudent={student}
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </>
  );
}
