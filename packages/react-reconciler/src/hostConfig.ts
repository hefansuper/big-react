// 为什么直接引用，而是在tsconfig中配置paths。
// 因为我们不能限制hostconfig，在每个宿主环境中我们都要实现对应的hostconfig。
export type Container = any;
