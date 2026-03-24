from fastapi import FastAPI
from backend.base import engine, Base
from backend.routes.students import router as students_router
from backend.routes.internships import router as internships_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InternHub API")

# Include routers
app.include_router(students_router)
app.include_router(internships_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to InternHub API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
