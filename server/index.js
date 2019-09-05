const WebSocket = require("ws");
const fs = require('fs');


const server = new WebSocket.Server({ port: 3000 });
function getCSSStyle(data){
	let css = "";
	let styles = JSON.parse(data);
	Object.keys(styles).forEach((key)=>{
		css += `
		#${key} {`;
		let propertys = styles[key].styles;
		if(propertys && Object.keys(propertys).length){
			Object.keys(propertys).forEach((property)=>{
				css += `
			${property}: ${propertys[property]};`;
			});
			css += `
			}`;
		}
	});
	return css;
}
function saveData(data){
	fs.writeFileSync('../data.css', getCSSStyle(data));
}
console.log("Start server");

server.on("connection", (ws) => {
	ws.on("message", (message)=> {
		console.log(message);
		server.clients.forEach((client)=>{
			if(client.readyState === WebSocket.OPEN){
				saveData(message);
			}
		})
	});
});



