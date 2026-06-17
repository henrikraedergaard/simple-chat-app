import { clients } from "../index.js";
import type { PongMessage } from "../types/ws-message.js";

export function handlePong(message: PongMessage) {
	for (const client of clients) {
		if (client.id === message.userId) {
			console.log("Client ponged");
			client.lastSeen = Date.now();
			break;
		}
	}
}
