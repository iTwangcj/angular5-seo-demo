/************** Extension Functions for String **************/
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
};

// String.prototype.ltrim = function () {
// 	return this.replace(/^\s+/g, "");
// };

// Format Setting
// let FormatSetting = {
// 	HasPreTag: false
// };

// This checked may be much efficient than CssREC.IsComment, as no more RegExp match required
const CommentMatched = ($1) => {
	return ($1 === undefined || ($1).length <= 0);
};

/************** CSS Regular Expression Controller **************/
const CssREC = {
	/*******    Pseudo Private Values   *******/
	Proto: {
		comment: /\s*\/\*(?:\s|.)*?\*\//,
		definition: /\s*([^\{\}\s;\/][^\{\};]*){([^\{\}]*[^\s\{\}]|.{0})\s*}/,
		selector: /\s*([^\s,](?:[^,]*[^,\s])?)\s*(,|$)/,
		property: /\s*([\w\-]+)\s*:\s*([^;]*[^;\s])\s*(?:;|$)/
		// property_name:
		// property_value:
	},

	/*******    Getter Properties   *******/
	get CommentMatcher () {
		return new RegExp(this.Proto.comment.source, 'g');
	},

	get DefinitionMatcher () {
		// let pattern = this.Proto.comment + "|" + this.Proto.definition;
		const pattern = this.PatternsConcat(this.Proto.comment, this.Proto.definition);
		return new RegExp(pattern, 'g');
	},

	get SelectorMatcher () {
		// let pattern = this.Proto.comment + "|" + this.Proto.selector;
		const pattern = this.PatternsConcat(this.Proto.comment, this.Proto.selector);
		return new RegExp(pattern, 'g');
	},

	get PropertyMatcher () {
		// let pattern = this.Proto.comment + "|" + this.Proto.property;
		const pattern = this.PatternsConcat(this.Proto.comment, this.Proto.property);
		return new RegExp(pattern, 'g');
	},
	get EndlineMatcher () {
		return /\n|\r|\r\n/g;
	},
	get SpaceMatcher () {
		return / {2,}/g;
	},
	/*******    Auxiliary Methods   *******/
	PatternsConcat: function () {
		let pattern = '';
		let temp;
		let arg;
		for (let i = 0; i < arguments.length; ++i) {
			arg = arguments[i];
			temp = '' + (arg instanceof RegExp ? arg.source : arg);
			if (temp.length > 0) {
				pattern += (pattern.length > 0 ? '|' : '') + temp;
			}
		}

		return pattern;
	},
	IsComment: function (content) {
		if (content === undefined || content.length < 4) return false;

		return /^\s*\/\*/.test(content);
	}
};

/************** Text Coloring Format **************/
const TextFormat: any = {
	/*******    Basic Format Function    *******/
	Wrap: function (content, classNames, tagName) {
		if (content == null || content.length === 0) return '';
		if (tagName === undefined || tagName == null || (tagName = '' + tagName ).length === 0) {
			tagName = this.Tag;
		}
		let cssClass = '';
		if (classNames !== undefined && classNames != null) {
			if (Array.isArray(classNames)) {   // if(classNames.join != undifined) //this may compatible to IE 8-
				cssClass = classNames.join(' ');
			} else {
				cssClass = '' + classNames;
			}
		}

		let openTag = '<' + tagName + '>';
		const closeTag = '</' + tagName + '>';

		if (cssClass.length > 0) {
			openTag = '<' + tagName + ' class="' + cssClass + '" >';
		}

		return openTag + content + closeTag;

	},
	Space: function (num) {
		let times = parseInt(num, 10);
		times = (isNaN(times) ? 1 : times + 1); // times+1 length array has times intervals
		return new Array(times).join('&nbsp;');
	},

	/*******    CSS Wrapper Functinons    *******/
	Comment: function (content) {
		return this.Wrap(content.trim(), 'comment');
	},
	Definition: function (selectors, properties) {
		return selectors + this.Endline + '{' + properties + this.Endline + '}';
	},
	Seletor: function (selector, seperator) {
		return this.Endline + this.Wrap(selector, 'selector') + seperator;
	},
	Property: function (name, value) {
		return this.Endline + this.Indent + this.Wrap(name, ['property', 'name']) + ': ' + this.Wrap(value, ['property', 'value']) + ';';
	},

	Tag: 'span',
	Endline: '\n', // or "<br />"
	get Indent () {
		return '    ';
	} // this.Space(4);
};

const SeletorColoring = ($0, $1, $2, $3) => {
	// comment matched
	if (CommentMatched($1)
	//        || CssREC.IsComment($0)
	) {
		return (TextFormat.Comment($0) + TextFormat.Endline);
	}
	// in future, here will be more analysis for selector, id, type, class will be all coloring seperately
	$1 = $1.replace(CssREC.CommentMatcher, TextFormat.Comment('$&'));
	return TextFormat.Seletor($1, $2);
};

const PropertyColoring = ($0, $1, $2, $3) => {
	// comment matched
	if (CommentMatched($1)
	// || CssREC.IsComment($0)
	) {
		return (TextFormat.Endline + TextFormat.Indent + TextFormat.Comment($0));
	}
	// $2 = $2.replace(CssREC.CommentMatcher, "<span class=\"comment\" >$&</span>");
	$2 = $2.replace(CssREC.CommentMatcher, TextFormat.Comment('$&'));
	// $2 = $2.replace(CssREC.CommentMatcher, function($0){ TextFormat.Comment($0)});

	return TextFormat.Property($1, $2);
};

/**
 $0,$1,$2,$3 are matched group for regular expression,
 the first one would be whole matched string,
 the last one would be the index at which to start the next match.

 When use RegExp.exec function, each group will be saved in result array,
 if there is no match, undefined will be saved.

 But for following function parameter, Firefox will pass empty string("") if group match nothing
 where Chrome pass undefined.
 So codes need to check ($1 == undefined || $1.length<=0) to be compatible with both Firefox and Chrome

 **/

const DefinitionColoring = ($0, $1, $2, $3) => {
	// comment matched
	if (CommentMatched($1)
	//        || CssREC.IsComment($0)
	) {
		return (TextFormat.Endline + TextFormat.Endline + TextFormat.Comment($0));
	}
	// css definition matched
	const seletors = $1.replace(CssREC.SelectorMatcher, SeletorColoring);
	const properties = $2.replace(CssREC.PropertyMatcher, PropertyColoring);
	return TextFormat.Definition(seletors, properties);
};

/************** Matching Replacement **************/
export const parserCSS = (css) => {
	if (typeof(css) !== 'string') {
		return css;
	}
	const result = css.replace(CssREC.DefinitionMatcher, DefinitionColoring); // .ltrim();

	// if(!FormatSetting.HasPreTag)
	// result = result.replace(CssREC.EndlineMatcher, TextFormat.Endline);

	return result;
	// .replace(CssREC.SpaceMatcher, function($0){return TextFormat.Space($0.length)});
};
