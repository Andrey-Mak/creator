import constants from './constants.js';

let mainEl = document.getElementById(constants.generalId);

export default class ParentList {
	constructor() {
	//	this.createChildrensList(mainEl);
		this.createTreeElement();
	}

	createTreeElement(){
		this.treeElement = document.createElement("div");
		this.treeElement.id = "DOMTree";
		mainEl.after(this.treeElement);
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
