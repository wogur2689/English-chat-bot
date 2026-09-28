from datetime import date

from pydantic import BaseModel


class DailyWord(BaseModel):
    word: str
    meaning: str


class WeeklySentence(BaseModel):
    sentence: str
    translation: str


class TodayLessonResponse(BaseModel):
    date: date
    greeting: str
    daily_words: list[DailyWord]
    weekly_sentence: WeeklySentence
