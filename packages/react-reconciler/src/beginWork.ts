// 递归中递的阶段，就是往下

import { FiberNode } from './fiber';

export const beginWork = (fiber: FiberNode) => {
	// 比较，返回子fiberNode
	return fiber;
};
