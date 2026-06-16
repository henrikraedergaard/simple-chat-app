import { clients } from "../index.js";
import type { DisconnectMessage } from "../types/ws-message.js";

export function handleDisconnect(message: DisconnectMessage) {
	clients.delete(message.userId);
}
