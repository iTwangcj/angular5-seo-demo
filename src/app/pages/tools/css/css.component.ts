import { Component } from '@angular/core';
import { parserCSS } from './format.css';

@Component({
	selector: 'app-tools-css',
	templateUrl: './css.component.html',
	styleUrls: ['./css.component.less']
})
export class ToolsCssComponent {

	dataCSS = '';
	cssCode: string = '';

	clearSource (element) {
		this.dataCSS = '';
		element.focus();
	}

	// //普通压缩
	// ordinary(str: any): string {
	// 	str = str.replace(/(\n|\t|\s)*/ig, '$1');
	// 	str = str.replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig, '$1');
	// 	str = str.replace(/(\{|\}|\,|\:|\;)\s/ig, '$1');
	// 	return str;
	// }
	//
	// //高级压缩
	// pack(str: any): string {
	// 	str = str.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
	// 	str = str.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
	// 	str = str.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
	// 	str = str.replace(/;\s*;/g, ";"); //清除连续分号
	// 	str = str.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
	// 	return (str == null) ? "" : str[1];
	// }
	//
	// //格式单行
	// row(str: any): string {
	// 	str = str.replace(/(\n|\t|\s)*/ig, '$1');
	// 	str = str.replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig, '$1');
	// 	str = str.replace(/(\{|\}|\,|\:|\;)\s/ig, '$1');
	// 	str = str.replace(/(\})/ig, '$1\n');
	// 	str = str.replace(/(\*\/)/ig, '$1\n');
	// 	return str;
	// }
	//
	// //格式多行
	// rows(str: any): string {
	// 	str = str.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
	// 	str = str.replace(/;\s*;/g, ";"); //清除连续分号
	// 	str = str.replace(/\,[\s\.\#\d]*{/g, "{");
	// 	str = str.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
	// 	str = str.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
	// 	str = str.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
	// 	return str;
	// }

	// onFormat(element, type) {
	// 	element.innerHTML = this[type](this.dataCSS);
	// };

	/**
	 * 格式化
	 */
	onFormat (element) {
		const result = parserCSS(this.dataCSS);
		this.cssCode = this.dataCSS;
		element.innerHTML = '<pre>' + result + '</pre>';
	}

	/**
	 * 全选
	 */
	selectAllClicked (element) {
		if (!this.cssCode) {
			return;
		}
		this.onFormat(element);
		if (window.getSelection) {
			const range = document.createRange();
			range.selectNode(element);
			window.getSelection().addRange(range);
		}
	}

}