"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useExchange } from "@/context/ExchangeContext";
import {
  Cloud,
  Compass,
  Repeat,
  LayoutDashboard,
  ShieldAlert,
  Bell,
  BookOpen,
  User,
  Sparkles,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    currentUser,
    users,
    loginAsUser,
    logout,
    unreadNotificationsCount,
  } = useExchange();

  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/matches", label: "Matches & Requests", icon: Repeat },
    { href: "/skills", label: "Skill Catalog", icon: BookOpen },
    { href: "/admin", label: "Admin Portal", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  CloudSkill
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Cloud Native
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-1 font-medium tracking-wide">
                Peer Learning & Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Persona Switcher, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Switcher for Evaluation */}
          <div className="relative">
            <button
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="hidden lg:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs transition-all"
              title="Switch demo persona for testing skill exchanges"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Persona: <strong>{currentUser?.name?.split(" ")[0] || "Guest"}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Student (Viva Demo)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        loginAsUser(u.id);
                        setShowUserSwitcher(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors ${
                        currentUser?.id === u.id ? "bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.photoURL}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <div className="text-xs truncate font-medium">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Teaches: {u.skillsToTeach[0]?.skillName || "Tech"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Link */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* User Profile or Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white/70 dark:bg-slate-900 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <span className="text-xs font-medium pr-2 hidden sm:inline text-slate-800 dark:text-slate-200">
                  {currentUser.name.split(" ")[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                      <span>⭐ {currentUser.reputationScore} / 5.0</span>
                      <span className="text-slate-400">• {currentUser.college}</span>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    My Student Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                    Student Dashboard
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around overflow-x-auto text-xs bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
