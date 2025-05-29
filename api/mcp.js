import { createMcpHandler } from '@vercel/mcp-adapter';
import { registerTools } from '../build/tools/register.js';

// Create an MCP server handler using the adapter
const handler = createMcpHandler(async (server) => {
  console.error("MCP handler initialization started");
  console.error("About to call registerTools");
  // Register all Revit tools onto the server
  await registerTools(server);
  console.error("registerTools completed successfully");
});

// Export for GET/POST/DELETE so Vercel routes all methods to the handler
export { handler as GET, handler as POST, handler as DELETE };

export const config = {
  api: {
    bodyParser: false,
  },
}; 