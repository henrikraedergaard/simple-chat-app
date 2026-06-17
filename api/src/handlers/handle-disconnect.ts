import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type { SessionInitMessage } from "../types/ws-message.js";

export function handleDisconnect(ws: WSContext<WebSocket>) {
	for (const client of clients) {
		if (client.ws === ws) {
			clients.delete(client);
			console.log(`client disconnected`);
		}
	}

	// for (const availableClient of clients) {
	// 	const message: SessionInitMessage = {
	// 		type: "session-init",
	// 		clientId: availableClient.id,
	// 		participants: Array.from(clients).map((client) => client.id),
	// 	};

	// 	availableClient.ws.send(JSON.stringify(message));
	// }
}
