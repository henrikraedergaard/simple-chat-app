import type { UUID } from "crypto";

export type Peer = {
	id: UUID;
	pc: RTCPeerConnection;
	channel?: RTCDataChannel;
	pendingCandidates: RTCIceCandidateInit[];
};
