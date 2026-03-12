import { WebSocketServer, WebSocket } from 'ws';
import { BridgeMessage } from '../shared/types';

const PORT = 19000;
const wss = new WebSocketServer({ port: PORT });

// Set to track active dashboard (frontend) connections
const dashboardClients = new Set<WebSocket>();

console.log(`🌌 OpenClaw Bridge active on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('New connection established');

  ws.on('message', (data) => {
    try {
      const message: BridgeMessage = JSON.parse(data.toString());

      // If the message is telemetry from an agent, broadcast it to all dashboards
      if (message.type === 'TELEMETRY') {
        broadcastToDashboards(message);
      }
      
      // Handle frontend registration as a dashboard client
      if (message.type === 'AUTH' && message.payload.role === 'dashboard') {
        dashboardClients.add(ws);
      }
    } catch (err) {
      console.error('Failed to parse message:', err);
    }
  });

  ws.on('close', () => {
    dashboardClients.delete(ws);
    console.log('Connection closed');
  });
});

/**
 * Sends data to all connected frontend instances
 */
function broadcastToDashboards(data: BridgeMessage) {
  const payload = JSON.stringify(data);
  dashboardClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
