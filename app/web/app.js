const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const sendButton = form.querySelector("button[type='submit']");

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function appendUserMessage(message) {
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row user-message"><div><span class="speaker">YOU</span>
      <div class="bubble user-bubble"><p>${escapeHtml(message)}</p></div></div></article>`,
  );
}

function appendAnalysis(analysis) {
  document.querySelector("#loading-message")?.remove();
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row tutor-message"><div class="tutor-avatar" aria-hidden="true">F</div>
      <div><span class="speaker">FLUENT TUTOR</span><div class="bubble tutor-bubble analysis-card">
        <dl class="analysis-list">
          <div><dt>원본</dt><dd>${escapeHtml(analysis.original)}</dd></div>
          <div><dt>발음</dt><dd class="ipa">${escapeHtml(analysis.ipa)}</dd>
            <dd class="pronunciation-ko">${escapeHtml(analysis.pronunciation_ko)} <small>(근사 발음)</small></dd></div>
          <div><dt>해석</dt><dd>${escapeHtml(analysis.translation)}</dd></div>
        </dl>
      </div></div></article>`,
  );
  messages.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
}

function appendError(message) {
  document.querySelector("#loading-message")?.remove();
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row tutor-message"><div class="tutor-avatar" aria-hidden="true">F</div>
      <div><span class="speaker">FLUENT TUTOR</span>
        <div class="bubble tutor-bubble error-bubble"><p>${escapeHtml(message)}</p></div></div></article>`,
  );
}

function appendLoadingMessage() {
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row tutor-message" id="loading-message">
      <div class="tutor-avatar" aria-hidden="true">F</div><div><span class="speaker">FLUENT TUTOR</span>
        <div class="bubble tutor-bubble" aria-label="분석 중"><span class="loading-dots" aria-hidden="true">
          <span></span><span></span><span></span></span></div></div></article>`,
  );
}

function bindLessonButtons() {
  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.query;
      input.focus();
    });
  });
}

function renderTodayLesson(lesson) {
  const [firstWord, secondWord] = lesson.daily_words;
  document.querySelector("#welcome-loading").outerHTML = `
    <article class="message-row tutor-message"><div class="tutor-avatar" aria-hidden="true">F</div>
      <div><span class="speaker">FLUENT TUTOR</span><div class="bubble tutor-bubble welcome-card">
        <p>${escapeHtml(lesson.greeting)}</p>
        <section class="welcome-section"><span class="welcome-label">오늘의 단어 2개</span>
          <button class="lesson-word" type="button" data-query="${escapeHtml(firstWord.word)}">
            <strong>${escapeHtml(firstWord.word)}</strong><span>${escapeHtml(firstWord.meaning)}</span></button>
          <button class="lesson-word" type="button" data-query="${escapeHtml(secondWord.word)}">
            <strong>${escapeHtml(secondWord.word)}</strong><span>${escapeHtml(secondWord.meaning)}</span></button>
        </section>
        <section class="welcome-section weekly-line"><span class="welcome-label">이번 주 문장</span>
          <button type="button" data-query="${escapeHtml(lesson.weekly_sentence.sentence)}">
            <strong>${escapeHtml(lesson.weekly_sentence.sentence)}</strong>
            <span>${escapeHtml(lesson.weekly_sentence.translation)}</span></button>
        </section>
        <p class="welcome-hint">궁금한 항목을 누르거나, 아래에 영어를 직접 입력해 보세요.</p>
      </div></div></article>`;

  document.querySelector("#daily-word-list").innerHTML = lesson.daily_words
    .map(
      (item, index) => `<button class="daily-word-card" type="button" data-query="${escapeHtml(item.word)}">
        <span>0${index + 1}</span><strong>${escapeHtml(item.word)}</strong>
        <small>${escapeHtml(item.meaning)}</small></button>`,
    )
    .join("");

  const weeklyCard = document.querySelector("#weekly-sentence");
  weeklyCard.querySelector("p").textContent = `“${lesson.weekly_sentence.sentence}”`;
  weeklyCard.querySelector("small").textContent = lesson.weekly_sentence.translation;
  weeklyCard.dataset.query = lesson.weekly_sentence.sentence;
  weeklyCard.setAttribute("tabindex", "0");
  weeklyCard.setAttribute("role", "button");
  weeklyCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.value = weeklyCard.dataset.query;
      input.focus();
    }
  });
  bindLessonButtons();
}

async function loadTodayLesson() {
  try {
    const response = await fetch("/api/v1/lesson/today");
    if (!response.ok) throw new Error("Lesson request failed");
    renderTodayLesson(await response.json());
  } catch (_error) {
    document.querySelector("#welcome-loading")?.remove();
    appendError("오늘의 학습 내용을 불러오지 못했어요. 페이지를 새로고침해 주세요.");
  }
}

async function sendMessage(message) {
  appendUserMessage(message);
  appendLoadingMessage();
  sendButton.disabled = true;
  try {
    const response = await fetch("/api/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "영어 분석에 실패했어요.");
    appendAnalysis(data);
  } catch (error) {
    appendError(error.message || "잠시 연결이 원활하지 않아요. 다시 한번 보내 주세요.");
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  input.style.height = "auto";
  sendMessage(message);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
});

loadTodayLesson();
