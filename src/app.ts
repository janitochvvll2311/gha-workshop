import { ChatValidationError, generateReply, validateMessage } from "./chat";

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; script-src 'self'; style-src 'self'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

const STATIC_FILES: Record<string, { file: string; type: string }> = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/app.js": { file: "app.js", type: "text/javascript; charset=utf-8" },
  "/styles.css": { file: "styles.css", type: "text/css; charset=utf-8" },
  "/favicon.svg": { file: "favicon.svg", type: "image/svg+xml" },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function createHandler(): (request: Request) => Promise<Response> {
  const publicDir = new URL("../public/", import.meta.url);

  return async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({ status: "ok" });
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const payload: unknown = await request.json();

        if (
          typeof payload !== "object" ||
          payload === null ||
          !("message" in payload)
        ) {
          throw new ChatValidationError(
            "El cuerpo debe incluir el campo message.",
          );
        }

        const message = validateMessage(
          (payload as { message: unknown }).message,
        );

        return json({ reply: generateReply(message) });
      } catch (error) {
        if (error instanceof ChatValidationError || error instanceof SyntaxError) {
          return json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Solicitud inválida.",
            },
            400,
          );
        }

        console.error("Error inesperado en /api/chat", error);
        return json({ error: "Error interno del servidor." }, 500);
      }
    }

    const entry = STATIC_FILES[url.pathname];

    if (request.method === "GET" && entry) {
      const file = Bun.file(new URL(entry.file, publicDir));

      if (!(await file.exists())) {
        return json({ error: "Archivo no encontrado." }, 404);
      }

      return new Response(file, {
        headers: {
          ...SECURITY_HEADERS,
          "Content-Type": entry.type,
        },
      });
    }

    return json({ error: "Ruta no encontrada." }, 404);
  };
}
