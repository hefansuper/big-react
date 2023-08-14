// 防止滥用，就定义为symbol。

// Symbol.for 生成一个新的symbol值，供全局使用。
const supportSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
