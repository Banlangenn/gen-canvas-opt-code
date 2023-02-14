import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './../utils/constant';
import { ComponentUniType } from '../types';

interface CanvasSizeStoreType {
	size: {
		/** 画布宽度 */
		width: number;
		/** 画布高度 */
		height: number;
	};
	/** 更新画布尺寸 */
	updateSize: (width: number, height: number) => void;
}

/** 画布尺寸 */
export const useCanvasSizeStore = create<CanvasSizeStoreType>()(
	devtools(
		persist(
			(set) => ({
				size: {
					width: CANVAS_WIDTH,
					height: CANVAS_HEIGHT,
				},
				updateSize: (width: number, height: number) =>
					set({ size: { width, height } }),
			}),
			{
				name: 'canvas-size-storage',
			},
		),
	),
);

/**
 * 画布内容 store 中有 `elList` 和 `activedEl` 两个状态：
 * - `elList`：画布中的组件列表
 * - `activedEl`：当前激活的组件
 *
 * 更新状态：
 * - 当激活某个组件时，将该组件状态备份到 `activedEl`，页面中使用 `activedEl` 渲染该组件，这样当改变该组件的状态时，不需要更新整个列表
 * - 当有新的组件激活时，将上一个激活的组件同步到组件列表中
 * - 当导出代码时，将当前激活的组件同步到组件列表，取消当前组件的激活状态
 */
interface CanvasStoreType {
	/** 画布中的组件列表 */
	elList: ComponentUniType[];
	/** 当前激活的组件 */
	activedEl: ComponentUniType | null;
	/** 添加组件 */
	addEl: (el: ComponentUniType) => void;
	/** 激活组件，将上一次激活的组件(如果有的话)同步到列表 */
	activeEl: (el: ComponentUniType) => void;
	/** 更新激活组件的状态 */
	updateActivedEl: (el: ComponentUniType) => void;
	/** 取消激活，将当前激活的组件同步到组件列表，取消当前组件的激活状态 */
	cancelActive: () => void;
	/** 删除组件 */
	deleteEl: (id: number) => void;
	/** 清空画布(重置store) */
	clearStore: () => void;
}

/** 画布状态 */
export const useCanvasStore = create<CanvasStoreType>()(
	devtools(
		persist(
			(set) => ({
				elList: [] as ComponentUniType[],
				activedEl: null,
				addEl: (el: ComponentUniType) =>
					set((state) => ({
						...state,
						elList: state.elList.concat(el),
					})),
				activeEl: (el: ComponentUniType) =>
					set(({ activedEl, elList }) => {
						if (activedEl) {
							elList[activedEl.internal.id] = activedEl;
						}
						return {
							activedEl: { ...el },
							elList: [...elList],
						};
					}),
				updateActivedEl: (el: ComponentUniType) =>
					set((state) => ({ ...state, activedEl: { ...el } })),
				cancelActive: () =>
					set(({ activedEl, elList }) => {
						if (activedEl) {
							elList[activedEl.internal.id] = activedEl;
						}
						return { activedEl: null, elList: [...elList] };
					}),
				deleteEl: (id: number) =>
					set((state) => ({
						activedEl: null,
						elList: state.elList.filter((el) => el.internal.id !== id),
					})),
				clearStore: () => set({ elList: [], activedEl: null }),
			}),
			{
				name: 'canvas-storage',
			},
		),
	),
);
