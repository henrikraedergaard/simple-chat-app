import type { UUID } from "crypto";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { handleAnswer } from "./handlers/handle-answer";
import { handleOffer } from "./handlers/handle-offer";
import { handlePing } from "./handlers/handle-ping";
import type { CandidateMessage, WsMessage } from "./types/ws-message";

const App = () => {
	const wsRef = useRef<WebSocket | null>(null);
	const pcRef = useRef<RTCPeerConnection | null>(null);
	const clientIdRef = useRef<UUID | null>(null);
	const participants = useRef<UUID[]>([]);
	const channelRef = useRef<RTCDataChannel | null>(null);
	const [messages, setMessages] = useState<string[]>([]);

	const createOffers = async (clientId: UUID, participants: UUID[]) => {
		if (!pcRef.current) return;
		if (!wsRef.current) return;

		const channel = pcRef.current.createDataChannel("chat");
		channelRef.current = channel;

		channel.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};

		channel.onopen = () => {
			console.log("DATA CHANNEL OPEN");
		};

		channel.onclose = () => {
			console.log("DATA CHANNEL CLOSED");
		};

		channel.onerror = (err) => {
			console.log("DATA CHANNEL ERROR", err);
		};

		const offer = await pcRef.current.createOffer();
		await pcRef.current.setLocalDescription(offer);

		for (const participant of participants) {
			if (participant === clientId) continue;

			wsRef.current.send(
				JSON.stringify({
					type: "offer",
					to: participant,
					from: clientId,
					offer,
				}),
			);
		}
	};

	useEffect(() => {
		if (wsRef.current || pcRef.current) {
			return;
		}

		const ws = new WebSocket("ws://localhost:3000/ws");
		const pc = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		});

		wsRef.current = ws;
		pcRef.current = pc;

		pc.onicecandidate = (event) => {
			if (!event.candidate) return;
			if (!clientIdRef.current) return;

			const message: CandidateMessage = {
				type: "candidate",
				candidate: event.candidate,
				from: clientIdRef.current,
			};
			ws.send(JSON.stringify(message));
		};

		pc.onconnectionstatechange = () => {
			console.log("connection:", pc.connectionState);
		};

		pc.oniceconnectionstatechange = () => {
			console.log("ice:", pc.iceConnectionState);
		};

		pc.onsignalingstatechange = () => {
			console.log("signaling:", pc.signalingState);
		};

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data);

			if (message.type === "session-init") {
				clientIdRef.current = message.clientId;
				participants.current = message.participants;

				createOffers(message.clientId, message.participants);
				return;
			}

			if (message.type === "ping") {
				if (!clientIdRef.current) return;

				handlePing(clientIdRef.current, ws);
				return;
			}

			if (message.type === "candidate") {
				pc.addIceCandidate(new RTCIceCandidate(message.candidate));
			}

			if (message.type === "offer") {
				if (!clientIdRef.current) return;

				handleOffer(pc, message, clientIdRef.current, ws);
				pc.ondatachannel = (event) => {
					channelRef.current = event.channel;

					event.channel.onmessage = (messageEvent) => {
						setMessages((prev) => [...prev, messageEvent.data]);
					};
				};

				return;
			}

			if (message.type === "answer") {
				handleAnswer(pc, message);
				return;
			}
		};

		return () => {
			if (ws.readyState === WebSocket.OPEN) ws.close();
			if (pc.connectionState === "connected") pc.close();
		};
	}, []);

	const sendMessage = () => {
		if (!channelRef.current) return;
		console.log(channelRef.current.readyState);

		channelRef.current.send("Hello from WebRTC!");

		setMessages((prev) => [...prev, "You: Hello from WebRTC!"]);
	};

	return (
		<div>
			<header className="p-4 border-b border-gray-200 flex justify-between">
				<h1 className="font-medium text-lg">Status meeting standup</h1>
				<XIcon />
			</header>

			<main className="p-4">
				<div className="border rounded p-4 h-80 overflow-y-auto mb-4">
					{messages.length === 0 ? (
						<p className="text-gray-500">No messages yet</p>
					) : (
						messages.map((message, index) => (
							<div key={index} className="mb-2">
								{message}
							</div>
						))
					)}
				</div>

				<button
					type="button"
					onClick={sendMessage}
					className="px-4 py-2 bg-black text-white rounded"
				>
					Send Test Message
				</button>
			</main>
		</div>
	);
};

export default App;
