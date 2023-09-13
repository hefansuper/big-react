import { Props, Key, ReactElementType } from 'shared/ReactTypes';

import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

// 为什么直接引用，而是在tsconfig中配置paths。
// 因为我们不能限制hostconfig，在每个宿主环境中我们都要实现对应的hostconfig。
import { Container } from 'hostConfig';

export class FiberNode {
	tag: WorkTag;
	key: Key;

	stateNode: any;
	type: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	// 子树中包含的flags。
	subtreeFlags: Flags;
	ref: any;

	pendingProps: Props;
	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;

	updateQueue: unknown;

	// tag 描述fiber node 是什么类型的节点。
	// key 写jsx时写的key。
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;

		// HostComponent <div></div> 保存的就是div的这个DOM
		this.stateNode = null;
		// FunctionComponent ()=>{} 就是这个本身。
		this.type = null;

		// 构成树状结构

		// 指向父的fiberNode
		// fiberNode是一个工作单元，当前的工作单元任务完成后，
		// 就是父的工作单元工作。
		this.return = null;
		// 兄弟fiberNode单元
		this.sibling = null;
		// 子fiberNode单元。
		this.child = null;
		// 标识同级的fiber的位置。比如下面的li标签。
		// <ul>
		// <li></li>
		// <li></li>
		// <li></li>
		// <ul>
		this.index = 0;

		this.ref = null;

		//作为工作单元。
		// 开始的时候的状态
		this.pendingProps = pendingProps;
		// 工作完的时候，结束的状态
		this.memoizedProps = null;
		this.updateQueue = null;
		// 更新完后的state。
		this.memoizedState = null;

		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

// ReactDOM.createRoot(rootElement).render(<App/>)
export class FiberRootNode {
	// 这个就是ReactDOM.createRoot，但是每个宿主环境不一样，所以就要更抽象的标识。
	container: Container;
	// 指向hostRootFiber
	current: FiberNode;
	// 更新完成递归之后的FiberNode
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

// 从root开始创建WorkInProcess
// 双缓存，返回的是另外一个fiberNode。
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// 首次渲染的时候，wip是空。
		// 创建一个fiberNode。
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		// 建立指针关系，双缓存的两个节点。
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// 更新阶段。
		wip.pendingProps = pendingProps;
		// 清除副作用。这个副作用可能是上一次更新留下的。
		wip.flags = NoFlags;
	}

	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};

// 根据reactElementType创建fiber并返回。
export function createFiberFromElement(element: ReactElementType) {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	// 判断type的类型。
	if (typeof type == 'string') {
		// <div/> type:"div"
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}

	// 返回个新的fiber。
	const fiber = new FiberNode(fiberTag, props, key);
	return fiber;
}
