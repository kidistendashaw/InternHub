from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.base import get_db
from backend.models import Student, Internship, Application, Company

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    """Return platform-wide statistics for the admin dashboard."""
    total_students = db.query(Student).count()
    total_internships = db.query(Internship).filter(Internship.is_active == True).count()
    total_companies = db.query(Company).count()

    total_applications = db.query(Application).count()
    pending = db.query(Application).filter(Application.status == "pending").count()
    accepted = db.query(Application).filter(Application.status == "accepted").count()
    rejected = db.query(Application).filter(Application.status == "rejected").count()

    # Average match score across all applications
    apps = db.query(Application).all()
    avg_score = (
        round(sum(a.match_score for a in apps if a.match_score) / len(apps) * 100, 1)
        if apps
        else 0
    )

    # Top domains by number of active internships
    internships = db.query(Internship).filter(Internship.is_active == True).all()
    domain_counts: dict[str, int] = {}
    for i in internships:
        if i.domain:
            domain_counts[i.domain] = domain_counts.get(i.domain, 0) + 1
    top_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "students": total_students,
        "internships": total_internships,
        "companies": total_companies,
        "applications": {
            "total": total_applications,
            "pending": pending,
            "accepted": accepted,
            "rejected": rejected,
        },
        "avgMatchScore": avg_score,
        "topDomains": [{"domain": d, "count": c} for d, c in top_domains],
    }
