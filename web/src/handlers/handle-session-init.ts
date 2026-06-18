import { useChatStore, type Peer } from "../store/useChatStore";
import type { OfferMessage, SessionInitMessage } from "../types/ws-message";

export async function handleSessionInit(message: SessionInitMessage) {
	const chat = useChatStore.getState();

	if (!chat.pc || !chat.ws) {
		console.warn("missing pc");
		return;
	}
	console.log(`My id is ${message.clientId}`);

	useChatStore.setState({
		clientId: message.clientId,
	});

	const peers: Peer[] = [];

	for (const participant of message.participants) {
		if (participant === message.clientId) continue;

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
			to: participant,
			from: message.clientId,
			offer,
		};

		chat.ws.send(JSON.stringify(offerMessage));

		peers.push({
			id: participant,
			channel,
		});
	}

	useChatStore.setState({
		peers: peers,
	});
}
