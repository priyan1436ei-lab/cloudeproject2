"use client";

import React, { useState, useMemo } from "react";
import { useExchange } from "@/context/ExchangeContext";
import { StudentCard } from "@/components/matches/StudentCard";
import { SkillCategory, SkillLevel } from "@/types";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Compass,
  Users,
} from "lucide-react";

export default function DiscoverPage() {
  const { users } = useExchange();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCollege, setSelectedCollege] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Extract unique colleges
  const colleges = useMemo(() => {
    const list = Array.from(new Set(users.map((u) => u.college)));
    return list;
  }, [users]);

  // Categories list
  const categories: SkillCategory[] = [
    "Programming",
    "AI / ML",
    "UI / UX",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "Mobile Development",
    "Web Development",
    "DevOps",
    "Video Editing",
    "Finance",
  ];

  // Filter students
  const filteredStudents = useMemo(() => {
    return users.filter((student) => {
      // 1. Search Query (name, college, department, teach skills, learn skills)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesCollege = student.college.toLowerCase().includes(query);
        const matchesDept = student.department.toLowerCase().includes(query);
        const matchesTeach = student.skillsToTeach.some((s) =>
          s.skillName.toLowerCase().includes(query)
        );
        const matchesLearn = student.skillsToLearn.some((s) =>
          s.skillName.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesCollege && !matchesDept && !matchesTeach && !matchesLearn) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "all") {
        const matchesCategory = student.skillsToTeach.some(
          (s) => s.category === selectedCategory
        );
        if (!matchesCategory) return false;
      }

      // 3. Skill Level Filter
      if (selectedLevel !== "all") {
        const matchesLevel = student.skillsToTeach.some(
          (s) => s.level === selectedLevel
        );
        if (!matchesLevel) return false;
      }

      // 4. College Filter
      if (selectedCollege !== "all" && student.college !== selectedCollege) {
        return false;
      }

      // 5. Min Rating Filter
      if (student.reputationScore < minRating) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedCategory, selectedLevel, selectedCollege, minRating]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedCollege("all");
    setMinRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Peer Student Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Discover Skill Partners
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Search for students across campuses who can teach the exact skills you want to learn, or find learners for your expertise.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, skill (e.g. Python, Figma), or college..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="sm:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Row */}
        <div className={`grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 ${showFiltersMobile ? "block" : "hidden sm:grid"}`}>
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Skill Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* College */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Campus / College
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Campuses</option>
              {colleges.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>⭐ 4.5+ Stars</option>
              <option value={4.8}>⭐ 4.8+ Stars (Top Rated)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all" || selectedCollege !== "all" || minRating > 0) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500">
              Showing <strong>{filteredStudents.length}</strong> matching students
            </span>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* STUDENTS DIRECTORY GRID */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No students found matching your filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or relaxing category and level filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
