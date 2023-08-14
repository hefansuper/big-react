export type ElementType = any;
export type Key = any;
export type Ref = any;
export type Props = any;

export interface ReactElementType {
	key: Key;
	type: ElementType;
	ref: Ref;
	__mark: string;
	$$typeof: symbol | number;
	props: Props;
}
