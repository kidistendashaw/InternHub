from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.base import engine, Base
from backend.routes.students import router as students_router
from backend.routes.internships import router as internships_router
from backend.routes.auth import router as auth_router
from backend.routes.applications import router as applications_router
from backend.routes.matches import router as matches_router
from backend.routes.stats import router as stats_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InternHub API", version="1.0.0")

# CORS middleware — allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(students_router)
app.include_router(internships_router)
app.include_router(applications_router)
app.include_router(matches_router)
app.include_router(stats_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to InternHub API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
