import type { UUID } from "crypto";
import type { PongMessage } from "../types/ws-message";

export function handlePing(clientId: UUID, ws: WebSocket) {
	const response: PongMessage = {
		type: "pong",
		userId: clientId,
	};

	ws.send(JSON.stringify(response));
}
