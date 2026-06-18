import { XIcon } from "lucide-react";
import { useEffect } from "react";

import { useChatStore } from "./store/useChatStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const App = () => {
	const { messages, peers, sendMessage, setupConnection, closeConnection } =
		useChatStore();

	useEffect(() => {
		setupConnection();

		return () => {
			closeConnection();
		};
	}, [setupConnection, closeConnection]);

	const sendHelloMessage = () => {
		sendMessage("Hello from WebRTC!");
	};

	return (
		<div>
			<header className="p-4 border-b border-gray-200 flex justify-between">
				<h1 className="font-medium text-lg">Status meeting standup</h1>
				<XIcon />
			</header>

			<Tabs defaultValue="account" className="w-100">
				<TabsList>
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					Make changes to your account here.
				</TabsContent>
				<TabsContent value="password">
					Change your password here.
				</TabsContent>
			</Tabs>

			<main className="p-4">
				{peers.map((peer) => peer.id).join(", ")}
				<div className="border rounded p-4 h-80 overflow-y-auto mb-4">
					{messages.length === 0 ? (
						<p className="text-gray-500">No messages yet</p>
					) : (
						messages.map((message, index) => (
							<div key={index} className="mb-2">
								{message.from}
								{": "}
								{message.body}
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
