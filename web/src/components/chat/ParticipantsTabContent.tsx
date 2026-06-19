import { useChatStore } from "@/store/useChatStore";

const ParticipantsTabContent = () => {
	const { clientId, peers } = useChatStore();

	return (
		<ul className="flex flex-col gap-4">
			<li>{clientId}</li>
			{peers.map((peer) => (
				<li>{peer.id}</li>
			))}
		</ul>
	);
};

export default ParticipantsTabContent;
