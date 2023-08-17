import { Props, Key } from 'shared/ReactTypes';

import { WorkTag } from './workTags';

export class FiberNode {
	tag: WorkTag;
	key: Key;

	stateNode: any;
	type: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	ref: any;

	pendingProps: Props;
	memoizedProps: Props | null;

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
	}
}
