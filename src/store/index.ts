import { create } from 'zustand';
import { ComponentOptMap } from '../types';

type StateListType = Array<ComponentOptMap[keyof ComponentOptMap]>;
interface StoreType {
	/** 画布中的组件状态列表 */
	stateList: StateListType;
	/** 当前选中的组件的索引 */
	selectedIndex: number;
	/** 状态列表更新器 */
	updateStateList: (stateList: StateListType) => void;
	/** 选中的组件索引更新器  */
	updateSelectedIndex: (index: number) => void;
}

/** 画布状态 */
export const useCanvasStore = create<StoreType>(set => ({
	stateList: [],
	selectedIndex: -1,
	updateStateList: (stateList: StateListType) =>
		set(state => ({ ...state, stateList })),
	updateSelectedIndex: (index: number) => set(state => ({ ...state, index })),
}));
