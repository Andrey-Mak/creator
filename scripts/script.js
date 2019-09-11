import constants from './constants.js';
import ParentsList from './parentsList.js';
import DOMTree from './DOMTree.js';
import DOMData from './DOMData.js';
import iEl from './iElement.js';
import server from './server.js';

try{
	let mainEl = document.getElementById(constants.generalId);
	let parentLists = [];
	let targetEl;
	server.connection();
	server.onopen();
	DOMData.init(mainEl);
	mainEl.addEventListener("dblclick", (e)=>{
		let tree = new DOMTree();
		if(parentLists.length > 0){
			parentLists[0].destroy();
			parentLists = [];
		}
		if(targetEl){
			targetEl.removeListeners();
		}
		let parentList = new ParentsList(e.path, e.x, e.y);
		parentLists.push(parentList);
	});
	mainEl.addEventListener("selectEl", (e)=>{
		targetEl = new iEl(e.detail.el);
	});
}catch (err){
	console.warn(err);
}





