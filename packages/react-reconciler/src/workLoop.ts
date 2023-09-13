import { beginWork } from './beginWork';
import { completeWork } from './completeWork';

import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

// 双缓存，正在reconcile中计算的fiberNode树。
let workInProgress: FiberNode | null = null;

// 初始化
// 传入的是FiberRootNode，不是普通的fiber，需要进行处理。
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

// dfs 中的归，向上的操作。
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	// 有兄弟fiber就执行兄弟fiber。
	do {
		completeWork(node);

		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}

// dfs 中的递，向下的操作。
function performUnitOfWork(fiber: FiberNode) {
	// 获取当前fiberNode的子节点。
	const next = beginWork(fiber);

	// 当前fiber的结束的状态等于开始的状态？？？
	fiber.memoizedProps = fiber.pendingProps;

	// 判断是否是最后一个，来选择是递还是归。
	if (next === null) {
		// 归
		completeUnitOfWork(fiber);
	} else {
		// 继续往下走。
		workInProgress = next;
	}
}

// dfs 循环。
// 如果workInProgress不是空就开始向下递，执行递归的递的阶段。
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function renderRoot(root: FiberNode) {
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.log('workLoop发生错误', e);
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip fiberNode树 树中的flags 执行具体的dom操作。
	commitRoot(root);
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// 获取fiberRootNode。
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// 从当前的阶段遍历到最顶层的节点。
// 返回的事fiberRootNode。
export function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;

	// 如果是App就有return指针，如果是hostRootFiber就没有return指针。
	while (parent !== null) {
		// 是app
		node = parent;
		parent = parent.return;
	}
	// 是 hostRootFiber
	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}
