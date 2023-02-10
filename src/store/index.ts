import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ComponentUniType } from '../types';

/**
 * store 中有 elList 和 activeEl 两个状态：
 * - `elList`：画布中的组件列表
 * - `activeEl`：当前激活的组件
 * 
 * 更新状态：
 * - 当激活某个组件时，将该组件状态备份到 `activeEl`，页面中使用 `activeEl` 渲染该组件，这样当改变该组件的状态时，不需要更新整个列表
 * - 当有新的组件激活时，将上一个激活的组件同步到组件列表中
 * - 当导出代码时，将当前激活的组件同步到组件列表，取消当前组件的激活状态
 */
interface StoreType {
	/** 画布中的组件列表 */
	elList: ComponentUniType[];
  /** 当前激活的组件 */
  activeEl: ComponentUniType | null;
  /** 更新激活组件，将上一次激活的组件(如果有的话)同步到列表 */
	updateEl: (el: ComponentUniType) => void;
  /** 更新激活组件的状态 */
	updateActiveEl: (el: ComponentUniType) => void;
  /** 添加组件 */
  addEl: (el: ComponentUniType) => void;
  /** 导出代码，将上一次激活的组件(如果有的话)同步到列表，重置激活状态 */
  exportCode: () => void;
}

/** 画布状态 */
export const useCanvasStore = create<StoreType>()(
	devtools(
		persist(
			set => ({
				elList: [],
        activeEl: null,
        updateEl: (el: ComponentUniType) => set(({activeEl, elList}) => {
          elList.forEach(el => el.internal.isSelected = false);
          el.internal.isSelected = true;
          if (activeEl) {
            elList[activeEl.internal.id] = activeEl;
          }
          return {
            activeEl: el,
            elList
          };
        }),
        updateActiveEl: (el: ComponentUniType) => set(() => ({activeEl: el}),),
        addEl: (el: ComponentUniType) => set(({elList}) => ({elList: elList.concat(el)}),),
        exportCode: () => set(({activeEl, elList}) => {
          if (activeEl) {
            elList[activeEl.internal.id] = activeEl;
          }
          return { activeEl: null, elList}
        })
			}),
			{
				name: 'canvas-storage',
			},
		),
	),
);
