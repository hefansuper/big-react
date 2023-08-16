// 描述fiber node 是什么类型的节点。

export const FunctionComponent = 0;

// 挂载的根节点，例如是id=“app” 或者 root的元素。
// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
export const HostRoot = 3;

// <div></div>
// 这个div就是HostComponent
export const HostComponent = 5;

// <div>123</div>
// 这个123就是HostText
export const HostText = 6;

// 类型
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;
