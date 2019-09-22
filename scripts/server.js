

function server(){
	let socket = {};
	let ws;
	ws = new WebSocket("ws://127.0.0.1:3000");

	socket.onopen = function() {
		ws.onopen = (e)=>{
			console.log("[open] Соединение установлено");
		}
	};

	socket.onmessage = function() {
		ws.onmessage = (e)=> {
			console.log(`[message] Данные получены с сервера: ${e.data}`);
			return JSON.parse(e.data);
		};
	};

	socket.sendData = function(data){
		ws.send(JSON.stringify(data));
	};

	socket.onclose = function(event) {
		if (event.wasClean) {
			console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
		} else {
			console.warn('[close] Соединение прервано');
		}
	};

	socket.onerror = function(error) {
		console.err(`[error] ${error.message}`);
	};
	return socket
}

export default server();