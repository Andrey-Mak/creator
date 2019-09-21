import constants from './constants.js';

let mainEl = document.getElementById(constants.generalId);
let ifLastParent = false;
export default class ParentList {
	constructor() {
	//	this.createChildrensList(mainEl);
		this.createTreeElement();
	}
	updateTree(){

	}
	createTreeElement(){
		this.treeElement = document.createElement("div");
		this.treeElement.id = "DOMTree";
		mainEl.after(this.treeElement);
		this.createChildrensList(constants.elData[constants.generalId], this.treeElement);
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
				childLi.id = `tree_${key}`;
				childLi.innerText = key;
				ul.append(childLi);
				this.addInteractive(childLi, key);
				this.createChildrensList(children[key], childLi);
			});
		}
	}
	removeDruggable(el){
		el.onmousedown = null;
		this.treeElement.onmousemove = null;
		this.treeElement.onmouseup = null;
	}
	addDruggable(el){
		el.onmousedown = (e)=>{
			e.stopPropagation();
			clearTimeout(this.timer);
			this.timer = setTimeout(()=>{
				this.elComputedStyle = getComputedStyle(el);
				this.elComputedStyleTop = parseInt(this.elComputedStyle.top);
				this.elComputedStyleLeft = parseInt(this.elComputedStyle.left);

				this.elStyles = el.getBoundingClientRect();
				this.startX = parseInt(e.offsetX);
				this.startY = parseInt(e.offsetY);

				this.isDrug = true;
			}, 500);
		};
		this.treeElement.onmousemove = (e)=>{
			if(this.isDrug){
				el.style.position = 'fixed';
				el.style.zIndex = '99';
				el.style.pointerEvents = 'none';

				el.style.top = `${ e.y - this.startY }px`;
				el.style.left = `${ e.x - this.startX }px`;
			}
		};
		this.treeElement.onmouseup = (e)=>{
			if(this.isDrug){
				let realEl = mainEl.querySelector(`#${el.id.replace("tree_", "")}`);
				let realElTarget = mainEl.querySelector(`#${this.targetNode.id.replace("tree_", "")}`);
				if(realEl && realElTarget){
					this.targetNode.appendChild(el);
					realElTarget.appendChild(realEl);
				}
				el.style.pointerEvents = 'auto';
				el.style.position = 'relative';
				el.style.top = "0";
				el.style.left = "0";
			}
			this.isDrug = false;
			clearTimeout(this.timer);
		}
	}
	addInteractive(el, shadowEl){
		let shadowElement = document.querySelector(`#${shadowEl}`);
		el.onmouseover = (e) => {
			shadowElement.classList.add("over");
			if(this.isDrug){
				this.targetNode = e.target;
				console.log("target-node", e.target);
			}else{
				this.addDruggable(e.target);
			}
		};
		el.onmouseout = () => {
			clearTimeout(this.timer);
			this.targetNode = null;
			shadowElement.classList.remove("over");
		};
		el.onclick = (e) => {
			e.stopPropagation();
			mainEl.dispatchEvent(new CustomEvent("selectEl", {
				detail: { el: shadowElement }
			}));
		};
	}
	destroy(){
		if(this.parentList){
			this.parentList.remove();
			ifLastParent = false;
		}
	}

}
