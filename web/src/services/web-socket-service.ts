import type { UUID } from "crypto";
import { handlePing } from "../handlers/handle-ping";
import type { WsMessage } from "../types/ws-message";
import { handleOffer } from "../handlers/handle-offer";
import { handleAnswer } from "../handlers/handle-answer";

export type Connection = {
	clientId: UUID | null;
	ws: WebSocket;
};

export function setupWebSocket() {
	const connection: Connection = {
		clientId: null,
		ws: new WebSocket("ws://localhost:3000/ws"),
	};

	connection.ws.onmessage = (event) => {
		const message: WsMessage = JSON.parse(event.data);

		if (message.type === "session-init") {
			connection.clientId = message.clientId;
			return;
		}

		if (message.type === "ping") {
			if (!connection.clientId) return;

			handlePing(connection.clientId, connection.ws);
			return;
		}

		if (message.type === "offer") {
			if (!connection.clientId) return;

			handleOffer(pc, message, connection.clientId, connection.ws);
			return;
		}

		if (message.type === "answer") {
			handleAnswer(pc, message);
			return;
		}
	};

	return connection;
}
