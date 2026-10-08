"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useExchange } from "@/context/ExchangeContext";
import { RatingStars } from "@/components/ui/RatingStars";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { RequestExchangeModal } from "@/components/matches/RequestExchangeModal";
import { SkillLevel, SkillCategory } from "@/types";
import {
  User,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Sparkles,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  Edit3,
} from "lucide-react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const requestedUserId = searchParams.get("id");

  const {
    currentUser,
    users,
    reviews,
    updateUserProfile,
    addSkillToTeach,
    addSkillToLearn,
    removeSkill,
  } = useExchange();

  // Determine active profile being viewed
  const profileUser = requestedUserId
    ? users.find((u) => u.id === requestedUserId) || currentUser
    : currentUser;

  const isSelf = currentUser?.id === profileUser?.id;

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profileUser?.bio || "");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Add skill inputs
  const [showAddTeachSkill, setShowAddTeachSkill] = useState(false);
  const [newTeachName, setNewTeachName] = useState("");
  const [newTeachLevel, setNewTeachLevel] = useState<SkillLevel>("Advanced");

  const [showAddLearnSkill, setShowAddLearnSkill] = useState(false);
  const [newLearnName, setNewLearnName] = useState("");
  const [newLearnLevel, setNewLearnLevel] = useState<SkillLevel>("Beginner");

  if (!profileUser) {
    return <div className="p-8 text-center text-xs">Profile not found.</div>;
  }

  // Reviews for this user
  const userReviews = reviews.filter((r) => r.toUserId === profileUser.id);

  const handleSaveBio = () => {
    updateUserProfile({ bio: bioText });
    setIsEditingBio(false);
  };

  const handleAddTeach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeachName.trim()) return;
    addSkillToTeach({
      skillId: `skill-${Date.now()}`,
      skillName: newTeachName.trim(),
      category: "Programming",
      level: newTeachLevel,
      type: "teach",
    });
    setNewTeachName("");
    setShowAddTeachSkill(false);
  };

  const handleAddLearn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnName.trim()) return;
    addSkillToLearn({
      skillId: `skill-${Date.now()}`,
      skillName: newLearnName.trim(),
      category: "Programming",
      level: newLearnLevel,
      type: "learn",
    });
    setNewLearnName("");
    setShowAddLearnSkill(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileUser.photoURL}
              alt={profileUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {profileUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                  {profileUser.year}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>
                  {profileUser.department} • {profileUser.college}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileUser.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileUser.availability}</span>
                </div>
                <div className="flex items-center gap-1">
                  <RatingStars rating={profileUser.reputationScore} showValue size={14} />
                  <span className="text-[11px] text-slate-400">
                    ({profileUser.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Propose Exchange
            </button>
          )}
        </div>

        {/* Reputation Badges (Section 15) */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">
            Badges:
          </span>
          {profileUser.badges?.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Bio & Details */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            About & Mentorship Philosophy
          </h3>
          {isSelf && (
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingBio ? "Cancel" : "Edit Bio"}
            </button>
          )}
        </div>

        {isEditingBio ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <button
              onClick={handleSaveBio}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Save Bio
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {profileUser.bio}
          </p>
        )}
      </div>

      {/* SKILLS MANAGEMENT: CAN TEACH VS WANTS TO LEARN (Section 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills I Can Teach */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Skills I Can Teach
              </h3>
              <p className="text-[11px] text-slate-400">Available to mentor fellow students</p>
            </div>
            {isSelf && (
              <button
                onClick={() => setShowAddTeachSkill(!showAddTeachSkill)}
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-100"
                title="Add Teaching Skill"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {showAddTeachSkill && (
            <form onSubmit={handleAddTeach} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Skill name (e.g. Docker, TypeScript)"
                value={newTeachName}
                onChange={(e) => setNewTeachName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                required
              />
              <div className="flex gap-2">
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value as SkillLevel)}
                  className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-1"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {profileUser.skillsToTeach.map((s) => (
              <SkillBadge
                key={s.skillName}
                name={s.skillName}
                level={s.level}
                type="teach"
                onRemove={isSelf ? () => removeSkill(s.skillName, "teach") : undefined}
              />
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Skills I Want to Learn
              </h3>
              <p className="text-[11px] text-slate-400">Looking for student peers to tutor me</p>
            </div>
            {isSelf && (
              <button
                onClick={() => setShowAddLearnSkill(!showAddLearnSkill)}
                className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 hover:bg-indigo-100"
                title="Add Learning Wishlist Skill"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {showAddLearnSkill && (
            <form onSubmit={handleAddLearn} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <input
                type="text"
                placeholder="Skill wishlist (e.g. Machine Learning, Next.js)"
                value={newLearnName}
                onChange={(e) => setNewLearnName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                required
              />
              <div className="flex gap-2">
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value as SkillLevel)}
                  className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-1"
                >
                  <option value="Beginner">Beginner Goal</option>
                  <option value="Intermediate">Intermediate Goal</option>
                  <option value="Advanced">Advanced Goal</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {profileUser.skillsToLearn.map((s) => (
              <SkillBadge
                key={s.skillName}
                name={s.skillName}
                level={s.level}
                type="learn"
                onRemove={isSelf ? () => removeSkill(s.skillName, "learn") : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Received */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Verified Peer Reviews ({userReviews.length})
        </h3>

        {userReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {rev.fromUserName}
                  </span>
                  <RatingStars rating={rev.overallExperience} size={13} showValue />
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  &quot;{rev.comment}&quot;
                </p>
                <div className="text-[10px] text-slate-400">{rev.createdAt}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-4 text-center">
            No public reviews posted yet.
          </div>
        )}
      </div>

      {/* Propose Exchange Modal */}
      {showRequestModal && (
        <RequestExchangeModal
          targetStudent={profileUser}
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
