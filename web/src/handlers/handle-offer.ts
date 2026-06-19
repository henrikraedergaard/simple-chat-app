import { useChatStore } from "../store/useChatStore";
import type { AnswerMessage, OfferMessage } from "../types/ws-message";
import { createPeerConnection } from "../utils/create-peer-connection";

export async function handleOffer(message: OfferMessage) {
	console.log("Received offer");

	const chat = useChatStore.getState();
	if (!chat.ws || !chat.clientId) {
		console.warn("Missing clientId");
		return;
	}

	let peer = chat.getPeer(message.from);
	if (!peer) {
		peer = createPeerConnection(message.from);
		useChatStore.getState().upsertPeer(peer);
	}

	peer.pc.ondatachannel = (event) => {
		peer.channel = event.channel;

		peer.channel.onmessage = (messageEvent) => {
			const message = JSON.parse(messageEvent.data);

			useChatStore.setState((prev) => ({
				messages: [...prev.messages, message],
			}));
		};

		useChatStore.getState().upsertPeer(peer);
	};

	await peer.pc.setRemoteDescription(message.offer);

	for (const candidate of peer.pendingCandidates) {
		await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
	}
	peer.pendingCandidates = [];

	const answer = await peer.pc.createAnswer();
	await peer.pc.setLocalDescription(answer);

	const response: AnswerMessage = {
		type: "answer",
		from: chat.clientId,
		to: message.from,
		answer: answer,
	};

	chat.ws.send(JSON.stringify(response));
}
