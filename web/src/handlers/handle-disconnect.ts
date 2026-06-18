import { useChatStore } from "../store/useChatStore";
import type { DisconnectMessage } from "../types/ws-message";

export function handleDisconnect(message: DisconnectMessage) {
	useChatStore.setState((prev) => ({
		peers: prev.peers.filter((val) => val.id !== message.clientId),
	}));
}
