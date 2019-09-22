const WebSocket = require("ws");
const fs = require('fs');
const cheerio = require('cheerio');

function updateHTML(HTML){
	const $ = cheerio.load(HTML);
	console.log($('#creator').html());
}

const server = new WebSocket.Server({ port: 3000 });
let css = "";
let oldData = "";
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

fs.readFile('../index.html', 'utf8', function read(err, data) {
	if (err) throw err;
	updateHTML(data);
});

fs.readFile('./data.txt', 'utf8', function read(err, data) {
	if (err) throw err;
	oldData = JSON.parse(data) || "{}";
});

function saveData(data){
	getElementsStyle(JSON.parse(data));
	fs.writeFileSync('../data.css', css || "");
	fs.writeFileSync('./data.txt', JSON.stringify(data) || "{}");
	css = "";
}
console.log("Start server");

server.on("connection", (ws) => {
	ws.send(JSON.stringify(oldData));
	ws.on("message", (message)=> {
		console.log(message);
		server.clients.forEach((client)=>{
			if(client.readyState === WebSocket.OPEN){
				saveData(message);
			}
		})
	});
});



