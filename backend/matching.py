from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from backend.models import Student, Internship, Application
from backend.base import SessionLocal

def calculate_match_score(student: Student, internship: Internship) -> float:
    """
    Calculate match score between a student and an internship using weighted scoring.
    Weights: skills (35%), CGPA (25%), year of study (15%), preferences (15%), resume quality (10%).
    """
    score = 0.0

    # Skills matching using TF-IDF and cosine similarity (35%)
    student_skills = " ".join(student.skills) if student.skills else ""
    internship_skills = " ".join(internship.required_skills) if internship.required_skills else ""

    if student_skills and internship_skills:
        vectorizer = TfidfVectorizer()
        try:
            tfidf_matrix = vectorizer.fit_transform([student_skills, internship_skills])
            skills_similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            score += skills_similarity * 0.35
        except ValueError:
             # Can happen if vocabulary is empty
             pass

    # CGPA matching (25%)
    # Full points if CGPA is above minimum
    if student.cgpa and internship.min_cgpa:
        if student.cgpa >= internship.min_cgpa:
            score += 0.25
        else:
            # Partial score if close
            ratio = student.cgpa / internship.min_cgpa
            if ratio >= 0.8: # At least 80% of min required
                score += (ratio * 0.25)
    
    # Year of study matching (15%)
    # E.g. A 4th year is better for a min_year=3 role than a 1st year
    if student.year_of_study and internship.min_year:
        if student.year_of_study >= internship.min_year:
            score += 0.15
        else:
            year_ratio = student.year_of_study / internship.min_year
            score += (year_ratio * 0.15)
            
    # Preferences matching (15%) - simple keyword matching
    student_prefs = " ".join(student.preferences) if student.preferences else ""
    if student_prefs and internship.domain:
        if internship.domain.lower() in student_prefs.lower():
            score += 0.15

    # Resume quality (10%) - simple boolean check here
    if student.resume_url:
        score += 0.10

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
        match = Application(student_id=student_id, internship_id=internship_id, match_score=score)
        db.add(match)
        db.commit()
        db.refresh(match)
        return match
    finally:
        db.close()