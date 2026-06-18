import type { UUID } from "crypto";

export type ChatMessage = {
	id: UUID;
	from: UUID | string;
	body: string;
};
