import { useChatStore, type Peer } from "../store/useChatStore";
import type { ConnectMessage, OfferMessage } from "../types/ws-message";

export async function handleConnect(message: ConnectMessage) {
	const chat = useChatStore.getState();

	if (!chat.pc || !chat.ws || !chat.clientId) {
		console.warn("missing pc");
		return;
	}

	const channel = chat.pc.createDataChannel("chat");

	channel.onmessage = (event) => {
		useChatStore.setState((prev) => ({
			messages: [...prev.messages, event.data],
		}));
	};

	const offer = await chat.pc.createOffer();
	await chat.pc.setLocalDescription(offer);

	const offerMessage: OfferMessage = {
		type: "offer",
		to: message.clientId,
		from: chat.clientId,
		offer,
	};

	chat.ws.send(JSON.stringify(offerMessage));

	const newPeer: Peer = {
		id: message.clientId,
		channel,
	};

	useChatStore.setState((prev) => ({
		peers: [...prev.peers, newPeer],
	}));
}
