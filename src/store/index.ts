import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ComponentUniType } from '../types';
interface StoreType {
	/** 画布中的组件状态列表 */
	elList: ComponentUniType[];
	/** 状态列表更新器 */
	updateElList: (elList: ComponentUniType[]) => void;
}

/** 画布状态 */
export const useCanvasStore = create<StoreType>()(
	devtools(
		persist(
			set => ({
				elList: [],
				updateElList: (elList: ComponentUniType[]) =>
					set(state => ({ ...state, elList })),
			}),
			{
				name: 'canvas-storage',
			},
		),
	),
);
