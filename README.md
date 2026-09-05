# English Chat Bot

AI 기반 영어 학습 챗봇입니다.

## Tech stack

- Python 3.10+
- FastAPI
- Pydantic
- Uvicorn

## Getting started

`uv`를 사용하는 경우:

```powershell
uv sync --extra dev
Copy-Item .env.example .env
uv run uvicorn app.main:app --reload
```

`pip`를 사용하는 경우:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

서버 실행 후 다음 주소를 사용할 수 있습니다.

- API 문서: http://127.0.0.1:8000/docs
- 상태 확인: http://127.0.0.1:8000/health
- 채팅 API: `POST http://127.0.0.1:8000/api/v1/chat`

테스트 실행:

```powershell
uv run pytest
```

# History
기존 : 2025-2월 시작 <br/>
-> (2026-04-30) 심각한 본업이슈로 인해 2026-05 시작 <br/>
stack : java Spring 3.0 <br/>
-> (2026-04-30) 해당 프로젝트는 경량 프로젝트 이며, AI를 좀더 깊게 활용하고자 무거운 Spring 대신 Django / Flask 로 변경 <br/>
-> FastAPI 기반 Python 백엔드로 전환 <br/>
