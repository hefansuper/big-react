// 为什么直接引用，而是在tsconfig中配置paths。
// 因为我们不能限制hostconfig，在每个宿主环境中我们都要实现对应的hostconfig。
export type Container = any;

// 创建实例。
export const createInstance = (...args: any) => {
	return {} as any;
};

// 插入初始化的child。
export const appendInitialChild = (...args: any) => {
	return {} as any;
};

// 创建Text类型的实例。
export const createTextInstance = (...args: any) => {
	return {} as any;
};
