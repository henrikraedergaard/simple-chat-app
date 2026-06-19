import { useChatStore } from "@/store/useChatStore";
import { PenLineIcon, SendIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import type { UUID } from "crypto";

const ChatTabContent = () => {
	const { messages, clientId, sendMessage, deleteMessage, editMessage } =
		useChatStore();

	const [editingText, setEditingText] = useState("");
	const [editingId, setEditingId] = useState<UUID | null>(null);
	const [text, setText] = useState("");

	const sendHelloMessage = () => {
		sendMessage(text);
		setText("");
	};

	const startEditing = (msgId: UUID) => {
		setEditingId(msgId);
		setEditingText(messages.find((msg) => msg.id === msgId)?.body || "");
	};

	const saveEdit = () => {
		if (!editingId) return;
		editMessage(editingId, editingText);
		cancelEditing();
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingText("");
	};

	return (
		<>
			<div className="flex-1 min-h-0 overflow-y-auto p-1">
				{messages.length === 0 ? (
					<p className="text-gray-500">No messages yet</p>
				) : (
					<ul className="flex flex-col gap-4">
						{messages.map((message, index) => (
							<div key={index}>
								{message.from === "system" ? (
									<div>
										<p className="font-semibold text-gray-500 italic">
											{message.body}
										</p>
									</div>
								) : message.id === editingId ? (
									<div>
										<div className="flex justify-between items-center">
											<p className="font-semibold">
												{message.from}
											</p>
										</div>
										<Textarea
											value={editingText}
											onKeyDown={(event) => {
												if (
													event.key !== "Enter" ||
													event.shiftKey
												) {
													return;
												}

												event.preventDefault();
												saveEdit();
											}}
											onChange={(e) =>
												setEditingText(e.target.value)
											}
											className="resize-none rounded-sm min-h-24"
											placeholder="Write to everyone"
										></Textarea>
										<div className="flex items-center mt-2 gap-2">
											<Button
												variant="ghost"
												onClick={cancelEditing}
											>
												Cancel
											</Button>
											<Button
												variant="ghost"
												onClick={saveEdit}
											>
												Save
											</Button>
										</div>
									</div>
								) : (
									<div>
										<div className="flex justify-between items-center">
											<p className="font-semibold">
												{message.from}
											</p>
											{message.from === clientId && (
												<div className="flex items-center">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															startEditing(
																message.id,
															);
														}}
													>
														<PenLineIcon />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															deleteMessage(
																message.id,
															);
														}}
													>
														<Trash2Icon />
													</Button>
												</div>
											)}
										</div>
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
					id="main-textarea"
					onKeyDown={(event) => {
						if (event.key !== "Enter" || event.shiftKey) {
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
					id="send-button"
					size="icon-lg"
					onClick={sendHelloMessage}
				>
					<SendIcon size={1000} />
				</Button>
			</div>
		</>
	);
};

export default ChatTabContent;
