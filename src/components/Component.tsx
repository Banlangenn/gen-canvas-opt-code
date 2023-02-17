import React from 'react';
import { useCanvasStore } from '../store';
import { ComponentUniType } from '../types';
import { setElOpt } from '../utils';

interface ComponentPropsType {
	/** 组件配置 */
	options: ComponentUniType;
	/** 组件的层级*/
	index: number;
	/** 是否是激活的组件 */
	isActive?: boolean;
}

/** 画布中的组件 */
const Component = ({ options, index, isActive }: ComponentPropsType) => {
	const activeEl = useCanvasStore((state) => state.activeEl);
	const activedEl = useCanvasStore((state) => state.activedEl);

	// 样式
	const style: React.CSSProperties = {
		top: options.y,
		left: options.x,
		width: options.width,
		height: options.height,
		position: 'absolute',
		zIndex: index,
	};
	// 特有属性
	const specific: any = {};

	// 设置元素的样式和属性
	setElOpt(options, style, specific);

	/** 事件处理 */
	// 元素点击 如果点的不是自己则更新 store
	const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (isActive) return;
		options.type && activeEl({ ...options });
	};
	return (
		<div
			type={options.type}
			style={style}
			className={`${!isActive && !activedEl && 'hover:!el-active'} ${
				isActive && 'cursor-move'
			}`}
			{...specific}
			draggable="false"
			data-type="move"
			data-actived={isActive}
			onClick={handleClick}
			children={
				<>
					{options.type === 'text' && (
						<div
							data-type="move"
							data-actived={isActive}
							className="overflow-hidden text-ellipsis w-full h-full select-none"
						>
							{options.content}
						</div>
					)}
					{isActive && (
						<>
							<div
								className="line line-top cursor-ns-resize"
								data-type="line-top"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="line line-bottom cursor-ns-resize"
								data-type="line-bottom"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="line line-left cursor-ew-resize"
								data-type="line-left"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="line line-right cursor-ew-resize"
								data-type="line-right"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="pointer pointer-top-left cursor-nwse-resize"
								data-type="pointer-top-left"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="pointer pointer-top-right cursor-nesw-resize"
								data-type="pointer-top-right"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="pointer pointer-bottom-left cursor-nesw-resize"
								data-type="pointer-bottom-left"
								data-actived={isActive}
								draggable={false}
							></div>
							<div
								className="pointer pointer-bottom-right cursor-nwse-resize"
								data-type="pointer-bottom-right"
								data-actived={isActive}
								draggable={false}
							></div>
						</>
					)}
				</>
			}
		/>
	);
};

export default Component;
