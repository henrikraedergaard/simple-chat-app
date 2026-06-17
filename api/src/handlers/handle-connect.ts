import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type { SessionInitMessage } from "../types/ws-message.js";
import type { Client } from "../types/client.js";

export function handleConnect(ws: WSContext<WebSocket>) {
	const client: Client = {
		id: crypto.randomUUID(),
		lastSeen: Date.now(),
		ws,
	};

	clients.add(client);
	console.log("Client connected");

	const message: SessionInitMessage = {
		type: "session-init",
		clientId: client.id,
		participants: Array.from(clients).map((client) => client.id),
	};

	client.ws.send(JSON.stringify(message));
}
