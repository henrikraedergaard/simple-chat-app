import type { WSContext } from "hono/ws";
import type WebSocket from "ws";
import { clients } from "../index.js";
import type { SessionInitMessage, OfferMessage } from "../types/ws-message.js";

export function handleOffer(message: OfferMessage) {
	for (const client of clients) {
		if (client.id === message.to) {
			// Relay message to recipient
			console.log("Client sent offer");
			client.ws.send(JSON.stringify(message));
		}
	}
}
