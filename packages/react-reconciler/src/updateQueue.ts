import { Action } from 'shared/ReactTypes';

// this.setState({XXX:1})
// this.setState({XXX:1}=>{XXX:2})

// Update的类型
export interface Update<State> {
	action: Action<State>;
}

// UpdateQueue 的类型
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 创建update
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

// 初始化updateQueue实例。
export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};

// 往UpdateQueue中增加update。
export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

// 消费 UpdateQueue。
// baseState:初始的值
// pendingUpdate：待消费的值。
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		// 判断这个action是不是函数，是函数就调用，不是函数就赋值。
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState 1 update (x) => 4x -> memoizedState 4
			result.memoizedState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState 2
			result.memoizedState = baseState;
		}
	}

	return result;
};
