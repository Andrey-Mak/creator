import constants from './constants.js';

let ifLastParent = false;
let mainEl = document.getElementById(constants.generalId);

export default class ParentList {
	constructor(path, x, y) {
		this.parrents = [];
		this.parentList = document.createElement("ol");
		this.parentList.id = constants.parentListId;
		this.parentList.style.cssText = `top: ${y}px; left: ${x}px;`;
		path.forEach((el) => {
			if(el.id !== "creator" && !ifLastParent){
				this.parrents.push(el);
			}else{
				ifLastParent = true;
			}
		});
		this.createParentList();
		mainEl.after(this.parentList);
	}

	createParentEl(el){
		let parentEl = document.createElement("li");
		parentEl.className = "parent-node";
		parentEl.innerHTML = `${el.tagName}#${el.id}.${el.className}`;
		parentEl.onmouseover = ()=>{
			el.classList.add('selected');
		};
		parentEl.onmouseout = ()=>{
			el.classList.remove('selected');
		};
		parentEl.onclick = ()=>{
			let currentEl = el;
			currentEl.classList.remove('selected');
			mainEl.dispatchEvent(new CustomEvent("selectEl", {
				detail: { el }
			}));
			parentEl.onmouseover = null;
			parentEl.onmouseout = null;
			this.destroy();
			return currentEl;
		};
		return parentEl;
	}
	createParentList(){
		let fragment = document.createDocumentFragment();
		console.log(this.parrents);
		this.parrents.forEach((el) => {
			let li = this.createParentEl(el);
			fragment.appendChild(li);
		});
		this.parentList.appendChild(fragment);
	}
	destroy(){
		if(this.parentList){
			this.parentList.remove();
			ifLastParent = false;
		}
	}

}
