import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useChatStore } from "./store/useChatStore";

const App = () => {
	const { messages, peers, ws, pc, sendMessage, setupConnection } =
		useChatStore();

	useEffect(() => {
		setupConnection();

		return () => {
			if (ws && ws.readyState === WebSocket.OPEN) ws.close();
			if (pc && pc.connectionState === "connected") pc.close();
		};
	}, [setupConnection, ws, pc]);

	const sendHelloMessage = () => {
		sendMessage("Hello from WebRTC!");
	};

	return (
		<div>
			<header className="p-4 border-b border-gray-200 flex justify-between">
				<h1 className="font-medium text-lg">Status meeting standup</h1>
				<XIcon />
			</header>

			<main className="p-4">
				{peers.map((peer) => peer.id).join(", ")}
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
					onClick={sendHelloMessage}
					className="px-4 py-2 bg-black text-white rounded"
				>
					Send Test Message
				</button>
			</main>
		</div>
	);
};

export default App;
