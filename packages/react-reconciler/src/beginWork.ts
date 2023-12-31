// 递归中递的阶段，就是往下

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';

export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiberNode

	switch (wip.type) {
		case HostRoot:
			return updateHostRoot(wip);

		case HostComponent:
			return updateHostComponent(wip);

		case HostText:
			return null;

		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}

	return wip;
};

// 更新HostRoot
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	// 参与计算的update。
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	// 返回的事最新的状态。
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 更新HostComponent
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		// update  少部分节点的更新。
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount 大量节点的插入。
		wip.child = mountChildFibers(wip, null, children);
	}

	reconcileChildFibers;
}
