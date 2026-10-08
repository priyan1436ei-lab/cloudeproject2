export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillCategory =
  | 'Programming'
  | 'AI / ML'
  | 'UI / UX'
  | 'Cloud Computing'
  | 'Cybersecurity'
  | 'Data Science'
  | 'Mobile Development'
  | 'Web Development'
  | 'DevOps'
  | 'Digital Marketing'
  | 'Communication'
  | 'Leadership'
  | 'Photography'
  | 'Video Editing'
  | 'Finance'
  | 'Entrepreneurship'
  | 'Other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  difficulty: SkillLevel;
  learnersCount: number;
  mentorsCount: number;
  tags?: string[];
  icon?: string;
  createdAt: string;
}

export interface UserSkill {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  level: SkillLevel;
  type: 'teach' | 'learn';
  yearsExperience?: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  college: string;
  department: string;
  year: string; // e.g., "3rd Year", "Final Year"
  bio: string;
  location: string;
  availability: string; // e.g., "Weekends & Evenings", "10 hrs/week"
  availabilitySlots?: string[];
  skillsToTeach: UserSkill[];
  skillsToLearn: UserSkill[];
  learningGoals: string[];
  reputationScore: number; // e.g. 4.8
  reviewCount: number;
  badges: string[];
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
  exchangesCount?: number;
  sessionsCompleted?: number;
}

export type ExchangeRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export interface ExchangeRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto: string;
  fromUserCollege: string;
  toUserId: string;
  toUserName: string;
  toUserPhoto: string;
  toUserCollege: string;
  teachSkill: string; // what requester will teach
  learnSkill: string; // what requester wants to learn
  message: string;
  status: ExchangeRequestStatus;
  compatibilityScore: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Exchange {
  id: string;
  requestId?: string;
  userA: {
    id: string;
    name: string;
    photoURL: string;
    college: string;
    department: string;
  };
  userB: {
    id: string;
    name: string;
    photoURL: string;
    college: string;
    department: string;
  };
  skillA: string; // Skill taught by User A to User B
  skillB: string; // Skill taught by User B to User A
  compatibilityScore: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  progressA: number; // 0 to 100% progress for User A
  progressB: number; // 0 to 100% progress for User B
  sessionsCount: number;
  lastSessionDate?: string;
}

export interface Session {
  id: string;
  exchangeId: string;
  title: string;
  skill: string;
  mentorId: string;
  mentorName: string;
  learnerId: string;
  learnerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  meetingLink: string;
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface ResourceItem {
  id: string;
  exchangeId: string;
  name: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  fileType: 'pdf' | 'doc' | 'ppt' | 'image' | 'zip' | 'code' | 'other';
  fileSize: string;
  fileUrl: string;
  createdAt: string;
  description?: string;
}

export interface ExchangeMessage {
  id: string;
  exchangeId: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  exchangeId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto?: string;
  toUserId: string;
  teachingQuality: number; // 1-5
  communication: number; // 1-5
  knowledge: number; // 1-5
  punctuality: number; // 1-5
  overallExperience: number; // 1-5
  comment: string;
  createdAt: string;
}

export type NotificationType =
  | 'exchange_request'
  | 'request_accepted'
  | 'request_rejected'
  | 'session_scheduled'
  | 'session_reminder'
  | 'resource_uploaded'
  | 'review_received'
  | 'match_discovered';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface CompatibilityBreakdown {
  score: number;
  teachingSkillMatch: number; // out of 40%
  learningSkillMatch: number; // out of 30%
  availabilityMatch: number; // out of 15%
  levelCompatibility: number; // out of 10%
  commonInterests: number; // out of 5%
  matchedTeachSkills: string[];
  matchedLearnSkills: string[];
}
