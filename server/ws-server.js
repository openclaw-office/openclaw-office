const WebSocket = require('ws');

// Set up the WebSocket server on port 19000 as defined in the README
function startWsServer(onAgentUpdate) {
  const wss = new WebSocket.Server({ port: 19000 });
  const connectedAgents = new Map();

  wss.on('connection', (ws, req) => {
    // Basic API Key validation could be implemented here by checking req.headers
    console.log('[WS Server] New connection established.');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        
        // Handle initial registration
        if (data.type === 'register') {
          connectedAgents.set(data.agentId, ws);
          console.log(`[WS Server] Agent ${data.agentId} registered.`);
        }

        // Forward state updates to the UI
        if (data.type === 'state_update' || data.type === 'log') {
          onAgentUpdate(data);
        }
      } catch (err) {
        console.error('[WS Server] Failed to parse message:', err);
      }
    });

    ws.on('close', () => {
      console.log('[WS Server] Connection closed.');
      // Cleanup logic would go here
    });
  });

  console.log('[WS Server] Listening on ws://127.0.0.1:19000');
  return wss;
}

module.exports = { startWsServer };
