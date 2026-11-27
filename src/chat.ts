export const MAX_MESSAGE_LENGTH = 500;

export class ChatValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatValidationError";
  }
}

export function validateMessage(input: unknown): string {
  if (typeof input !== "string") {
    throw new ChatValidationError("El mensaje debe ser texto.");
  }

  const message = input.trim().replace(/\s+/g, " ");

  if (message.length === 0) {
    throw new ChatValidationError("El mensaje no puede estar vacío.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new ChatValidationError(
      `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres.`,
    );
  }

  return message;
}

export function generateReply(message: string): string {
  const normalized = message.trim();
  const lower = normalized.toLocaleLowerCase("es");

  if (lower === "/ayuda" || lower === "ayuda") {
    return "Comandos disponibles: /ayuda, /chiste, /quien y /echo <texto>. También puedes saludar.";
  }

  if (lower === "/chiste" || lower === "chiste") {
    return "¿Por qué el CI estaba tranquilo? Porque todos los tests estaban en verde.";
  }

  if (
    lower === "/quien" ||
    lower === "quien" ||
    lower.includes("quién eres") ||
    lower.includes("quien eres")
  ) {
    return "Soy un bot simulado del taller de GitHub Actions. No uso una IA real: mis respuestas son deterministas para que los tests sean reproducibles.";
  }

  if (/^(hola|buenas|hey|qué tal|que tal)\b/.test(lower)) {
    return "¡Hola! Soy el bot de práctica. Escribe /ayuda para ver qué puedo hacer.";
  }

  if (lower === "/echo") {
    return "Escribe algo después de /echo.";
  }

  if (lower.startsWith("/echo ")) {
    const text = normalized.slice("/echo ".length).trim();
    return text.length > 0 ? text : "Escribe algo después de /echo.";
  }

  return `Recibí: "${normalized}". Esta respuesta es simulada; el objetivo es practicar CI, no conversar con una IA.`;
}
