import { CLIENT_TIMEOUT, PING_INTERVAL } from "../config/constants.js";
import { clients } from "../index.js";
import type { ChannelInfoMessage } from "../types/ws-message.js";

setInterval(() => {
	const now = Date.now();

	for (const [userId, client] of clients.entries()) {
		if (now - client.lastSeen > CLIENT_TIMEOUT) {
			console.log(`${userId} timed out`);

			client.ws.close();
			clients.delete(userId);

			const response: ChannelInfoMessage = {
				type: "channel-info",
				participants: clients.size,
			};

			Array.from(clients.entries())
				.filter(([otherUserId]) => otherUserId !== userId)
				.forEach(([_, userWs]) => {
					userWs.ws.send(JSON.stringify(response));
				});

			continue;
		}

		client.ws.send(
			JSON.stringify({
				type: "ping",
			}),
		);
	}
}, PING_INTERVAL);
