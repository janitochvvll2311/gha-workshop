import { describe, expect, test } from "bun:test";
import {
  ChatValidationError,
  MAX_MESSAGE_LENGTH,
  generateReply,
  validateMessage,
} from "../src/chat";

describe("validateMessage", () => {
  test("normaliza espacios al inicio, al final y entre palabras", () => {
    expect(validateMessage("  hola   mundo  ")).toBe("hola mundo");
  });

  test("rechaza mensajes vacíos", () => {
    expect(() => validateMessage("   ")).toThrow(ChatValidationError);
  });

  test("rechaza valores que no son texto", () => {
    expect(() => validateMessage(42)).toThrow(ChatValidationError);
  });

  test("rechaza mensajes demasiado largos", () => {
    expect(() => validateMessage("a".repeat(MAX_MESSAGE_LENGTH + 1))).toThrow(
      ChatValidationError,
    );
  });
});

describe("generateReply", () => {
  test("responde a un saludo", () => {
    expect(generateReply("Hola")).toContain("bot de práctica");
  });

  test("/ayuda lista los comandos disponibles", () => {
    const reply = generateReply("/ayuda");
    expect(reply).toContain("/echo");
    expect(reply).toContain("/chiste");
  });

  test("/chiste devuelve un chiste sobre CI", () => {
    expect(generateReply("/chiste")).toContain("tests");
  });

  test("/quien explica que el bot es simulado", () => {
    const reply = generateReply("¿Quién eres?");
    expect(reply).toContain("bot simulado");
    expect(reply).toContain("deterministas");
  });

  test("/echo conserva el texto original", () => {
    expect(generateReply("/echo Hola CI")).toBe("Hola CI");
  });

  test("/echo sin texto devuelve una ayuda", () => {
    expect(generateReply("/echo")).toContain("Escribe algo");
  });

  test("un mensaje desconocido recibe una respuesta de fallback", () => {
    const reply = generateReply("mensaje sin comando");
    expect(reply).toContain('Recibí: "mensaje sin comando"');
    expect(reply).toContain("simulada");
  });
});
