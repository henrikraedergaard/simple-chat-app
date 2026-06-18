import { useChatStore } from "../store/useChatStore";
import type { SessionInitMessage } from "../types/ws-message";

export async function handleSessionInit(message: SessionInitMessage) {
	const chat = useChatStore.getState();

	if (!chat.ws) {
		console.warn("missing ws");
		return;
	}

	useChatStore.setState({
		clientId: message.clientId,
	});
}
