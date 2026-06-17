import { clients } from "../index.js";
import type { AnswerMessage } from "../types/ws-message.js";

export function handleAnswer(message: AnswerMessage) {
	for (const client of clients) {
		if (client.id === message.to) {
			// Relay message to recipient
			console.log("Client sent answer");
			client.ws.send(JSON.stringify(message));
		}
	}
}
