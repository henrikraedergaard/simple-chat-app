export type ConnectMessage = {
	type: "connect";
};

export type DisconnectMessage = {
	type: "disconnect";
	userId: string;
};

export type ChatMessage = {
	type: "chat";
	body: string;
	userId: string;
};

export type ChannelInfoMessage = {
	type: "channel-info";
	participants: number;
	clientId: string;
};

export type PingMessage = {
	type: "ping";
};

export type PongMessage = {
	type: "pong";
	userId: string;
};

export type WsMessage =
	| ConnectMessage
	| DisconnectMessage
	| ChatMessage
	| ChannelInfoMessage
	| PingMessage
	| PongMessage;
