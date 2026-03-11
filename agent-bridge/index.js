const WebSocket = require('ws');

class OpenClawOfficeBridge {
  constructor(url, apiKey, agentId) {
    this.url = url;
    this.apiKey = apiKey;
    this.agentId = agentId;
    this.ws = new WebSocket(this.url);

    this.ws.on('open', () => {
      console.log(`[Bridge] Connected to OpenClaw Office at ${this.url}`);
      // Register agent upon connection
      this.ws.send(JSON.stringify({
        type: 'register',
        agentId: this.agentId
      }));
    });
  }

  // Method to update agent's visual state in the 3D office
  setState(state, logMessage = "") {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'state_update',
        agentId: this.agentId,
        state: state,
        logMessage: logMessage
      }));
    }
  }
}

// --- Usage Example ---
// Assuming .env contains: OPENCLAW_OFFICE_URL=ws://127.0.0.1:19000
const bridge = new OpenClawOfficeBridge('ws://127.0.0.1:19000', 'secret_key', 'Agent-007');

// Simulate agent working process
setTimeout(() => bridge.setState('researching', 'Googling information...'), 2000);
setTimeout(() => bridge.setState('writing', 'Writing a Python script...'), 5000);
setTimeout(() => bridge.setState('executing', 'Running code locally...'), 8000);
setTimeout(() => bridge.setState('idle', 'Task finished. Waiting.'), 11000);
