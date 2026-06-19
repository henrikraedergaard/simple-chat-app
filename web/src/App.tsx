import { XIcon } from "lucide-react";
import { useEffect } from "react";

import ChatTabContent from "./components/chat/ChatTabContent";
import ParticipantsTabContent from "./components/chat/ParticipantsTabContent";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useChatStore } from "./store/useChatStore";

const App = () => {
	const { peers, setupConnection, closeConnection } = useChatStore();

	useEffect(() => {
		setupConnection();

		return () => {
			closeConnection();
		};
	}, [setupConnection, closeConnection]);

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
						defaultValue="chat"
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
							<ParticipantsTabContent />
						</TabsContent>
						<TabsContent
							value="chat"
							className="flex flex-1 min-h-0 flex-col gap-4"
						>
							<ChatTabContent />
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</main>
	);
};

export default App;
