import { CLIENT_TIMEOUT, PING_INTERVAL } from "../config/constants.js";
import { clients } from "../index.js";
import type { SessionInitMessage, PingMessage } from "../types/ws-message.js";

setInterval(() => {
	const now = Date.now();

	for (const client of clients) {
		if (now - client.lastSeen >= CLIENT_TIMEOUT) {
			client.ws.close();
			clients.delete(client);

			continue;
		}

		const pingMessage: PingMessage = {
			type: "ping",
		};

		client.ws.send(JSON.stringify(pingMessage));
	}
}, PING_INTERVAL);
