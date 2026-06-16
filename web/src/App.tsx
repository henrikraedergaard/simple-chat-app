import { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import type {
	ChatMessage,
	ConnectMessage,
	DisconnectMessage,
	PongMessage,
	WsMessage,
} from "./types/ws-message";

const App = () => {
	const wsRef = useRef<WebSocket | null>(null);

	const [clientId, setClientId] = useState("");
	const [participants, setParticipants] = useState(0);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3000/ws");

		ws.onopen = () => {
			const message: ConnectMessage = {
				type: "connect",
			};

			ws.send(JSON.stringify(message));
		};

		ws.onmessage = (event) => {
			const message: WsMessage = JSON.parse(event.data.toString());

			if (message.type === "channel-info") {
				setParticipants(message.participants);
				setClientId(message.clientId);
				return;
			}

			if (message.type === "ping") {
				const response: PongMessage = {
					type: "pong",
					userId: "some-user-id",
				};

				ws.send(JSON.stringify(response));
				return;
			}
		};

		ws.onclose = () => {
			console.log("Disconnected");
		};

		ws.onerror = (error) => {
			console.error(error);
		};

		wsRef.current = ws;

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				const message: DisconnectMessage = {
					type: "disconnect",
					userId: "my-user-id",
				};
				ws.send(JSON.stringify(message));
				ws.close();
			}
		};
	}, []);

	function sendMessage() {
		const message: ChatMessage = {
			type: "chat",
			userId: clientId,
			body: "Hello everyone",
		};
		wsRef.current?.send(JSON.stringify(message));
	}

	return (
		<div>
			<header className="p-4 border-b border-gray-200 flex justify-between">
				<h1 className="font-medium text-lg">Status meeting standup</h1>
				<XIcon />
			</header>

			<main>
				<p>Participants ({participants})</p>
				<button onClick={() => sendMessage()}>Send Message</button>
			</main>
		</div>
	);
};

export default App;
