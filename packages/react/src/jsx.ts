import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { ElementType, Key, Ref, Props } from 'shared/ReactTypes';

// React element

// 定义react元素，及其的类型
const ReactElement = function (
	type: ElementType,
	key: Key,
	ref: Ref,
	props: Props
) {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		key,
		ref,
		props,
		__mark: 'stephen',
		type
	};
	return element;
};

// 实现jsx方法。

// jsx打包前
//  <div id="3333" className="444">666</div>

// jsx打包后
// import { jsx as _jsx } from "react/jsx-runtime";
// /*#__PURE__*/_jsx("div", {
//   id: "3333",
//   className: "444",
//   children: "666"
// });

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	const props: Props = {};
	let ref: Ref = null;

	// 遍历config
	for (const prop in config) {
		const val = config[prop];

		if (prop == 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}

		if (prop == 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}

		// 自己的props
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	// 判断maybeChildren的长度来处理。
	const maybeChildrenLength = maybeChildren || [].length;
	// [child] [child,child,child]
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

// dev环境时候使用的jsx方法，可以在这些中做一些校验，为开发提效。
export const jsxDev = jsx;
