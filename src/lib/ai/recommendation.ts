import { StudentProfile } from "@/types";

export interface AIRecommendationResult {
  roleOrGoal: string;
  recommendedSkills: string[];
  explanation: string;
  matchedMentors: {
    student: StudentProfile;
    canTeachSkills: string[];
  }[];
}

const ROLE_SKILL_GRAPH: Record<string, string[]> = {
  "full-stack": [
    "Next.js",
    "React",
    "Python",
    "Cloud Computing (GCP & AWS)",
    "Docker & Kubernetes",
    "Figma"
  ],
  "full stack": [
    "Next.js",
    "React",
    "Python",
    "Cloud Computing (GCP & AWS)",
    "Docker & Kubernetes",
    "Figma"
  ],
  "frontend": [
    "React",
    "Next.js",
    "Figma",
    "Video Editing & Premiere"
  ],
  "ui/ux": [
    "Figma",
    "React",
    "Video Editing & Premiere"
  ],
  "product designer": [
    "Figma",
    "React",
    "Video Editing & Premiere"
  ],
  "backend": [
    "Python",
    "Cloud Computing (GCP & AWS)",
    "Docker & Kubernetes",
    "Cybersecurity & Ethical Hacking"
  ],
  "cloud": [
    "Cloud Computing (GCP & AWS)",
    "Docker & Kubernetes",
    "Python",
    "Cybersecurity & Ethical Hacking"
  ],
  "devops": [
    "Docker & Kubernetes",
    "Cloud Computing (GCP & AWS)",
    "Python"
  ],
  "ai": [
    "Machine Learning & PyTorch",
    "Python",
    "Data Science & Pandas",
    "Cloud Computing (GCP & AWS)"
  ],
  "machine learning": [
    "Machine Learning & PyTorch",
    "Python",
    "Data Science & Pandas"
  ],
  "data science": [
    "Data Science & Pandas",
    "Python",
    "Machine Learning & PyTorch"
  ],
  "data analyst": [
    "Data Science & Pandas",
    "Python",
    "Personal Finance & Investing"
  ],
  "cybersecurity": [
    "Cybersecurity & Ethical Hacking",
    "Python",
    "Cloud Computing (GCP & AWS)",
    "Docker & Kubernetes"
  ],
  "security": [
    "Cybersecurity & Ethical Hacking",
    "Python",
    "Cloud Computing (GCP & AWS)"
  ],
  "mobile": [
    "Flutter & Dart",
    "React",
    "Figma"
  ],
  "flutter": [
    "Flutter & Dart",
    "Figma",
    "React"
  ],
  "content creator": [
    "Video Editing & Premiere",
    "Figma",
    "Personal Finance & Investing"
  ],
  "finance": [
    "Personal Finance & Investing",
    "Data Science & Pandas",
    "Python"
  ],
};

/**
 * Recommends curated learning paths and compatible peer mentors
 * Uses rule-based reasoning with fallback if AI API keys are not supplied.
 */
export async function getSkillRecommendations(
  goalText: string,
  students: StudentProfile[]
): Promise<AIRecommendationResult> {
  const normalized = goalText.toLowerCase();

  // Find best matching domain
  let matchedDomain = "full-stack";
  for (const key of Object.keys(ROLE_SKILL_GRAPH)) {
    if (normalized.includes(key)) {
      matchedDomain = key;
      break;
    }
  }

  const recommendedSkills = ROLE_SKILL_GRAPH[matchedDomain] || [
    "Python",
    "React",
    "Cloud Computing (GCP & AWS)",
    "Figma"
  ];

  // Match active students who can teach these skills
  const matchedMentors: {
    student: StudentProfile;
    canTeachSkills: string[];
  }[] = [];

  for (const student of students) {
    const teachingMatches = student.skillsToTeach
      .map(s => s.skillName)
      .filter(name =>
        recommendedSkills.some(rec =>
          rec.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(rec.toLowerCase())
        )
      );

    if (teachingMatches.length > 0) {
      matchedMentors.push({
        student,
        canTeachSkills: teachingMatches,
      });
    }
  }

  // Sort by reputation score
  matchedMentors.sort((a, b) => b.student.reputationScore - a.student.reputationScore);

  return {
    roleOrGoal: goalText,
    recommendedSkills,
    explanation: `Based on your goal "${goalText}", industry roadmap standards indicate mastering foundational programming, system architecture, modern frameworks, and cloud deployment pipelines. Below are student peers on campus ready to teach you these skills.`,
    matchedMentors: matchedMentors.slice(0, 5),
  };
}
