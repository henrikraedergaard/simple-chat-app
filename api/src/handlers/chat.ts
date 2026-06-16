import { clients } from "../index.js";
import type { ChatMessage } from "../types/ws-message.js";

export function handleChat(message: ChatMessage) {
	Array.from(clients.entries())
		.filter(([userId]) => userId !== message.userId)
		.forEach(([_, userWs]) => {
			userWs.ws.send(message.body);
		});
}
