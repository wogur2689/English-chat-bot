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
    `<article class="message-row user-message">
      <div>
        <span class="speaker">YOU</span>
        <div class="bubble user-bubble"><p>${escapeHtml(message)}</p></div>
      </div>
    </article>`,
  );
}

function appendTutorMessage(reply, isError = false) {
  const loadingMessage = document.querySelector("#loading-message");
  loadingMessage?.remove();
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row tutor-message">
      <div class="tutor-avatar" aria-hidden="true">F</div>
      <div>
        <span class="speaker">FLUENT TUTOR</span>
        <div class="bubble tutor-bubble${isError ? " error-bubble" : ""}">
          <p>${escapeHtml(reply)}</p>
        </div>
      </div>
    </article>`,
  );
  messages.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
}

function appendLoadingMessage() {
  messages.insertAdjacentHTML(
    "beforeend",
    `<article class="message-row tutor-message" id="loading-message">
      <div class="tutor-avatar" aria-hidden="true">F</div>
      <div>
        <span class="speaker">FLUENT TUTOR</span>
        <div class="bubble tutor-bubble" aria-label="답변 작성 중">
          <span class="loading-dots" aria-hidden="true"><span></span><span></span><span></span></span>
        </div>
      </div>
    </article>`,
  );
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

    if (!response.ok) throw new Error("Chat request failed");
    const data = await response.json();
    appendTutorMessage(data.reply);
  } catch (_error) {
    appendTutorMessage("잠시 연결이 원활하지 않아요. 다시 한번 보내 주세요.", true);
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

document.querySelectorAll(".topic-chip").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.prompt;
    input.focus();
  });
});
