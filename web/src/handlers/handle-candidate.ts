import { useChatStore } from "../store/useChatStore";
import type { CandidateMessage } from "../types/ws-message";

export function handleCandidate(message: CandidateMessage) {
	console.log("Set candidate");
	const chat = useChatStore.getState();
	if (!chat.pc) {
		console.warn("Missing pc");
		return;
	}
	chat.pc.addIceCandidate(new RTCIceCandidate(message.candidate));
}
