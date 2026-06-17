import type { AnswerMessage } from "../types/ws-message";

export async function handleAnswer(
	pc: RTCPeerConnection,
	message: AnswerMessage,
) {
	await pc.setRemoteDescription(message.answer);
	console.log("Connection established");
}
