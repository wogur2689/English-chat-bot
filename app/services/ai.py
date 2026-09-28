from functools import lru_cache

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.schemas.chat import ChatResponse

SYSTEM_PROMPT = """You are an English learning assistant for Korean speakers.
Analyze the user's English word, phrase, or sentence.
Return:
- original: preserve the user's text, fixing only surrounding whitespace.
- ipa: accurate IPA pronunciation. For a sentence, include natural connected-speech IPA.
- pronunciation_ko: an easy-to-read Korean pronunciation guide. Make clear that it is approximate.
- translation: a concise, natural Korean translation. If the input has multiple common meanings,
  include only the meaning most likely in context.
Do not add explanations, corrections, examples, Markdown, or fields beyond the schema.
If the input is not English, preserve it in original and explain in translation that an English word
or sentence is needed; use "-" for both pronunciation fields.
"""


class AnalyzerUnavailableError(RuntimeError):
    pass


class EnglishAnalyzer:
    def __init__(self, api_key: str | None, model: str) -> None:
        self._client = AsyncOpenAI(api_key=api_key) if api_key else None
        self._model = model

    async def analyze(self, text: str) -> ChatResponse:
        if self._client is None:
            raise AnalyzerUnavailableError("OPENAI_API_KEY is not configured")

        response = await self._client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
            text_format=ChatResponse,
        )
        if response.output_parsed is None:
            raise AnalyzerUnavailableError("The model did not return a structured analysis")
        return response.output_parsed


@lru_cache
def get_analyzer() -> EnglishAnalyzer:
    settings = get_settings()
    return EnglishAnalyzer(settings.openai_api_key, settings.openai_model)
