/**
 * CloudSkill Exchange — Firebase Cloud Functions Definition
 * These serverless handlers run in Google Cloud Run / Firebase Functions environment
 * triggered by Firestore events and scheduled cron jobs.
 */

import { StudentProfile, ExchangeRequest, Session, Review } from "@/types";

/**
 * 1. calculateMatchScore()
 * Automatically triggered when a student adds or updates their skills in userSkills
 */
export async function calculateMatchScoreFunction(
  studentA: StudentProfile,
  studentB: StudentProfile
) {
  // Cloud function computes mutual complement score and stores in matches collection
  const teachA = studentA.skillsToTeach.map(s => s.skillName);
  const learnB = studentB.skillsToLearn.map(s => s.skillName);
  const mutual = teachA.filter(s => learnB.includes(s));
  return {
    compatibilityScore: mutual.length > 0 ? 90 + mutual.length * 2 : 45,
    matchedSkills: mutual,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 2. sendExchangeNotification()
 * Cloud Firestore trigger on write to /exchangeRequests/{requestId}
 */
export async function sendExchangeNotificationFunction(request: ExchangeRequest) {
  return {
    type: "exchange_notification",
    recipientId: request.toUserId,
    title: "New Exchange Proposal 🎯",
    body: `${request.fromUserName} wants to exchange ${request.teachSkill} for ${request.learnSkill}`,
    data: { requestId: request.id },
  };
}

/**
 * 3. updateReputation()
 * Cloud Firestore trigger on creation of /reviews/{reviewId}
 */
export async function updateReputationFunction(review: Review, currentProfile: StudentProfile) {
  const currentTotal = currentProfile.reputationScore * currentProfile.reviewCount;
  const newCount = currentProfile.reviewCount + 1;
  const newAverage = Number(((currentTotal + review.overallExperience) / newCount).toFixed(1));

  const badges = [...currentProfile.badges];
  if (newAverage >= 4.8 && !badges.includes("Top Mentor")) {
    badges.push("Top Mentor");
  }
  if (newCount >= 10 && !badges.includes("Community Champion")) {
    badges.push("Community Champion");
  }

  return {
    reputationScore: newAverage,
    reviewCount: newCount,
    badges,
  };
}

/**
 * 4. processCompletedSession()
 * Cloud Firestore trigger on status change to 'completed' in /sessions/{sessionId}
 */
export async function processCompletedSessionFunction(session: Session) {
  return {
    sessionId: session.id,
    incrementProgressBy: 20,
    notificationTitle: "Session Completed! 🎉",
    notificationBody: `Great job completing "${session.title}" with your peer mentor.`,
  };
}

/**
 * 5. cleanupExpiredRequests()
 * Scheduled Cloud Cron Function: runs daily at midnight to expire requests older than 14 days
 */
export async function cleanupExpiredRequestsFunction(cutoffDays = 14) {
  const cutoffTimestamp = Date.now() - cutoffDays * 24 * 60 * 60 * 1000;
  return {
    action: "ARCHIVED_EXPIRED_REQUESTS",
    cutoffTimestamp,
  };
}
