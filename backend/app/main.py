from fastapi import FastAPI 
from app.db.session import Base, engine 
from app.api.v1.routes.auth import router as auth_router 
from app.api.v1.routes.tickets import router as ticket_router
from app.api.v1.routes.comments import router as comment_router
from app.api.v1.routes.admin import router as admin_router
from app.api.v1.routes.notifications import router as notification_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Customer Support Ticket Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(ticket_router)
app.include_router(comment_router)
app.include_router(admin_router)
app.include_router(notification_router)

@app.get("/")
def root():
    return {"Message": "Support Ticket System API is running"}