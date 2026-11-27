const form = document.querySelector("#chat-form");
const input = document.querySelector("#message");
const messages = document.querySelector("#messages");
const status = document.querySelector("#status");

if (!form || !input || !messages || !status) {
  throw new Error("No se encontraron los elementos del chat.");
}

const sendButton = form.querySelector("button");

function appendMessage(text, role) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = role === "user" ? "Tú" : "B";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  bubble.append(paragraph);
  article.append(avatar, bubble);
  messages.append(article);
  messages.scrollTop = messages.scrollHeight;
}

async function requestReply(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "No se pudo enviar el mensaje.");
  }

  return data.reply;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  input.value = "";
  input.focus();

  if (sendButton) sendButton.disabled = true;
  status.textContent = "El bot está escribiendo...";

  try {
    const reply = await requestReply(message);
    appendMessage(reply, "bot");
    status.textContent = "";
  } catch (error) {
    appendMessage(
      error instanceof Error ? error.message : "Error inesperado.",
      "bot",
    );
    status.textContent = "No se pudo completar la solicitud.";
  } finally {
    if (sendButton) sendButton.disabled = false;
  }
});
