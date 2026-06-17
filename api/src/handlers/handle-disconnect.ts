import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type {
	DisconnectMessage,
	SessionInitMessage,
} from "../types/ws-message.js";
import type { Client } from "../types/client.js";

export function handleDisconnect(ws: WSContext<WebSocket>) {
	let oldClient: Client | undefined;

	for (const client of clients) {
		if (client.ws === ws) {
			oldClient = client;
			clients.delete(client);
			console.log(`client disconnected`);
		}
	}

	if (!oldClient) return;

	for (const client of clients) {
		const disconnectMessage: DisconnectMessage = {
			type: "disconnect",
			clientId: oldClient.id,
		};

		client.ws.send(JSON.stringify(disconnectMessage));
	}
}
