import type { UUID } from "crypto";
import type { WSContext } from "hono/ws";
import type { WebSocket as NodeWebSocket } from "ws";

export type Client = {
	id: UUID;
	ws: WSContext<NodeWebSocket>;
	lastSeen: number;
};
