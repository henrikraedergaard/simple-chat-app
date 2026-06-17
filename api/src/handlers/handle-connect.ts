import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type {
	ConnectMessage,
	SessionInitMessage,
} from "../types/ws-message.js";
import type { Client } from "../types/client.js";

export function handleConnect(ws: WSContext<WebSocket>) {
	const newClient: Client = {
		id: crypto.randomUUID(),
		lastSeen: Date.now(),
		ws,
	};

	clients.add(newClient);
	console.log("Client connected");

	const message: SessionInitMessage = {
		type: "session-init",
		clientId: newClient.id,
		participants: Array.from(clients).map((client) => client.id),
	};

	newClient.ws.send(JSON.stringify(message));

	for (const client of clients) {
		if (client.id === newClient.id) continue;

		const connectMessage: ConnectMessage = {
			type: "connect",
			clientId: newClient.id,
		};

		client.ws.send(JSON.stringify(connectMessage));
	}
}
