"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  StudentProfile,
  Skill,
  Exchange,
  ExchangeRequest,
  Session,
  ResourceItem,
  AppNotification,
  Review,
  UserSkill,
} from "@/types";
import {
  INITIAL_STUDENTS,
  INITIAL_SKILLS,
  INITIAL_EXCHANGES,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_RESOURCES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
} from "@/data/mockData";
import { calculateMatchScore } from "@/lib/matching/engine";

interface ExchangeContextType {
  currentUser: StudentProfile | null;
  users: StudentProfile[];
  skills: Skill[];
  exchanges: Exchange[];
  requests: ExchangeRequest[];
  sessions: Session[];
  resources: ResourceItem[];
  notifications: AppNotification[];
  reviews: Review[];
  unreadNotificationsCount: number;
  sendExchangeRequest: (
    toUserId: string,
    teachSkill: string,
    learnSkill: string,
    message: string
  ) => Promise<{ success: boolean; requestId?: string; error?: string }>;
  acceptExchangeRequest: (requestId: string) => Promise<string | null>;
  rejectExchangeRequest: (requestId: string) => Promise<boolean>;
  createSession: (
    exchangeId: string,
    session: Omit<Session, "id" | "createdAt" | "status">
  ) => Promise<Session>;
  completeSession: (sessionId: string) => Promise<void>;
  uploadResource: (
    exchangeId: string,
    resource: Omit<ResourceItem, "id" | "createdAt">
  ) => Promise<ResourceItem>;
  deleteResource: (resourceId: string) => Promise<void>;
  submitReview: (
    review: Omit<Review, "id" | "createdAt">
  ) => Promise<Review>;
  updateUserProfile: (data: Partial<StudentProfile>) => void;
  addSkillToTeach: (skill: UserSkill) => void;
  addSkillToLearn: (skill: UserSkill) => void;
  removeSkill: (skillName: string, type: "teach" | "learn") => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  loginAsUser: (userId: string) => void;
  logout: () => void;
  loginWithEmail: (email: string) => Promise<boolean>;
  registerUser: (data: Partial<StudentProfile>) => Promise<boolean>;
  addNewSkillToCatalog: (skill: Omit<Skill, "id" | "createdAt" | "learnersCount" | "mentorsCount">) => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = "cloudskill_v1_";

export function ExchangeProvider({ children }: { children: ReactNode }) {
  // 1. Initial State hydrated from localStorage if available, otherwise from mockData
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [users, setUsers] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [exchanges, setExchanges] = useState<Exchange[]>(INITIAL_EXCHANGES);
  const [requests, setRequests] = useState<ExchangeRequest[]>(INITIAL_REQUESTS);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Client-side initialization
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
      const storedExchanges = localStorage.getItem(`${STORAGE_KEY_PREFIX}exchanges`);
      const storedRequests = localStorage.getItem(`${STORAGE_KEY_PREFIX}requests`);
      const storedSessions = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
      const storedResources = localStorage.getItem(`${STORAGE_KEY_PREFIX}resources`);
      const storedNotifs = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifs`);
      const storedCurrentUserId = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUserId`);

      const loadedUsers = storedUsers ? JSON.parse(storedUsers) : INITIAL_STUDENTS;
      setUsers(loadedUsers);

      if (storedExchanges) setExchanges(JSON.parse(storedExchanges));
      if (storedRequests) setRequests(JSON.parse(storedRequests));
      if (storedSessions) setSessions(JSON.parse(storedSessions));
      if (storedResources) setResources(JSON.parse(storedResources));
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      // Default logged in user is Priyan Sharma for effortless testing
      const activeUser =
        loadedUsers.find((u: StudentProfile) => u.id === storedCurrentUserId) ||
        loadedUsers[0];
      setCurrentUser(activeUser);
    } catch (e) {
      console.warn("Storage hydration error, using in-memory state:", e);
      setCurrentUser(INITIAL_STUDENTS[0]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}exchanges`, JSON.stringify(exchanges));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}requests`, JSON.stringify(requests));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}resources`, JSON.stringify(resources));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notifs`, JSON.stringify(notifications));
      if (currentUser) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUserId`, currentUser.id);
      } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}currentUserId`);
      }
    } catch (err) {
      console.error("Local persistence error:", err);
    }
  }, [users, exchanges, requests, sessions, resources, notifications, currentUser, isHydrated]);

  const unreadNotificationsCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  ).length;

  // 1. Send Exchange Request
  const sendExchangeRequest = async (
    toUserId: string,
    teachSkill: string,
    learnSkill: string,
    message: string
  ) => {
    if (!currentUser) return { success: false, error: "Must be logged in" };

    const targetUser = users.find((u) => u.id === toUserId);
    if (!targetUser) return { success: false, error: "User not found" };

    // Check if duplicate request exists
    const existing = requests.find(
      (r) =>
        r.fromUserId === currentUser.id &&
        r.toUserId === toUserId &&
        r.status === "pending"
    );
    if (existing) {
      return { success: false, error: "A pending exchange request already exists with this student." };
    }

    const match = calculateMatchScore(currentUser, targetUser);

    const newRequest: ExchangeRequest = {
      id: `req-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserPhoto: currentUser.photoURL,
      fromUserCollege: currentUser.college,
      toUserId: targetUser.id,
      toUserName: targetUser.name,
      toUserPhoto: targetUser.photoURL,
      toUserCollege: targetUser.college,
      teachSkill,
      learnSkill,
      message,
      status: "pending",
      compatibilityScore: match.score,
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Send Cloud Notification to target student
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUser.id,
      title: "New Exchange Request 🎯",
      message: `${currentUser.name} proposed exchanging ${teachSkill} for ${learnSkill}!`,
      type: "exchange_request",
      link: "/matches",
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, requestId: newRequest.id };
  };

  // 2. Accept Request & Create Exchange Room
  const acceptExchangeRequest = async (requestId: string): Promise<string | null> => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;

    const userA = users.find((u) => u.id === req.fromUserId);
    const userB = users.find((u) => u.id === req.toUserId);
    if (!userA || !userB) return null;

    const exchangeId = `exchange-${req.fromUserId.replace("user-", "")}-${req.toUserId.replace("user-", "")}-${Date.now().toString().slice(-4)}`;

    const newExchange: Exchange = {
      id: exchangeId,
      requestId: req.id,
      userA: {
        id: userA.id,
        name: userA.name,
        photoURL: userA.photoURL,
        college: userA.college,
        department: userA.department,
      },
      userB: {
        id: userB.id,
        name: userB.name,
        photoURL: userB.photoURL,
        college: userB.college,
        department: userB.department,
      },
      skillA: req.teachSkill,
      skillB: req.learnSkill,
      compatibilityScore: req.compatibilityScore,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      progressA: 0,
      progressB: 0,
      sessionsCount: 0,
    };

    // Update request status
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "accepted" } : r))
    );

    // Add exchange room
    setExchanges((prev) => [newExchange, ...prev]);

    // Notify requester
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: req.fromUserId,
      title: "Exchange Request Accepted! 🎉",
      message: `${userB.name} accepted your exchange! Your private exchange room is now ready.`,
      type: "request_accepted",
      link: `/exchange/${exchangeId}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return exchangeId;
  };

  // 3. Reject Request
  const rejectExchangeRequest = async (requestId: string): Promise<boolean> => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
    );
    return true;
  };

  // 4. Create Learning Session
  const createSession = async (
    exchangeId: string,
    sessionData: Omit<Session, "id" | "createdAt" | "status">
  ): Promise<Session> => {
    const newSession: Session = {
      ...sessionData,
      id: `session-${Date.now()}`,
      exchangeId,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);

    // Update exchange session count
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === exchangeId
          ? {
              ...ex,
              sessionsCount: ex.sessionsCount + 1,
              lastSessionDate: sessionData.date,
            }
          : ex
      )
    );

    // Notify learner
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: sessionData.learnerId,
      title: "New Session Scheduled 📅",
      message: `${sessionData.mentorName} scheduled "${sessionData.title}" for ${sessionData.date} at ${sessionData.time}`,
      type: "session_scheduled",
      link: `/exchange/${exchangeId}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return newSession;
  };

  // 5. Complete Session & Advance Progress
  const completeSession = async (sessionId: string) => {
    const sess = sessions.find((s) => s.id === sessionId);
    if (!sess) return;

    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "completed" } : s))
    );

    // Advance exchange progress
    setExchanges((prev) =>
      prev.map((ex) => {
        if (ex.id !== sess.exchangeId) return ex;
        const isUserALearning = sess.learnerId === ex.userA.id;
        return {
          ...ex,
          progressA: isUserALearning ? Math.min(100, ex.progressA + 20) : ex.progressA,
          progressB: !isUserALearning ? Math.min(100, ex.progressB + 20) : ex.progressB,
        };
      })
    );
  };

  // 6. Upload Resource
  const uploadResource = async (
    exchangeId: string,
    resData: Omit<ResourceItem, "id" | "createdAt">
  ): Promise<ResourceItem> => {
    const newRes: ResourceItem = {
      ...resData,
      id: `res-${Date.now()}`,
      exchangeId,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setResources((prev) => [newRes, ...prev]);
    return newRes;
  };

  // 7. Delete Resource
  const deleteResource = async (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  // 8. Submit Review & Update Reputation
  const submitReview = async (
    reviewData: Omit<Review, "id" | "createdAt">
  ): Promise<Review> => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate target student's reputation
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== reviewData.toUserId) return u;
        const currentTotal = u.reputationScore * u.reviewCount;
        const newCount = u.reviewCount + 1;
        const updatedScore = Number(
          ((currentTotal + reviewData.overallExperience) / newCount).toFixed(1)
        );
        return {
          ...u,
          reputationScore: updatedScore,
          reviewCount: newCount,
        };
      })
    );

    // Notify review recipient
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: reviewData.toUserId,
      title: "New Review Received ⭐",
      message: `${reviewData.fromUserName} left you a ${reviewData.overallExperience}-star rating!`,
      type: "review_received",
      link: `/profile`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return newRev;
  };

  // 9. Profile and Skills Management
  const updateUserProfile = (data: Partial<StudentProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const addSkillToTeach = (skill: UserSkill) => {
    if (!currentUser) return;
    const exists = currentUser.skillsToTeach.some((s) => s.skillName === skill.skillName);
    if (exists) return;
    const updatedTeach = [...currentUser.skillsToTeach, skill];
    updateUserProfile({ skillsToTeach: updatedTeach });
  };

  const addSkillToLearn = (skill: UserSkill) => {
    if (!currentUser) return;
    const exists = currentUser.skillsToLearn.some((s) => s.skillName === skill.skillName);
    if (exists) return;
    const updatedLearn = [...currentUser.skillsToLearn, skill];
    updateUserProfile({ skillsToLearn: updatedLearn });
  };

  const removeSkill = (skillName: string, type: "teach" | "learn") => {
    if (!currentUser) return;
    if (type === "teach") {
      updateUserProfile({
        skillsToTeach: currentUser.skillsToTeach.filter((s) => s.skillName !== skillName),
      });
    } else {
      updateUserProfile({
        skillsToLearn: currentUser.skillsToLearn.filter((s) => s.skillName !== skillName),
      });
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const loginAsUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const loginWithEmail = async (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    // Auto-create student for demo testing if not found
    const namePart = email.split("@")[0];
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newStudent: StudentProfile = {
      id: `user-${Date.now()}`,
      name: capitalized,
      email,
      photoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      college: "Global Tech University",
      department: "Computer Science & Engineering",
      year: "3rd Year",
      bio: `Hello! I'm ${capitalized}, enthusiastic about peer skill exchange on CloudSkill.`,
      location: "Campus Hub",
      availability: "Weekends & Evenings",
      skillsToTeach: [
        {
          skillId: "skill-python",
          skillName: "Python",
          category: "Programming",
          level: "Intermediate",
          type: "teach",
        },
      ],
      skillsToLearn: [
        {
          skillId: "skill-figma",
          skillName: "Figma",
          category: "UI / UX",
          level: "Beginner",
          type: "learn",
        },
      ],
      learningGoals: ["Master design systems and cloud computing."],
      reputationScore: 5.0,
      reviewCount: 1,
      badges: ["New Mentor"],
      role: "student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exchangesCount: 0,
      sessionsCompleted: 0,
    };
    setUsers((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    return true;
  };

  const registerUser = async (data: Partial<StudentProfile>) => {
    const newStudent: StudentProfile = {
      id: `user-${Date.now()}`,
      name: data.name || "New Student",
      email: data.email || `student${Date.now()}@campus.edu`,
      photoURL:
        data.photoURL ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      college: data.college || "Institute of Technology",
      department: data.department || "Computer Science",
      year: data.year || "3rd Year",
      bio: data.bio || "Excited to exchange skills with peers on campus!",
      location: data.location || "Bangalore",
      availability: data.availability || "Weekends (10 hrs/wk)",
      skillsToTeach: data.skillsToTeach || [],
      skillsToLearn: data.skillsToLearn || [],
      learningGoals: data.learningGoals || ["Learn peer technologies"],
      reputationScore: 5.0,
      reviewCount: 0,
      badges: ["New Mentor"],
      role: data.role || "student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exchangesCount: 0,
      sessionsCompleted: 0,
    };

    setUsers((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    return true;
  };

  const addNewSkillToCatalog = (
    skillData: Omit<Skill, "id" | "createdAt" | "learnersCount" | "mentorsCount">
  ) => {
    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      learnersCount: 1,
      mentorsCount: 1,
      createdAt: new Date().toISOString(),
    };
    setSkills((prev) => [...prev, newSkill]);
  };

  return (
    <ExchangeContext.Provider
      value={{
        currentUser,
        users,
        skills,
        exchanges,
        requests,
        sessions,
        resources,
        notifications,
        reviews,
        unreadNotificationsCount,
        sendExchangeRequest,
        acceptExchangeRequest,
        rejectExchangeRequest,
        createSession,
        completeSession,
        uploadResource,
        deleteResource,
        submitReview,
        updateUserProfile,
        addSkillToTeach,
        addSkillToLearn,
        removeSkill,
        markNotificationRead,
        markAllNotificationsRead,
        loginAsUser,
        logout,
        loginWithEmail,
        registerUser,
        addNewSkillToCatalog,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error("useExchange must be used within an ExchangeProvider");
  }
  return context;
}
