import { clients } from "../index.js";
import type { PongMessage } from "../types/ws-message.js";

export function handlePong(message: PongMessage) {
	const client = clients.get(message.userId);

	if (client) {
		client.lastSeen = Date.now();
	}
}
