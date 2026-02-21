import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { sendMessage, processAudio } from "../services/gemini.js";

export function setupWebSocket(server: Server): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const match = url.pathname.match(/^\/ws\/chat\/(.+)$/);

    if (match) {
      const sessionId = match[1];
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, sessionId);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws: WebSocket, sessionId: string) => {
    ws.on("message", async (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "text") {
          const result = await sendMessage(sessionId, msg.content);
          ws.send(
            JSON.stringify({
              type: "text_response",
              content: result.response,
              structured_data: result.structuredData || undefined,
            })
          );
        } else if (msg.type === "audio") {
          const result = await processAudio(sessionId, msg.content);
          ws.send(
            JSON.stringify({
              type: "voice_response",
              transcribed_text: result.transcribed,
              content: result.response,
              structured_data: result.structuredData || undefined,
            })
          );
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
        ws.send(
          JSON.stringify({
            type: "error",
            content: "Failed to process message",
          })
        );
      }
    });
  });
}
