import React from "react";
import { SkillLevel } from "@/types";

interface SkillBadgeProps {
  name: string;
  level?: SkillLevel;
  type?: "teach" | "learn";
  onRemove?: () => void;
  className?: string;
}

const levelColorMap: Record<SkillLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  Expert: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
};

export function SkillBadge({
  name,
  level,
  type,
  onRemove,
  className = "",
}: SkillBadgeProps) {
  const badgeStyle = level
    ? levelColorMap[level]
    : type === "teach"
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
    : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeStyle} ${className}`}
    >
      <span>{name}</span>
      {level && (
        <span className="text-[10px] opacity-75 font-normal">
          • {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:opacity-100 opacity-60 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  );
}
