import { createServer } from "http";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import { setupWebSocket } from "./websocket/chatSocket.js";

async function main() {
  await connectDB();

  const server = createServer(app);
  setupWebSocket(server);

  server.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
