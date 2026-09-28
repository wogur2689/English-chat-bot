from fastapi import APIRouter

from app.schemas.lesson import TodayLessonResponse
from app.services.lesson import get_today_lesson

router = APIRouter(prefix="/lesson", tags=["lesson"])


@router.get("/today", response_model=TodayLessonResponse)
async def today_lesson() -> TodayLessonResponse:
    return get_today_lesson()
