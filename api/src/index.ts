import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import type { WebSocket as NodeWebSocket } from "ws";
import { CLIENT_TIMEOUT, PING_INTERVAL } from "./config/constants.js";
import type { ChannelInfoMessage, WsMessage } from "./types/ws-message.js";
import type { Client } from "./types/client.js";
import { handleConnect } from "./handlers/connect.js";
import { handlePong } from "./handlers/pong.js";
import { handleDisconnect } from "./handlers/disconnect.js";
import { handleChat } from "./handlers/chat.js";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

export const clients = new Map<string, Client>();

app.get(
	"/ws",
	upgradeWebSocket(() => ({
		onMessage(event, ws) {
			const message: WsMessage = JSON.parse(event.data.toString());

			if (message.type === "connect") {
				handleConnect(ws);
				return;
			}

			if (message.type === "pong") {
				handlePong(message);
				return;
			}

			if (message.type === "disconnect") {
				handleDisconnect(message);
				return;
			}

			if (message.type === "chat") {
				handleChat(message);
				return;
			}
		},
	})),
);

const server = serve({
	fetch: app.fetch,
	port: 3000,
});

injectWebSocket(server);
