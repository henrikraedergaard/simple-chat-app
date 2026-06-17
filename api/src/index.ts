import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { handleConnect } from "./handlers/handle-connect.js";
import { handleDisconnect } from "./handlers/handle-disconnect.js";
import { handlePong } from "./handlers/handle-pong.js";
import "./tasks/pinging-task.js";
import type { Client } from "./types/client.js";
import type { WsMessage } from "./types/ws-message.js";
import { handleOffer } from "./handlers/handle-offer.js";
import { handleAnswer } from "./handlers/handle-answer.js";
import { handleCandidate } from "./handlers/handle-candidate.js";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

export const clients = new Set<Client>();

app.get(
	"/ws",
	upgradeWebSocket(() => ({
		onOpen(_, ws) {
			handleConnect(ws);
		},

		onMessage(event, ws) {
			const message: WsMessage = JSON.parse(event.data.toString());

			switch (message.type) {
				case "pong":
					handlePong(message);
					break;

				case "candidate":
					handleCandidate(message);
					break;

				case "offer":
					handleOffer(message);
					break;

				case "answer":
					handleAnswer(message);
					break;
			}
		},

		onClose(_, ws) {
			handleDisconnect(ws);
		},
	})),
);

const server = serve({
	fetch: app.fetch,
	port: 3000,
});

injectWebSocket(server);
