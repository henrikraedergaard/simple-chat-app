import type { UUID } from "crypto";

export type ChatMessage = {
	id: UUID;
	from: UUID;
	body: string;
};
