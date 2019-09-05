import constants from './constants.js';
import ParentList from './contextTable.js';
import iEl from './iElement.js';
import server from './server.js';

try{
	let mainEl = document.getElementById(constants.generalId);
	let parentLists = [];
	let targetEl;
	server.connection();
	server.onopen();
	mainEl.addEventListener("dblclick", (e)=>{
		console.log(e);
		if(parentLists.length > 0){
			parentLists[0].destroy();
			parentLists = [];
		}
		if(targetEl){
			targetEl.removeListeners();
		}
		let parentList = new ParentList(e.path, e.x, e.y);
		parentLists.push(parentList);
	});
	mainEl.addEventListener("selectEl", (e)=>{
		targetEl = new iEl(e.detail.el);
	});
}catch (err){
	console.warn(err);
}





