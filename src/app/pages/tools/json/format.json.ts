const isCollapsible = true;
const SINGLE_TAB = ' ';
const ImgCollapsed = 'toggle plus';
const ImgExpanded = 'toggle minus';
const QuoteKeys = true;
const dateObj = new Date();
const regexpObj = new RegExp('');

const multiplyString = (num, str) => {
	const sb = [];
	for (let i = 0; i < num; i++) {
		sb.push(str);
	}
	return sb.join('');
};

let tabSize = multiplyString(2, SINGLE_TAB);

const isArrayChange = (obj) => {
	return obj && typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
};

const getRow = (indent: number, data: any, isPropertyContent?: any) => {
	let tabs = '';
	for (let i = 0; i < indent && !isPropertyContent; i++) {
		tabs += tabSize; // window.TAB;
	}
	if (data != null && data.length > 0 && data.charAt(data.length - 1) !== '\n') {
		data = data + '\n';
	}
	return tabs + data;
};

const formatLiteral = (literal, quote, comma, indent, isArray, style) => {
	if (typeof literal === 'string') {
		literal = literal.split('<').join('&lt;').split('>').join('&gt;');
	}
	let str = '<span class="' + style + '">' + quote + literal + quote + comma + '</span>';
	if (isArray) {
		str = getRow(indent, str);
	}
	return str;
};

const formatFunction = (indent, obj) => {
	let tabs = '';
	for (let i = 0; i < indent; i++) {
		tabs += tabSize; // window.TAB;
	}
	const funcStrArray = obj.toString().split('\n');
	let str = '';
	for (let i = 0; i < funcStrArray.length; i++) {
		str += ((i === 0) ? '' : tabs) + funcStrArray[i] + '\n';
	}
	return str;
};

// export const expandClicked = (target) => {
// 	let container = target.parentNode.nextSibling;
// 	if (!container) return;
// 	let disp = 'none';
// 	let src = ImgCollapsed;
// 	if (container.style.display === 'none') {
// 		disp = 'inline';
// 		src = ImgExpanded;
// 	}
// 	container.style.display = disp;
// 	target.className = src;
// };

export const parserJSON = (obj, indent, addComma, isArray, isPropertyContent, tabNumber?: any) => {
	tabSize = multiplyString(parseInt(tabNumber, 10), SINGLE_TAB) || tabSize;
	let html = '';
	const comma = (addComma) ? '<span class="comma">,</span> ' : '';
	const type = typeof obj;
	let clpsHtml = '';
	if (isArrayChange(obj)) {
		if (obj.length === 0) {
			html += getRow(indent, '<span class="array">[ ]</span>' + comma, isPropertyContent);
		} else {
			clpsHtml = isCollapsible ? '<span><i class="toggle ' + ImgExpanded + '"></i></span><span class="collapsible">' : '';
			html += getRow(indent, '<span class="array">[</span>' + clpsHtml, isPropertyContent);
			for (let i = 0; i < obj.length; i++) {
				html += parserJSON(obj[i], indent + 1, i < (obj.length - 1), true, false);
			}
			clpsHtml = isCollapsible ? '</span>' : '';
			html += getRow(indent, clpsHtml + '<span class="array">]</span>' + comma);
		}
	} else if (type === 'object') {
		if (obj == null) {
			html += formatLiteral('null', '', comma, indent, isArray, 'null');
		} else if (obj.constructor === dateObj.constructor) {
			html += formatLiteral('new Date(' + obj.getTime() + ') /*' + obj.toLocaleString() + '*/', '', comma, indent, isArray, 'date');
		} else if (obj.constructor === regexpObj.constructor) {
			html += formatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp');
		} else {
			let numProps = 0;
			for (const prop2 in obj) {
				if (obj.hasOwnProperty(prop2)) {
					numProps++;
				}
			}
			if (numProps === 0) {
				html += getRow(indent, '<span class="object">{ }</span>' + comma, isPropertyContent);
			} else {
				clpsHtml = isCollapsible ? '<span><i class="toggle ' + ImgExpanded + '"></i></span><span class="collapsible">' : '';
				html += getRow(indent, '<span class="object">{</span>' + clpsHtml, isPropertyContent);
				let j = 0;
				for (const prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						const quote = QuoteKeys ? '"' : '';
						html += getRow(indent + 1, '<span class="property">' + quote + prop + quote + '</span>: ' + parserJSON(obj[prop], indent + 1, ++j < numProps, false, true));
					}
				}
				clpsHtml = isCollapsible ? '</span>' : '';
				html += getRow(indent, clpsHtml + '<span class="object">}</span>' + comma);
			}
		}
	} else if (type === 'number') {
		html += formatLiteral(obj, '', comma, indent, isArray, 'number');
	} else if (type === 'boolean') {
		html += formatLiteral(obj, '', comma, indent, isArray, 'boolean');
	} else if (type === 'function') {
		if (obj.constructor === regexpObj.constructor) {
			html += formatLiteral('new RegExp(' + obj + ')', '', comma, indent, isArray, 'RegExp');
		} else {
			obj = formatFunction(indent, obj);
			html += formatLiteral(obj, '', comma, indent, isArray, 'function');
		}
	} else if (type === 'undefined') {
		html += formatLiteral('undefined', '', comma, indent, isArray, 'null');
	} else {
		html += formatLiteral(obj.toString().split('\\').join('\\\\').split('"').join('\\'), '"', comma, indent, isArray, 'string');
	}
	return html;
};