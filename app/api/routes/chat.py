from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai import AnalyzerUnavailableError, EnglishAnalyzer, get_analyzer

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    analyzer: EnglishAnalyzer = Depends(get_analyzer),
) -> ChatResponse:
    try:
        return await analyzer.analyze(request.message)
    except AnalyzerUnavailableError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="영어 분석 기능을 준비 중입니다. API 키 설정을 확인해 주세요.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="영어 분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        ) from error
