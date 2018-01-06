import { Component, Renderer2 } from '@angular/core';

import { parserJSON } from './format.json';

@Component({
	selector: 'app-tools-json',
	templateUrl: './json.component.html',
	styleUrls: ['./json.component.less']
})
export class ToolsJsonComponent {

	ImgCollapsed = 'toggle plus';
	ImgExpanded = 'toggle minus';
	dataJSON = '{"F":5,"E":true,"M":"m"}';
	// private dataJSON = '{"F":5,"E":true,"M":"m","Y":[{"F":5,"E":true,"M":"m"},{"F":5,"E":true,"M":"m"}]}';
	jsonCode: string = '';

	typeFlag = true;
	typeText = '显示类型';

	constructor (private renderer: Renderer2) {
	}

	clearSource (element) {
		this.dataJSON = '';
		element.focus();
	}

	traverseChildren (element, func, depth) {
		for (let i = 0; i < element.childNodes.length; i++) {
			this.traverseChildren(element.childNodes[i], func, depth + 1);
		}
		func(element, depth);
	}

	makeContentVisible (element, visible) {
		const img = element.previousSibling.firstChild;
		if (!!img.tagName && img.tagName.toLowerCase() === 'i') {
			element.style.display = visible ? 'inline' : 'none';
			element.previousSibling.firstChild.className = visible ? this.ImgExpanded : this.ImgCollapsed;
		}
	}

	/**
	 * 全部收起
	 */
	collapseAllClicked (element) {
		this.traverseChildren(element, (element) => {
			if (element.className === 'collapsible' || element.className === 'collapsible') {
				this.makeContentVisible(element, false);
			}
		}, 0);
	}

	/**
	 * 全部展开
	 */
	expandAllClicked (element) {
		this.traverseChildren(element, (element) => {
			if (element.className === 'collapsible' || element.className === 'collapsible') {
				this.makeContentVisible(element, true);
			}
		}, 0);
	}

	/**
	 * 展开与收起局部
	 * @param event
	 */
	expandClicked (event) {
		const container = event.target.parentElement.nextSibling;
		if (!container) return;
		let disp = 'none';
		let src = this.ImgCollapsed;
		if (container.style.display === 'none') {
			disp = 'inline';
			src = this.ImgExpanded;
		}
		container.style.display = disp;
		event.target.className = src;
	}

	/**
	 * 全选
	 */
	selectAllClicked (element) {
		if (!this.jsonCode || JSON.stringify(this.jsonCode) === '{}') {
			return;
		}
		this.onFormatJSON(element);
		if (window.getSelection) {
			const range = document.createRange();
			range.selectNode(element);
			window.getSelection().addRange(range);
		}
	}

	/**
	 * 显示隐藏js类型
	 * @type {boolean}
	 */
	onShowType (ele) {
		if (this.typeFlag) {
			this.typeFlag = false;
			this.renderer.addClass(ele, 'js-type');
			this.typeText = '隐藏类型';
		} else {
			this.typeFlag = true;
			this.renderer.removeClass(ele, 'js-type');
			this.typeText = '显示类型';
		}
	}

	/**
	 * 格式化JSON
	 */
	onFormatJSON (element) {
		let value: any = this.dataJSON;
		try {
			if (typeof JSON === 'undefined') {
				alert('您用的浏览器不支持JSON转换，请使用Chrome/FF试试');
				return;
			}
			if (value === '') {
				value = {};
			}
			if (typeof value === 'string') value = JSON.parse(value);
			this.jsonCode = JSON.stringify(value, null, 4);
			// 格式化后的json加入到dom中
			element.innerHTML = parserJSON(value, 0, false, false, false);
			// 添加收起展开事件
			const tags = element.getElementsByTagName('i');
			for (let i = 0; i < tags.length; i++) {
				tags[i].onclick = (event) => {
					this.expandClicked(event);
				};
			}
		} catch (e) {
			alert('JSON数据格式不正确');
		}
	}

}