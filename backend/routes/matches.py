from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.base import get_db
from backend.models import Student
from backend.matching import find_matches_for_student

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("/recommended/{student_id}")
def get_recommended_matches(
    student_id: int,
    threshold: float = 0.3,
    db: Session = Depends(get_db),
):
    """
    Return AI-powered internship recommendations for a student.

    - threshold: minimum match score (0.0–1.0). Defaults to 0.3 so students
      with sparse profiles still see results.
    - Returns up to 3 matches sorted by score descending.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    matches = find_matches_for_student(student_id, threshold=threshold)

    # Enrich each match with a human-readable score percentage and reasons
    enriched = []
    for m in matches:
        reasons = _build_reasons(student, m)
        enriched.append(
            {
                **m,
                "matchPercent": round(m["match_score"] * 100, 1),
                "reasons": reasons,
            }
        )

    return enriched


# ---------------------------------------------------------------------------
# Helper: generate plain-English reasons for the match score
# ---------------------------------------------------------------------------

def _build_reasons(student: Student, match: dict) -> list[str]:
    reasons = []

    student_skills = set(s.lower() for s in (student.skills or []))
    required_skills = set(s.lower() for s in (match.get("required_skills") or []))
    overlap = student_skills & required_skills

    if overlap:
        reasons.append(f"Your skills match: {', '.join(sorted(overlap))}")

    if student.cgpa and student.cgpa >= 3.0:
        reasons.append(f"Strong academic record (CGPA {student.cgpa:.2f})")

    prefs = " ".join(student.preferences or []).lower()
    domain = (match.get("domain") or "").lower()
    if domain and domain in prefs:
        reasons.append(f"Matches your interest in {match['domain']}")

    if student.resume_url:
        reasons.append("You have an uploaded resume")

    if not reasons:
        reasons.append("Profile partially matches internship requirements")

    return reasons
