import { useChatStore } from "../store/useChatStore";
import type { CandidateMessage } from "../types/ws-message";
import { createPeerConnection } from "../utils/create-peer-connection";

export function handleCandidate(message: CandidateMessage) {
	console.log("Set candidate");
	const chat = useChatStore.getState();
	let peer = chat.getPeer(message.from);
	if (!peer) {
		peer = createPeerConnection(message.from);
		useChatStore.getState().upsertPeer(peer);
	}

	if (!peer.pc.remoteDescription) {
		peer.pendingCandidates.push(message.candidate);
		return;
	}

	peer.pc.addIceCandidate(new RTCIceCandidate(message.candidate));
}
