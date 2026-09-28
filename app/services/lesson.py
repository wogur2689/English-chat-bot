from datetime import date

from app.schemas.lesson import DailyWord, TodayLessonResponse, WeeklySentence

WORD_PAIRS = (
    (("accomplish", "성취하다, 완수하다"), ("hesitate", "망설이다")),
    (("curious", "호기심이 많은"), ("improve", "향상시키다")),
    (("confident", "자신감 있는"), ("practice", "연습하다")),
    (("ordinary", "평범한"), ("discover", "발견하다")),
    (("patient", "참을성 있는"), ("encourage", "격려하다")),
    (("describe", "묘사하다"), ("familiar", "익숙한")),
    (("prepare", "준비하다"), ("opportunity", "기회")),
    (("recommend", "추천하다"), ("comfortable", "편안한")),
    (("experience", "경험"), ("communicate", "소통하다")),
    (("notice", "알아차리다"), ("probably", "아마도")),
    (("consider", "고려하다"), ("available", "이용 가능한")),
    (("mention", "언급하다"), ("recently", "최근에")),
    (("prefer", "더 좋아하다"), ("suggest", "제안하다")),
    (("achieve", "달성하다"), ("continue", "계속하다")),
)

WEEKLY_SENTENCES = (
    ("I'm looking forward to the weekend.", "주말이 기대돼요."),
    ("Could you say that one more time?", "한 번 더 말씀해 주시겠어요?"),
    ("That sounds like a great idea.", "좋은 생각인 것 같아요."),
    ("I'm getting used to speaking English.", "영어로 말하는 것에 익숙해지고 있어요."),
    ("Let me think about it for a moment.", "잠시 생각해 볼게요."),
    ("I haven't decided yet.", "아직 결정하지 못했어요."),
    ("It was better than I expected.", "생각했던 것보다 좋았어요."),
    ("What do you usually do after work?", "보통 퇴근 후에 무엇을 하나요?"),
)


def get_today_lesson(today: date | None = None) -> TodayLessonResponse:
    lesson_date = today or date.today()
    day_index = lesson_date.toordinal() % len(WORD_PAIRS)
    week_index = (lesson_date.toordinal() // 7) % len(WEEKLY_SENTENCES)
    words = [DailyWord(word=word, meaning=meaning) for word, meaning in WORD_PAIRS[day_index]]
    sentence, translation = WEEKLY_SENTENCES[week_index]

    return TodayLessonResponse(
        date=lesson_date,
        greeting="안녕하세요! 오늘도 가볍게 영어 공부를 시작해 볼까요?",
        daily_words=words,
        weekly_sentence=WeeklySentence(sentence=sentence, translation=translation),
    )
