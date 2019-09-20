import constants from './constants.js';

let currentEl;
function createChildrensList(el, target){
	let children;
	if (!target && el.id && !constants.elData[el.id]) {
		constants.elData[el.id] = {};
		target = constants.elData[el.id];
	}
	if(el && el.id && el.children){
		children = Array.from(el.children);
	}
	if(el.id && children && children.length > 0) {
		target.childrens = {};
		children.forEach((child) => {
			if(child.id){
				target.childrens[child.id] = {};
				createChildrensList(child, target.childrens[child.id]);
			}
		});
	}
}

function findElObj(el, position = constants.elData[constants.generalId].childrens, path = ""){
	if(!currentEl){
		let keys = Object.keys(position);
		let currentObj;
		for(let i = 0; keys.length > i; i++){
			if(keys[i] !== el.id && position[keys[i]].childrens){
				findElObj(el, position[keys[i]].childrens, path + keys[i] + "/")
			}else if(el.id && keys[i] === el.id){
				currentObj = position[keys[i]];
				currentEl = currentObj;
				break
			}
		}
		return currentObj;
	}
}

export default {
	init: (el, target = false) => {
		createChildrensList(el, target);
		console.log(constants.elData);
	},
	addStyle: (el, property, value)=> {
		currentEl = false;
		findElObj(el);
		if(currentEl && !currentEl.styles){
			currentEl.styles = {};
		}
		currentEl.styles[property] = value;
	}
}