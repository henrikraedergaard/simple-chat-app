import type { UUID } from "crypto";

export type SessionInitMessage = {
	type: "session-init";
	participants: UUID[];
	clientId: UUID;
};

export type PingMessage = {
	type: "ping";
};

export type PongMessage = {
	type: "pong";
	userId: UUID;
};

export type OfferMessage = {
	type: "offer";
	from: UUID;
	to: UUID;
	offer: RTCSessionDescriptionInit;
};

export type AnswerMessage = {
	type: "answer";
	from: UUID;
	to: UUID;
	answer: RTCSessionDescriptionInit;
};

export type CandidateMessage = {
	type: "candidate";
	candidate: RTCIceCandidate;
	from: UUID;
};

export type WsMessage =
	| SessionInitMessage
	| PingMessage
	| PongMessage
	| CandidateMessage
	| OfferMessage
	| AnswerMessage;
