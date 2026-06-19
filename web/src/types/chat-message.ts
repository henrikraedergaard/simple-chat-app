import type { UUID } from "crypto";

export type ChatMessage = {
	id: UUID;
	type: "new" | "edit" | "delete";
	from: UUID | string;
	body: string;
};
