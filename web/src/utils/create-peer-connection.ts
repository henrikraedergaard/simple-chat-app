import type { UUID } from "crypto";
import { useChatStore } from "../store/useChatStore";
import type { Peer } from "../types/peer";
import type { CandidateMessage } from "../types/ws-message";

export function createPeerConnection(peerId: UUID): Peer {
	const peer: Peer = {
		id: peerId,
		pc: new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		}),
		pendingCandidates: [],
	};

	peer.pc.onicecandidate = (event) => {
		if (!event.candidate) return;

		const chat = useChatStore.getState();
		if (!chat.clientId) {
			console.warn("missing clientId");
			return;
		}
		if (!chat.ws) {
			console.warn("missing ws");
			return;
		}

		const message: CandidateMessage = {
			type: "candidate",
			candidate: event.candidate,
			from: chat.clientId,
		};

		chat.ws.send(JSON.stringify(message));
	};

	return peer;
}
