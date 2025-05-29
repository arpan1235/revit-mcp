import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { registerTools } from "../build/tools/register.js";

// In-memory map of sessionId → { transport, server }
const sessions = new Map();

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.searchParams.get("sessionId");

  if (req.method === "GET") {
    // SSE handshake
    const transport = new SSEServerTransport("/api/sse", res);
    const server = new McpServer({ name: "revit-mcp", version: "1.0.0" });
    await registerTools(server);
    await server.connect(transport);
    sessions.set(transport.sessionId, { transport, server });
    transport.onclose = () => sessions.delete(transport.sessionId);

  } else if (req.method === "POST") {
    // Client POSTs messages here
    if (!sessionId || !sessions.has(sessionId)) {
      res.statusCode = 404; res.end("Session not found");
      return;
    }
    const { transport } = sessions.get(sessionId);
    await transport.handlePostMessage(req, res);

  } else {
    res.setHeader("Allow", "GET,POST");
    res.statusCode = 405; res.end();
  }
} 