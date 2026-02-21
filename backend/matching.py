from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from models import Student, Internship, Match
from base import SessionLocal

def calculate_match_score(student: Student, internship: Internship) -> float:
    """
    Calculate match score between a student and an internship using weighted scoring.
    Weights: skills (40%), CGPA (30%), preferences (20%), resume quality (10%).
    """
    score = 0.0

    # Skills matching using TF-IDF and cosine similarity (40%)
    student_skills = " ".join(student.skills) if student.skills else ""
    internship_skills = " ".join(internship.required_skills) if internship.required_skills else ""

    if student_skills and internship_skills:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([student_skills, internship_skills])
        skills_similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        score += skills_similarity * 0.4
    else:
        score += 0.0  # No skills match

    # CGPA matching (30%)
    if student.cgpa >= internship.min_cgpa:
        cgpa_score = min(1.0, student.cgpa / 10.0)  # Normalize to 0-1
        score += cgpa_score * 0.3
    else:
        score += 0.0

    # Preferences matching (20%) - simple keyword matching
    student_prefs = " ".join(student.preferences) if student.preferences else ""
    if student_prefs and internship.domain.lower() in student_prefs.lower():
        score += 0.2
    else:
        score += 0.0

    # Resume quality (10%) - placeholder, could be enhanced with NLP
    resume_score = 0.1 if student.resume_url else 0.0
    score += resume_score * 0.1

    return min(1.0, score)  # Cap at 1.0

def find_matches_for_student(student_id: int, threshold: float = 0.5):
    """
    Find top 3 matches for a student above the threshold.
    """
    db = SessionLocal()
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return []

        internships = db.query(Internship).filter(Internship.is_active == True).all()
        matches = []

        for internship in internships:
            score = calculate_match_score(student, internship)
            if score >= threshold:
                matches.append({
                    "internship_id": internship.id,
                    "title": internship.title,
                    "description": internship.description,
                    "required_skills": internship.required_skills,
                    "domain": internship.domain,
                    "match_score": score
                })

        # Sort by score descending and take top 3
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        return matches[:3]
    finally:
        db.close()

def save_match(student_id: int, internship_id: int, score: float):
    """
    Save a match to the database.
    """
    db = SessionLocal()
    try:
        match = Match(student_id=student_id, internship_id=internship_id, match_score=score)
        db.add(match)
        db.commit()
        db.refresh(match)
        return match
    finally:
        db.close()