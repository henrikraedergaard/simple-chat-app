import type { UUID } from "crypto";
import { create } from "zustand";
import { handleAnswer } from "../handlers/handle-answer";
import { handleCandidate } from "../handlers/handle-candidate";
import { handleConnect } from "../handlers/handle-connect";
import { handleDisconnect } from "../handlers/handle-disconnect";
import { handleOffer } from "../handlers/handle-offer";
import { handlePing } from "../handlers/handle-ping";
import { handleSessionInit } from "../handlers/handle-session-init";
import type { Peer } from "../types/peer";
import type { WsMessage } from "../types/ws-message";
import type { ChatMessage } from "../types/chat-message";

interface ChatStore {
	ws?: WebSocket;
	clientId?: UUID;
	peers: Peer[];
	messages: ChatMessage[];
	setupConnection: () => void;
	closeConnection: () => void;
	upsertPeer: (peer: Peer) => void;
	getPeer: (peerId: UUID) => Peer | undefined;
	removePeer: (peerId: UUID) => void;
	sendMessage: (msg: string) => void;
	sendSystemMessage: (msg: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
	ws: undefined,
	clientId: undefined,
	peers: [],
	messages: [],
	upsertPeer: (peer) => {
		set((prev) => ({
			peers: [
				...prev.peers.filter((existing) => existing.id !== peer.id),
				peer,
			],
		}));
	},
	getPeer: (peerId) => get().peers.find((peer) => peer.id === peerId),
	removePeer: (peerId) => {
		set((prev) => ({
			peers: prev.peers.filter((peer) => peer.id !== peerId),
		}));
	},
	setupConnection: () => {
		// Stop setup if there already is a connection
		const existing = get();
		if (existing.ws) {
			console.warn("Skipping conneciton setup. ws already exists");
			return;
		}

		// Setup connection to websocket and peer signaling
		const ws = new WebSocket("ws://localhost:3000/ws");

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data);

			switch (message.type) {
				case "ping":
					handlePing();
					break;

				case "session-init":
					handleSessionInit(message);
					break;

				case "candidate":
					handleCandidate(message);
					break;

				case "offer":
					handleOffer(message);
					break;

				case "answer":
					handleAnswer(message);
					break;

				case "connect":
					handleConnect(message);
					break;

				case "disconnect":
					handleDisconnect(message);
					break;

				default:
					break;
			}
		};

		set(() => ({
			ws,
		}));
	},
	closeConnection: () => {
		const chat = get();

		if (chat.ws && chat.ws.readyState === WebSocket.OPEN) chat.ws.close();

		for (const peer of chat.peers) {
			peer.channel?.close();
			peer.pc.close();
		}
	},
	sendMessage: (msg) => {
		const chat = get();
		if (!chat.peers.length) {
			console.warn("missing peers");
			return;
		}

		if (!chat.clientId) {
			console.warn("Missing clientId");
			return;
		}

		const message: ChatMessage = {
			id: crypto.randomUUID(),
			from: chat.clientId,
			body: msg,
		};

		const messageString = JSON.stringify(message);

		let sent = false;
		for (const peer of chat.peers) {
			if (!peer.channel || peer.channel.readyState !== "open") {
				continue;
			}

			peer.channel.send(messageString);
			sent = true;
		}

		if (!sent) {
			console.warn("no open data channels");
			return;
		}

		set((prev) => ({ messages: [...prev.messages, message] }));
	},
	sendSystemMessage: (msg) => {
		const chat = get();
		if (!chat.peers.length) {
			console.warn("missing peers");
			return;
		}

		if (!chat.clientId) {
			console.warn("Missing clientId");
			return;
		}

		const message: ChatMessage = {
			id: crypto.randomUUID(),
			from: "system",
			body: msg,
		};

		const messageString = JSON.stringify(message);

		let sent = false;
		for (const peer of chat.peers) {
			if (!peer.channel || peer.channel.readyState !== "open") {
				continue;
			}

			peer.channel.send(messageString);
			sent = true;
		}

		if (!sent) {
			console.warn("no open data channels");
			return;
		}

		set((prev) => ({ messages: [...prev.messages, message] }));
	},
}));
