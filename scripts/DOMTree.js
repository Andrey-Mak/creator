import constants from './constants.js';

let mainEl = document.getElementById(constants.generalId);
let ifLastParent = false;
export default class ParentList {
	constructor() {
	//	this.createChildrensList(mainEl);
		this.createTreeElement();
	}

	createTreeElement(){
		let treeElement = document.createElement("div");
		treeElement.id = "DOMTree";
		mainEl.after(treeElement);
		this.createChildrensList(constants.elData[constants.generalId], treeElement);
	}
	createChildrensList(el, parentList){
		if(el.childrens){
			let children = el.childrens;
			let ul = document.createElement("ul");
			ul.className = "parent-el";
			parentList.append(ul);
			Object.keys(children).forEach((key) => {
				let childLi = document.createElement("li");
				childLi.className = "child-el";
				childLi.id = `node_${key}`;
				childLi.innerText = key;
				ul.append(childLi);
				this.addInteractive(childLi, key);
				this.createChildrensList(children[key], childLi);
			});
		}
	}
	addInteractive(el, shadowEl){
		let shadowElement = document.querySelector(`#${shadowEl}`);
		let isDruggable = false;
		el.onmouseover = () => {
			shadowElement.classList.add("over");
		};
		el.onmouseout = () => {
			shadowElement.classList.remove("over");
		};
		el.onclick = () => {
			mainEl.dispatchEvent(new CustomEvent("selectEl", {
				detail: { el: shadowElement }
			}));
		};
		el.onmousedown = () => {
			isDruggable = true;
		}
	}
	destroy(){
		if(this.parentList){
			this.parentList.remove();
			ifLastParent = false;
		}
	}

}
