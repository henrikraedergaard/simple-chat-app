import { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";

const App = () => {
	const wsRef = useRef<WebSocket | null>(null);

	const [activeParticipants, setActiveParticipants] = useState(0);
	const myUserId = crypto.randomUUID();

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3000/ws");

		ws.onopen = () => {
			console.log("Connected");

			ws.send(
				JSON.stringify({
					type: "connect",
					userId: myUserId,
				}),
			);
		};

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data.toString());

			if (message.type === "general-info") {
				setActiveParticipants(message.activeParticipants);
			}

			if (message.type === "ping") {
				ws.send(
					JSON.stringify({
						type: "pong",
						userId: myUserId,
					}),
				);

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
			ws.close();
		};
	}, [myUserId]);

	return (
		<div>
			<header className="p-4 border-b border-gray-200 flex justify-between">
				<h1 className="font-medium text-lg">Status meeting standup</h1>
				<XIcon />
			</header>

			<main>
				<p>Participants ({activeParticipants})</p>
				<button
					onClick={() => {
						wsRef.current?.send(
							JSON.stringify({
								type: "message",
								userId: myUserId,
								message: "Hello everyone",
							}),
						);
					}}
				>
					Send Message
				</button>
			</main>
		</div>
	);
};

export default App;
