// 性能优化的方式

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

// shouldTrackEffects 是否追踪副作用
function ChildReconciler(shouldTrackEffects: boolean) {
	// 根据reactElementType创建fiber并返回。
	// returnFiber 父亲fiber
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	// 标记单一的节点。
	function placeSingleChild(fiber: FiberNode) {
		// 有副总用，并且是首屏渲染。才标记副作用。
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	// 返回一个闭包,根据不同的shouldTrackEffects返回不同的reconcileChildFibers实现。
	// returnFiber 父亲fiber
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber的类型。
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);

				default:
					if (__DEV__) {
						console.log('没有实现的reconcile类型', newChild);
					}
					break;
			}
		}

		// 多节点的情况。  ul>li*3
		// hostText 文本节点。
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.log('没有实现的reconcile类型', newChild);
		}

		return null;
	};
}

// update  少部分节点的更新。 追踪副作用
export const reconcileChildFibers = ChildReconciler(true);

// mount 大量节点的插入。不追踪副作用
export const mountChildFibers = ChildReconciler(false);
