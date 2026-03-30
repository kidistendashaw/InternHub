/**
 * AI Matching Algorithm for InternHub
 * Calculates similarity between student profiles and internship requirements
 */

interface StudentProfile {
  skills: string[]
  gpa?: number
  education: string
  experience: string
}

interface InternshipRequirements {
  requiredSkills: string[]
  preferredGPA?: number
}

export function calculateMatchScore(
  student: StudentProfile,
  internship: InternshipRequirements
): number {
  let score = 0
  let maxScore = 0

  // Skills matching (60% weight)
  maxScore += 60
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase())
  const requiredSkillsLower = internship.requiredSkills.map((s) => s.toLowerCase())
  
  const matchedSkills = requiredSkillsLower.filter((skill) =>
    studentSkillsLower.some((s) => s.includes(skill) || skill.includes(s))
  )
  
  const skillMatchRatio = matchedSkills.length / requiredSkillsLower.length
  score += skillMatchRatio * 60

  // GPA matching (20% weight)
  if (student.gpa && internship.preferredGPA) {
    maxScore += 20
    const gpaDifference = Math.abs(student.gpa - internship.preferredGPA)
    const gpaScore = Math.max(0, 20 - gpaDifference * 5)
    score += gpaScore
  } else if (internship.preferredGPA && !student.gpa) {
    // No GPA provided, neutral score
    maxScore += 20
    score += 10
  }

  // Education indicator (10% weight)
  maxScore += 10
  if (
    student.education.toLowerCase().includes('computer science') ||
    student.education.toLowerCase().includes('engineering') ||
    student.education.toLowerCase().includes('information technology')
  ) {
    score += 10
  } else if (student.education.length > 0) {
    score += 5
  }

  // Experience indicator (10% weight)
  maxScore += 10
  const experienceWords = student.experience.toLowerCase().split(' ').length
  if (experienceWords > 50) {
    score += 10
  } else if (experienceWords > 20) {
    score += 7
  } else if (experienceWords > 0) {
    score += 3
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0
}

export function getMatchDetails(
  student: StudentProfile,
  internship: InternshipRequirements
): string[] {
  const details: string[] = []

  const studentSkillsLower = student.skills.map((s) => s.toLowerCase())
  const requiredSkillsLower = internship.requiredSkills.map((s) => s.toLowerCase())

  // Find matched skills
  const matchedSkills = requiredSkillsLower.filter((skill) =>
    studentSkillsLower.some((s) => s.includes(skill) || skill.includes(s))
  )

  if (matchedSkills.length > 0) {
    details.push(`Matches ${matchedSkills.length} required skills`)
  }

  // GPA match
  if (student.gpa && internship.preferredGPA) {
    const difference = Math.abs(student.gpa - internship.preferredGPA)
    if (difference < 0.5) {
      details.push(`Strong GPA match (${student.gpa}/${internship.preferredGPA})`)
    } else if (difference < 1) {
      details.push(`Good GPA (${student.gpa})`)
    }
  }

  // Education match
  if (
    student.education.toLowerCase().includes('computer science') ||
    student.education.toLowerCase().includes('engineering')
  ) {
    details.push('Relevant educational background')
  }

  // Experience
  if (student.experience.length > 50) {
    details.push('Strong relevant experience')
  } else if (student.experience.length > 0) {
    details.push('Some relevant experience')
  }

  // Return top 3 details
  return details.slice(0, 3)
}

export function rankMatches<T extends { id: string; requiredSkills: string[] }>(
  student: StudentProfile,
  internships: T[]
): Array<T & { score: number }> {
  return internships
    .map((internship) => ({
      ...internship,
      score: calculateMatchScore(student, {
        requiredSkills: internship.requiredSkills,
        preferredGPA: undefined,
      }),
    }))
    .sort((a, b) => b.score - a.score)
}
