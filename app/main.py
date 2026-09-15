from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import chat, health
from app.core.config import get_settings

WEB_DIR = Path(__file__).parent / "web"


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    get_settings()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        version="0.1.0",
        lifespan=lifespan,
    )
    application.mount("/static", StaticFiles(directory=WEB_DIR), name="static")
    application.include_router(health.router)
    application.include_router(chat.router, prefix="/api/v1")

    @application.get("/", include_in_schema=False)
    async def web_app() -> FileResponse:
        return FileResponse(WEB_DIR / "index.html")

    return application


app = create_app()
