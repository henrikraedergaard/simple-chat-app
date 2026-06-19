import { useChatStore } from "../store/useChatStore";
import type { DisconnectMessage } from "../types/ws-message";

export function handleDisconnect(message: DisconnectMessage) {
	const chat = useChatStore.getState();
	const peer = chat.getPeer(message.clientId);
	peer?.channel?.close();
	peer?.pc.close();
	chat.removePeer(message.clientId);

	useChatStore.setState((prev) => ({
		messages: [
			...prev.messages,
			{
				id: crypto.randomUUID(),
				type: "new",
				body: `${message.clientId} left!`,
				from: "system",
			},
		],
	}));
}
