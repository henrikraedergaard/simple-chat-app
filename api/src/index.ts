import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import type { WSContext } from "hono/ws";
import type { WebSocket as NodeWebSocket } from "ws";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get("/", (c) => c.text("Hello Hono!"));

type Client = {
	ws: WSContext<NodeWebSocket>;
	lastSeen: number;
};

const clients = new Map<string, Client>();

const PING_INTERVAL = 10_000; // 10s
const CLIENT_TIMEOUT = 30_000; // 30s

setInterval(() => {
	const now = Date.now();

	for (const [userId, client] of clients.entries()) {
		if (now - client.lastSeen > CLIENT_TIMEOUT) {
			console.log(`${userId} timed out`);

			client.ws.close();
			clients.delete(userId);

			const response = {
				type: "general-info",
				activeParticipants: clients.size,
			};

			Array.from(clients.entries())
				.filter(([otherUserId]) => otherUserId !== userId)
				.forEach(([_, userWs]) => {
					userWs.ws.send(JSON.stringify(response));
				});

			continue;
		}

		client.ws.send(
			JSON.stringify({
				type: "ping",
			}),
		);
	}
}, PING_INTERVAL);

type WsMessage = {
	type: "connect" | "disconnect" | "message" | "general-info";
};

app.get(
	"/ws",
	upgradeWebSocket(() => ({
		onMessage(event, ws) {
			console.log("Message recieved");
			const message = JSON.parse(event.data.toString());

			if (message.type === "connect") {
				clients.set(message.userId, {
					ws,
					lastSeen: Date.now(),
				});

				console.log(
					`${message.userId} connected. Total clients: ${clients.size}`,
				);

				const response = {
					type: "general-info",
					activeParticipants: clients.size,
				};

				ws.send(JSON.stringify(response));

				return;
			}

			if (message.type === "pong") {
				const client = clients.get(message.userId);

				if (client) {
					client.lastSeen = Date.now();
				}

				return;
			}

			if (message.type === "disconnect") {
				clients.delete(message.userId);

				console.log(
					`${message.userId} disconnected. Total clients: ${clients.size}`,
				);

				return;
			}

			if (message.type === "message") {
				Array.from(clients.entries())
					.filter(([userId]) => userId !== message.userId)
					.forEach(([_, userWs]) => {
						userWs.ws.send(message.message);
					});

				return;
			}
		},

		onClose() {
			console.log("disconnected");
		},
	})),
);

const server = serve({
	fetch: app.fetch,
	port: 3000,
});

injectWebSocket(server);
