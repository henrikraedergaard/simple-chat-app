import { clients } from "../index.js";
import type { CandidateMessage } from "../types/ws-message.js";

export function handleCandidate(message: CandidateMessage) {
	for (const client of clients) {
		if (client.id === message.from) {
			continue;
		}

		console.log("Client sent candidate info");
		client.ws.send(JSON.stringify(message));
	}
}
