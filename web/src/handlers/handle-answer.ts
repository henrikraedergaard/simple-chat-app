import { useChatStore } from "../store/useChatStore";
import type { AnswerMessage } from "../types/ws-message";

export async function handleAnswer(message: AnswerMessage) {
	console.log("Received answer");
	const chat = useChatStore.getState();
	if (!chat.pc) {
		console.warn("Missing pc");
		return;
	}
	await chat.pc.setRemoteDescription(message.answer);
}
