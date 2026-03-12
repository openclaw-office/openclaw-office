/**
 * All possible states of an AI Agent in the virtual office
 */
export type AgentStatus = 'idle' | 'researching' | 'writing' | 'executing' | 'syncing' | 'error';

/**
 * Available environment visual styles
 */
export type ThemeType = 'medieval' | 'modern' | 'cyberpunk';

/**
 * Main Agent interface representing its state and metadata
 */
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  position: [number, number, number];
  lastLog: string;
  tokensUsed: number;
  costUSD: number;
  model: string;
}

/**
 * WebSocket message structure for communication
 */
export interface BridgeMessage {
  type: 'TELEMETRY' | 'COMMAND' | 'AUTH';
  agentId?: string;
  payload: any;
}
