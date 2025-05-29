import { createMcpHandler } from '@vercel/mcp-adapter';
import { registerTools } from '../build/tools/register.js';

// Create an MCP server handler using the adapter
const handler = createMcpHandler(async (server) => {
  // Register all Revit tools onto the server
  await registerTools(server);
});

// Export for GET/POST/DELETE so Vercel routes all methods to the handler
export { handler as GET, handler as POST, handler as DELETE }; 