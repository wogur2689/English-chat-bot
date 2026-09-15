from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_web_app() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert "Fluent — English practice" in response.text


def test_chat() -> None:
    response = client.post("/api/v1/chat", json={"message": "Hello"})

    assert response.status_code == 200
    assert response.json() == {"reply": "You said: Hello"}
