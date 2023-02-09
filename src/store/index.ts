import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ComponentUniType } from '../types';
interface StoreType {
	/** 画布中的组件状态列表 */
	stateList: ComponentUniType[];
	/** 状态列表更新器 */
	updateStateList: (stateList: ComponentUniType[]) => void;
}

/** 画布状态 */
export const useCanvasStore = create<StoreType>()(
	devtools(
		persist(
			set => ({
				stateList: [],
				updateStateList: (stateList: ComponentUniType[]) =>
					set(state => ({ ...state, stateList })),
			}),
			{
				name: 'canvas-storage',
			},
		),
	),
);
