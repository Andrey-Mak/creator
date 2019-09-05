import constants from './constants.js';

let mainEl = document.getElementById(constants.generalId);

export default class iElement {
	constructor(el) {
		console.log("iElement", el);
		this.el = el;
		this.elStyles = this.el.getBoundingClientRect();
		this.isDrug = false;
		this.isPositioned = false;
		el.classList.add("target");
		this.addListeners();
	}

	addContextMenu(name) {
		this.className = name;
	}

	addClass(name) {
		this.className = name;
	}

	removeClass(name) {
		this.className = name;
	}

	setLabel(label) {
		this.label = label;
	}

	updatePosition(e) {
		this.el.style.position = 'fixed';
		this.el.style.zIndex = '99';

		this.el.style.top = `${ e.y - this.startY }px`;
		this.el.style.left = `${ e.x - this.startX }px`;
		this.diffY = e.y - this.startY - this.elStyles.top;
		this.diffX = e.x - this.startX - this.elStyles.left;

	}

	setPosition(e) {
		this.el.style.position = 'absolute';
		this.el.style.zIndex = '0';
		this.el.style.top = `${ this.elComputedStyleTop + this.diffY }px`;
		this.el.style.left = `${ this.elComputedStyleLeft + this.diffX }px`;
		this.isPositioned = true;
	}

	removeListeners() {
		console.log("removed", this.el);
		this.el.onmousedown = null;
		this.el.onmousemove = null;
		this.el.onmouseup = null;
	}
	addListeners() {
		this.el.onmousedown = (e)=>{
			e.stopPropagation();
			console.log("onmousedown");
			this.elComputedStyle = getComputedStyle(this.el);
			this.elComputedStyleTop = parseInt(this.elComputedStyle.top);
			this.elComputedStyleLeft = parseInt(this.elComputedStyle.left);

			this.elStyles = this.el.getBoundingClientRect();
			this.startX = parseInt(e.offsetX);
			this.startY = parseInt(e.offsetY);

			this.isDrug = true;
		};
		this.el.onmousemove = (e)=>{
			console.log("onmousemove");
			if(this.isDrug){
				this.updatePosition(e);
				this.isPositioned = false;
			}
		};
		this.el.onmouseup = (e)=>{
			console.log("onmouseup");
			e.stopPropagation();
			this.isDrug = false;
			if(!this.isPositioned) {
				this.setPosition(e);
			}
		}
	}
}

