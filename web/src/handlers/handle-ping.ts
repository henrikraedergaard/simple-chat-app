import { useChatStore } from "../store/useChatStore";
import type { PongMessage } from "../types/ws-message";

export function handlePing() {
	console.log("Received ping");

	const chat = useChatStore.getState();

	if (!chat.clientId || !chat.ws) {
		console.warn("missing clientId");
		return;
	}

	const response: PongMessage = {
		type: "pong",
		userId: chat.clientId,
	};

	chat.ws.send(JSON.stringify(response));
}
