// fiber的的状态。

export type Flags = number;

export const NoFlags = 0b0000001;

// 和结构变化相关的flags
// dom的移动
// 插入： a -> ab 标记b为Placement
// 移动： abc -> bca 标记a为Placement
export const Placement = 0b0000010;
// ul>li*3 -> ul>li*1 后面的两个li都会被标记ChildDeletion
export const ChildDeletion = 0b0001000;

// 与【属性变化】相关的flag。
// <img title="鸡" /> -> <img title="你太美" /> title的Update
export const Update = 0b0000100;
