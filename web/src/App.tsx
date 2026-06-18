import { SendIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useChatStore } from "./store/useChatStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

const App = () => {
	const {
		messages,
		peers,
		clientId,
		sendMessage,
		setupConnection,
		closeConnection,
	} = useChatStore();

	const [text, setText] = useState("");

	useEffect(() => {
		setupConnection();

		return () => {
			closeConnection();
		};
	}, [setupConnection, closeConnection]);

	const sendHelloMessage = () => {
		sendMessage(text);
		setText("");
	};

	return (
		<main className="bg-gray-100 w-screen h-screen">
			<div className="w-132 absolute top-64 bottom-4 right-4 bg-white rounded-lg flex flex-col overflow-hidden">
				<header className="p-4 border-b w-full border-gray-200 flex justify-between items-center">
					<h1 className="font-medium text-lg">
						Status meeting standup
					</h1>
					<Button variant="ghost" size="icon-lg">
						<XIcon />
					</Button>
				</header>
				<main className="p-4 flex flex-1 min-h-0">
					<Tabs
						defaultValue="participants"
						className="flex flex-1 min-h-0 flex-col"
					>
						<TabsList className="mb-4">
							<TabsTrigger value="participants">
								Participants ({peers.length + 1})
							</TabsTrigger>
							<TabsTrigger value="chat">Chat</TabsTrigger>
						</TabsList>
						<TabsContent
							value="participants"
							className="flex-1 min-h-0"
						>
							<ul className="flex flex-col gap-4">
								<li>{clientId}</li>
								{peers.map((peer) => (
									<li>{peer.id}</li>
								))}
							</ul>
						</TabsContent>
						<TabsContent
							value="chat"
							className="flex flex-1 min-h-0 flex-col gap-4"
						>
							<div className="flex-1 min-h-0 overflow-y-auto">
								{messages.length === 0 ? (
									<p className="text-gray-500">
										No messages yet
									</p>
								) : (
									<ul className="flex flex-col gap-4">
										{messages.map((message, index) => (
											<div key={index}>
												{message.from === "system" ? (
													<div>
														<p className="font-semibold italic">
															{message.body}
														</p>
													</div>
												) : (
													<div>
														<p className="font-semibold">
															{message.from}
														</p>
														<p>{message.body}</p>
													</div>
												)}
											</div>
										))}
									</ul>
								)}
							</div>

							<div className="relative shrink-0">
								<Textarea
									value={text}
									onKeyDown={(event) => {
										if (
											event.key !== "Enter" ||
											event.shiftKey
										) {
											return;
										}

										event.preventDefault();
										sendHelloMessage();
									}}
									onChange={(e) => setText(e.target.value)}
									className="resize-none rounded-sm min-h-24"
									placeholder="Write to everyone"
								></Textarea>
								<Button
									variant="ghost"
									className="absolute bottom-2 right-2"
									size="icon-lg"
									onClick={sendHelloMessage}
								>
									<SendIcon size={1000} />
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</main>
	);
};

export default App;
