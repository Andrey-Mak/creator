import constants from './constants.js';
import DOMData from './DOMData.js';
import server from './server.js';

export default class iElement {
	constructor(el) {
		this.el = el;
		this.node_el = document.querySelector(`#node_${this.el.id}`);
		this.elStyles = this.el.getBoundingClientRect();
		this.isDrug = false;
		this.isPositioned = false;
		this.addId();
		this.el.classList.add("target");
		this.node_el.classList.add("active");
		this.addListeners();
	}

	addContextMenu(name) {
		this.className = name;
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
		this.updateElData("position", "top", "left");
	}

	removeListeners() {
		console.log("removed", this.el);
		this.el.onmousedown = null;
		document.onmousemove = null;
		this.el.onmouseup = null;
		this.el.classList.remove("target");
		this.node_el.classList.remove("active");
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
				this.updatePosition(e);
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
	toCamelCase(text) {
		return text.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
			if (p2) return p2.toUpperCase();
			return p1.toLowerCase();
		});
	};
}

