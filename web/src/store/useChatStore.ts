import type { UUID } from "crypto";
import { create } from "zustand";
import { handleAnswer } from "../handlers/handle-answer";
import { handleCandidate } from "../handlers/handle-candidate";
import { handleOffer } from "../handlers/handle-offer";
import { handlePing } from "../handlers/handle-ping";
import { handleSessionInit } from "../handlers/handle-session-init";
import type { CandidateMessage, WsMessage } from "../types/ws-message";

export type Peer = {
	id: UUID;
	channel: RTCDataChannel;
};

interface ChatStore {
	ws?: WebSocket;
	pc?: RTCPeerConnection;
	clientId?: UUID;
	peers: Peer[];
	messages: string[];
	setupConnection: () => void;
	sendMessage: (msg: string) => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
	ws: undefined,
	pc: undefined,
	clientId: undefined,
	peers: [],
	messages: [],
	setupConnection: () => {
		// Stop setup if there already is a connection
		const existing = get();
		if (existing.ws || existing.pc) {
			console.warn("Skipping conneciton setup. ws or pc already exist");
			return;
		}

		// Setup conneciton to websocket and peer-connection
		const ws = new WebSocket("ws://localhost:3000/ws");
		const pc = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		});

		pc.onicecandidate = (event) => {
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
					// handleConnect(message);
					console.log("Connected");
					break;

				case "disconnect":
					console.log("Disconnected");
					break;

				default:
					break;
			}
		};

		set(() => ({
			ws,
			pc,
		}));
	},
	sendMessage: (msg) => {
		const chat = get();
		if (!chat.peers) {
			console.warn("missing peers");
			return;
		}
		console.log(chat.peers.length);

		for (const peer of chat.peers) {
			console.log("Send message to peer");
			console.log(peer.id);
			peer.channel.send("Hello from WebRTC!");
		}

		set((prev) => ({ messages: [...prev.messages, msg] }));
	},
}));
