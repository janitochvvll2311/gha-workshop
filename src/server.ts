import { createHandler } from "./app";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOST ?? "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`PORT inválido: ${process.env.PORT}`);
  process.exit(1);
}

const server = Bun.serve({
  port,
  hostname,
  fetch: createHandler(),
});

console.log(`Chat simulado disponible en http://${hostname}:${server.port}`);
