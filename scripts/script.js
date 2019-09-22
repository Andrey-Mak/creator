import constants from './constants.js';
import ParentsList from './parentsList.js';
import DOMTree from './DOMTree.js';
import DOMData from './DOMData.js';
import iEl from './iElement.js';
import server from './server.js';

async function startCreator(){
	try{
		let mainEl = document.getElementById(constants.generalId);
		constants.mainEl = mainEl;
		let parentLists = [];
		let targetEl;
		server.onopen();
		let serverData = server.onmessage();
		constants.elData = serverData || {};
		mainEl.firstElementChild.id = "wrapper";
		DOMData.init(mainEl);
		let tree = new DOMTree();

		mainEl.addEventListener("dblclick", (e)=>{
			if(parentLists.length > 0){
				parentLists[0].destroy();
				parentLists = [];
			}
			if(targetEl){
				targetEl.removeListeners();
			}
			console.log("dblclick", e);
			console.log("dblclick", e.path);
			
			let targetPath = e.path.filter((el) => el.id && el.id !== "wrapper");
			console.log("firstId", targetPath);
			if(targetPath && targetPath[0] !== constants.generalId){
				let parentList = new ParentsList(targetPath, e.x, e.y);
				parentLists.push(parentList);
			}

		});
		mainEl.addEventListener("click", (e)=>{
			if(parentLists.length > 0){
				parentLists[0].destroy();
				parentLists = [];
			}
		});
		mainEl.addEventListener("selectEl", (e)=>{
			console.log(e);
			if(targetEl){
				targetEl.removeListeners();
			}
			targetEl = new iEl(e.detail.el);
		});
	}catch (err){
		console.warn(err);
	}
}
window.onload = setTimeout(()=>{
	startCreator();
}, 300);
