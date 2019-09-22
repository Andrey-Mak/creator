import constants from './constants.js';
import DOMData from './DOMData.js';
import server from './server.js';

export default class iElement {
	constructor(el) {
		this.el = el;
		this.init();
	}

	init() {
		this.tree_el = document.querySelector(`#tree_${this.el.id}`);
		this.elStyles = this.el.getBoundingClientRect();
		this.isDrug = false;
		this.isPositioned = false;
	//	this.addId();
		this.el.classList.add("target");
		constants.mainEl.classList.add("editing");
		this.tree_el.classList.add("target");
		this.removeClassFromAll("parent-of-target");
		this.updateParents(this.tree_el.parentElement);
		this.addListeners();
		this.addScale();
	}

	removeClassFromAll(className){
		Array.prototype.slice.call(document.querySelectorAll(`.${className}`)).forEach((el)=>{
			el.classList.remove(className);
		})
	}
	updateParents(parent) {
		if(parent && parent.classList.contains("child-el")){
			parent.classList.add("parent-of-target");
			this.updateParents(parent.parentElement)
		}
	}

	addId() {
		if(!this.el.id){
			this.el.id = (this.toCamelCase(this.el.classList[0]) || this.el.tagName.toLocaleLowerCase()) + ++constants.elementsCount;
		}
	}
	updateElData() {
		[].forEach.call(arguments, (property)=>{
			DOMData.addStyle(this.el, property, this.el.style[property]);
	//		constants.elData[this.el.id].styles[property] = this.el.style[property]
		});
		if(arguments.length > 0){
			console.log("updateElData", constants.elData[this.el.id]);
			server.sendData(constants.elData);
		}
	}

	tempPosition(e) {
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
		this.updateElData("position", "top", "left");
	}

	removeListeners() {
		console.log("removed", this.el);
		this.el.onmousedown = null;
		document.onmousemove = null;
		this.el.onmouseup = null;
		this.el.classList.remove("target");
		this.tree_el.classList.remove("target");
		constants.mainEl.classList.remove("editing");
		if(this.scale){
			this.scale.remove();
			this.scale = null;
		}
	}
	addListeners() {
		this.el.onmousedown = (e)=>{
			e.stopPropagation();
			this.elComputedStyle = getComputedStyle(this.el);
			this.elComputedStyleTop = parseInt(this.elComputedStyle.top);
			this.elComputedStyleLeft = parseInt(this.elComputedStyle.left);

			this.elStyles = this.el.getBoundingClientRect();
			this.startX = parseInt(e.offsetX);
			this.startY = parseInt(e.offsetY);

			this.isDrug = true;
		};
		document.onmousemove = (e)=>{
			if(this.isDrug){
				this.tempPosition(e);
				this.isPositioned = false;
			}
		};
		this.el.onmouseup = (e)=>{
			e.stopPropagation();
			this.isDrug = false;
			if(!this.isPositioned) {
				this.setPosition(e);
			}
		}
	}
	addScale(){
		this.scale = document.createElement("div");
		this.scale.className = "element-scale";
		this.el.appendChild(this.scale);
	}
	toCamelCase(text) {
		return text.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
			if (p2) return p2.toUpperCase();
			return p1.toLowerCase();
		});
	};
}

