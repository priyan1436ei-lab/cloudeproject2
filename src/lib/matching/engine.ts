import { StudentProfile, CompatibilityBreakdown, SkillLevel } from '@/types';

// Numeric mapping for skill difficulty level
const LEVEL_VALUES: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

/**
 * Normalizes skill strings for fuzzy matching
 */
function normalizeSkill(str: string): string {
  return str.trim().toLowerCase().replace(/[\s\-_/.]/g, '');
}

/**
 * Calculates the compatibility score between two students according to the CloudSkill algorithm:
 * - Teaching skill match: 40%
 *   (Does User A teach what User B wants to learn, and User B teach what User A wants to learn?)
 * - Learning skill match: 30%
 *   (Complementary needs / overlap)
 * - Availability match: 15%
 *   (Shared free hours, weekends, evenings)
 * - Skill level compatibility: 10%
 *   (Mentor level >= Learner desired level)
 * - Common interests / department: 5%
 */
export function calculateMatchScore(
  userA: StudentProfile,
  userB: StudentProfile
): CompatibilityBreakdown {
  if (userA.id === userB.id) {
    return {
      score: 0,
      teachingSkillMatch: 0,
      learningSkillMatch: 0,
      availabilityMatch: 0,
      levelCompatibility: 0,
      commonInterests: 0,
      matchedTeachSkills: [],
      matchedLearnSkills: [],
    };
  }

  // 1. Direct Skill Exchange Cross-Match (40% + 30%)
  // User A can teach -> User B wants to learn
  const aTeachesWhatBWants: string[] = [];
  let aLevelScores: number[] = [];

  for (const teachA of userA.skillsToTeach || []) {
    const normA = normalizeSkill(teachA.skillName);
    const matchedLearnB = (userB.skillsToLearn || []).find(
      (learnB) => normalizeSkill(learnB.skillName) === normA ||
                 normalizeSkill(learnB.skillName).includes(normA) ||
                 normA.includes(normalizeSkill(learnB.skillName))
    );

    if (matchedLearnB) {
      aTeachesWhatBWants.push(teachA.skillName);
      // Level compatibility: If teacher level >= learner level, give full 10% fraction
      const teacherLvl = LEVEL_VALUES[teachA.level] || 2;
      const learnerLvl = LEVEL_VALUES[matchedLearnB.level] || 1;
      aLevelScores.push(teacherLvl >= learnerLvl ? 1 : 0.7);
    }
  }

  // User B can teach -> User A wants to learn
  const bTeachesWhatAWants: string[] = [];
  let bLevelScores: number[] = [];

  for (const teachB of userB.skillsToTeach || []) {
    const normB = normalizeSkill(teachB.skillName);
    const matchedLearnA = (userA.skillsToLearn || []).find(
      (learnA) => normalizeSkill(learnA.skillName) === normB ||
                 normalizeSkill(learnA.skillName).includes(normB) ||
                 normB.includes(normalizeSkill(learnA.skillName))
    );

    if (matchedLearnA) {
      bTeachesWhatAWants.push(teachB.skillName);
      const teacherLvl = LEVEL_VALUES[teachB.level] || 2;
      const learnerLvl = LEVEL_VALUES[matchedLearnA.level] || 1;
      bLevelScores.push(teacherLvl >= learnerLvl ? 1 : 0.7);
    }
  }

  // Teaching Skill Match (40%)
  // Bidirectional perfect match gives 40%, single direction gives up to 22%
  let teachingSkillMatch = 0;
  if (aTeachesWhatBWants.length > 0 && bTeachesWhatAWants.length > 0) {
    teachingSkillMatch = 40;
  } else if (aTeachesWhatBWants.length > 0 || bTeachesWhatAWants.length > 0) {
    teachingSkillMatch = 24;
  } else {
    // Check if categories overlap
    const aCategories = new Set(userA.skillsToTeach.map(s => s.category));
    const bWantsCategories = userB.skillsToLearn.filter(s => aCategories.has(s.category));
    if (bWantsCategories.length > 0) {
      teachingSkillMatch = 12;
    }
  }

  // Learning Skill Match (30%)
  let learningSkillMatch = 0;
  if (aTeachesWhatBWants.length > 0 && bTeachesWhatAWants.length > 0) {
    learningSkillMatch = 30;
  } else if (aTeachesWhatBWants.length > 0 || bTeachesWhatAWants.length > 0) {
    learningSkillMatch = 18;
  } else {
    // General category alignment
    const bCategories = new Set(userB.skillsToTeach.map(s => s.category));
    const aWantsCategories = userA.skillsToLearn.filter(s => bCategories.has(s.category));
    if (aWantsCategories.length > 0) {
      learningSkillMatch = 10;
    }
  }

  // Availability Match (15%)
  let availabilityMatch = 8; // baseline
  const availA = (userA.availability || '').toLowerCase();
  const availB = (userB.availability || '').toLowerCase();
  if (
    (availA.includes('weekend') && availB.includes('weekend')) ||
    (availA.includes('evening') && availB.includes('evening')) ||
    (availA.includes('flexible') || availB.includes('flexible'))
  ) {
    availabilityMatch = 15;
  } else if (availA && availB) {
    availabilityMatch = 11;
  }

  // Skill Level Compatibility (10%)
  const allLevels = [...aLevelScores, ...bLevelScores];
  let levelCompatibility = 7;
  if (allLevels.length > 0) {
    const avgLevel = allLevels.reduce((a, b) => a + b, 0) / allLevels.length;
    levelCompatibility = Math.round(avgLevel * 10);
  }

  // Common Interests / College / Dept (5%)
  let commonInterests = 2;
  if (userA.college && userB.college && userA.college.toLowerCase() === userB.college.toLowerCase()) {
    commonInterests += 2;
  }
  if (userA.department && userB.department && userA.department.toLowerCase() === userB.department.toLowerCase()) {
    commonInterests += 1;
  }
  commonInterests = Math.min(5, commonInterests);

  const totalScore = Math.min(
    99,
    Math.max(
      20,
      teachingSkillMatch + learningSkillMatch + availabilityMatch + levelCompatibility + commonInterests
    )
  );

  return {
    score: totalScore,
    teachingSkillMatch,
    learningSkillMatch,
    availabilityMatch,
    levelCompatibility,
    commonInterests,
    matchedTeachSkills: aTeachesWhatBWants,
    matchedLearnSkills: bTeachesWhatAWants,
  };
}
