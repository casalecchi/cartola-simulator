from fastapi import FastAPI
from routers import api
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir apenas o frontend (React/Vue/Angular)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
    allow_headers=["*"],  # Permitir todos os headers
)
app.include_router(api.router, prefix="/api")


@app.get("/")
def read_root():
    return {"Hello": "World"}
