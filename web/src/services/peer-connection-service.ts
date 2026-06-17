export type Connection = {
	pc: RTCPeerConnection;
};

export function setupPeerConnection() {
	const connection: Connection = {
		pc: new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		}),
	};

	connection.pc.onicecandidate = (event) => {
		if (!event.candidate) return;

		console.log(event.candidate);
	};

	connection.pc.createDataChannel("chat");

	return connection;
}
