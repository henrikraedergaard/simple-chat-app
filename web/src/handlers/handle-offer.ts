import { useChatStore } from "../store/useChatStore";
import type { AnswerMessage, OfferMessage } from "../types/ws-message";

export async function handleOffer(message: OfferMessage) {
	console.log("Received offer");

	const chat = useChatStore.getState();
	if (!chat.ws || !chat.pc || !chat.clientId) {
		console.warn("Missing clientId");
		return;
	}

	chat.pc.ondatachannel = (event) => {
		const channel = event.channel;

		channel.onmessage = (messageEvent) => {
			useChatStore.setState((prev) => ({
				messages: [...prev.messages, messageEvent.data],
			}));
		};

		useChatStore.setState((prev) => ({
			peers: [
				...prev.peers.filter((peer) => peer.id !== message.from),
				{ id: message.from, channel },
			],
		}));
	};

	await chat.pc.setRemoteDescription(message.offer);

	const answer = await chat.pc.createAnswer();
	await chat.pc.setLocalDescription(answer);

	const response: AnswerMessage = {
		type: "answer",
		from: chat.clientId,
		to: message.from,
		answer: answer,
	};

	chat.ws.send(JSON.stringify(response));
}
