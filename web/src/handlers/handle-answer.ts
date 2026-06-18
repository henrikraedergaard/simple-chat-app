import { useChatStore } from "../store/useChatStore";
import type { AnswerMessage } from "../types/ws-message";

export async function handleAnswer(message: AnswerMessage) {
	console.log("Received answer");
	const chat = useChatStore.getState();
	const peer = chat.getPeer(message.from);
	if (!peer) {
		console.warn("Missing peer");
		return;
	}
	await peer.pc.setRemoteDescription(message.answer);

	for (const candidate of peer.pendingCandidates) {
		await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
	}
	peer.pendingCandidates = [];
}
