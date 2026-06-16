import type { WSContext } from "hono/ws";
import type { WebSocket as NodeWebSocket } from "ws";

export type Client = {
	ws: WSContext<NodeWebSocket>;
	lastSeen: number;
};
