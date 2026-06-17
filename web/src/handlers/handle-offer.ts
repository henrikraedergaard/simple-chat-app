import type { UUID } from "crypto";
import type { AnswerMessage, OfferMessage } from "../types/ws-message";

export async function handleOffer(
	pc: RTCPeerConnection,
	message: OfferMessage,
	clientId: UUID,
	ws: WebSocket,
) {
	await pc.setRemoteDescription(message.offer);

	const answer = await pc.createAnswer();
	await pc.setLocalDescription(answer);

	const response: AnswerMessage = {
		type: "answer",
		from: clientId,
		to: message.from,
		answer: answer,
	};

	ws.send(JSON.stringify(response));
}
