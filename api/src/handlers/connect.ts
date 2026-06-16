import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type { ChannelInfoMessage } from "../types/ws-message.js";

export function handleConnect(ws: WSContext<WebSocket>) {
	const userId = crypto.randomUUID();
	clients.set(userId, {
		ws,
		lastSeen: Date.now(),
	});

	const response: ChannelInfoMessage = {
		type: "channel-info",
		participants: clients.size,
		clientId: userId,
	};

	ws.send(JSON.stringify(response));
}
