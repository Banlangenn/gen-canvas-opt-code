import { create } from 'zustand';
import { ComponentOptMap } from '../types';

type StateListType = Array<ComponentOptMap[keyof ComponentOptMap]>;
interface StoreType {
	/** 画布中的组件状态列表 */
	stateList: StateListType;
	/** 状态列表更新器 */
	updateStateList: (stateList: StateListType) => void;
}

/** 画布状态 */
export const useCanvasStore = create<StoreType>(set => ({
	stateList: [],
	updateStateList: (stateList: StateListType) =>
		set(state => ({ ...state, stateList })),
}));
