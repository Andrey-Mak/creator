	let css = "";
function getElementsStyle(elements){
	Object.keys(elements).forEach((key)=>{
		let propertys = elements[key].styles;
		let children = elements[key].childrens;
		if(propertys && Object.keys(propertys).length){
			css += `
	#${key} {`;
			Object.keys(propertys).forEach((property)=>{
				css += `
		${property}: ${propertys[property]};`;
			});
			css += `
		}`;
		}
		if(children){
			getElementsStyle(children);
		}
	});
}

function server(){
	let socket = {};
	let ws;
	socket.connection = function() {
		ws = new WebSocket("ws://127.0.0.1:3000");
	};
	socket.onopen = function() {
		ws.onopen = (e)=>{
			console.log("[open] Соединение установлено");
		}
	};

	socket.onmessage = function(event) {
		ws.onmessage = (e)=> {
			console.log(`[message] Данные получены с сервера: ${event.data}`);
		}
	};

	socket.sendData = function(data){
		getElementsStyle(data);
		console.log("send Data", css);
		ws.send(css);
		css = "";
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