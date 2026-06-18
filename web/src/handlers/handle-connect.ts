import { createPeerConnection } from "../utils/create-peer-connection";
import { useChatStore } from "../store/useChatStore";
import type { ConnectMessage, OfferMessage } from "../types/ws-message";

export async function handleConnect(message: ConnectMessage) {
	const chat = useChatStore.getState();

	if (!chat.ws || !chat.clientId) {
		console.warn("missing ws");
		return;
	}

	const peer = createPeerConnection(message.clientId);
	peer.channel = peer.pc.createDataChannel("chat");

	peer.channel.onmessage = (event) => {
		const message = JSON.parse(event.data);
		useChatStore.setState((prev) => ({
			messages: [...prev.messages, message],
		}));
	};

	useChatStore.getState().upsertPeer(peer);

	const offer = await peer.pc.createOffer();
	await peer.pc.setLocalDescription(offer);

	const offerMessage: OfferMessage = {
		type: "offer",
		to: message.clientId,
		from: chat.clientId,
		offer,
	};

	chat.ws.send(JSON.stringify(offerMessage));
}
