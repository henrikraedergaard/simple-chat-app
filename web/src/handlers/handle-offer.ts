import type { ChatMessage } from "@/types/chat-message";
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
			const message: ChatMessage = JSON.parse(messageEvent.data);

			switch (message.type) {
				case "new":
					useChatStore.setState((prev) => ({
						messages: [...prev.messages, message],
					}));
					break;

				case "delete":
					useChatStore.setState((prev) => ({
						messages: prev.messages.filter(
							(chat) => chat.id !== message.id,
						),
					}));
					break;

				case "edit":
					useChatStore.setState((prev) => ({
						messages: prev.messages.map((chat) => {
							if (chat.id === message.id) {
								return {
									...chat,
									body: message.body,
								};
							}
							return chat;
						}),
					}));
					break;
			}
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
