from fastapi.testclient import TestClient

from app.main import app
from app.schemas.chat import ChatResponse
from app.services.ai import get_analyzer

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_web_app() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert "Fluent — English practice" in response.text


def test_today_lesson() -> None:
    response = client.get("/api/v1/lesson/today")

    assert response.status_code == 200
    lesson = response.json()
    assert len(lesson["daily_words"]) == 2
    assert lesson["weekly_sentence"]["sentence"]


def test_chat() -> None:
    class FakeAnalyzer:
        async def analyze(self, text: str) -> ChatResponse:
            return ChatResponse(
                original=text,
                ipa="/həˈloʊ/",
                pronunciation_ko="헐로우",
                translation="안녕하세요",
            )

    app.dependency_overrides[get_analyzer] = lambda: FakeAnalyzer()
    try:
        response = client.post("/api/v1/chat", json={"message": "Hello"})
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {
        "original": "Hello",
        "ipa": "/həˈloʊ/",
        "pronunciation_ko": "헐로우",
        "translation": "안녕하세요",
    }
