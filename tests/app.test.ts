import { describe, expect, test } from "bun:test";
import { createHandler } from "../src/app";

const handler = createHandler();

function request(path: string, init?: RequestInit): Promise<Response> {
  return handler(new Request(`http://localhost${path}`, init));
}

function postChat(body: string): Promise<Response> {
  return request("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

describe("GET /api/health", () => {
  test("responde 200 con estado ok", async () => {
    const response = await request("/api/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });
});

describe("POST /api/chat", () => {
  test("devuelve una respuesta para un mensaje válido", async () => {
    const response = await postChat(JSON.stringify({ message: "Hola" }));
    expect(response.status).toBe(200);

    const data = (await response.json()) as { reply: string };
    expect(data.reply).toContain("bot de práctica");
  });

  test("devuelve 400 para un mensaje vacío", async () => {
    const response = await postChat(JSON.stringify({ message: "   " }));
    expect(response.status).toBe(400);

    const data = (await response.json()) as { error: string };
    expect(data.error).toContain("vacío");
  });

  test("devuelve 400 si falta el campo message", async () => {
    const response = await postChat(JSON.stringify({}));
    expect(response.status).toBe(400);
  });

  test("devuelve 400 si message no es texto", async () => {
    const response = await postChat(JSON.stringify({ message: 42 }));
    expect(response.status).toBe(400);
  });

  test("devuelve 400 si el JSON es inválido", async () => {
    const response = await postChat("{");
    expect(response.status).toBe(400);
  });
});

describe("archivos estáticos", () => {
  test("/ sirve la interfaz con cabeceras de seguridad", async () => {
    const response = await request("/");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("content-security-policy")).toContain(
      "default-src 'self'",
    );
    expect(await response.text()).toContain("GHA Workshop");
  });

  test("/app.js sirve el JavaScript del cliente", async () => {
    const response = await request("/app.js");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("javascript");
    expect(await response.text()).toContain("/api/chat");
  });

  test("una ruta desconocida devuelve 404", async () => {
    const response = await request("/no-existe");
    expect(response.status).toBe(404);
  });
});
