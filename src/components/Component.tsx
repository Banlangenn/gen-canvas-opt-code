import React from 'react';
import { useCanvasStore } from '../store';
import { ComponentUniType } from '../types';
import { setElOpt } from '../utils';
import { lineClampMap } from '../utils/options';

interface ComponentPropsType {
	/** 组件配置 */
	options: ComponentUniType;
	/** 是否是激活的组件 */
	isActive?: boolean;
}

/** 画布中的组件 */
const Component = React.memo(({ options, isActive }: ComponentPropsType) => {
	const { activeEl, hoveredElId } = useCanvasStore((state) => ({
		activeEl: state.activeEl,
		hoveredElId: state.hoveredElId,
	}));
	const isHovered = hoveredElId === options?.internal.id;

	// 样式
	const style: React.CSSProperties = {
		transform: `translate(${options.x}px, ${options.y}px)`,
		width: options.width,
		height: options.height,
		position: 'absolute',
		zIndex: options?.internal.index,
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
		options.type && activeEl(options);
	};

	return (
		<div
			type={options.type}
			style={style}
			className={`box-border ${!isActive && 'hover:!el-hover'} ${
				isActive && 'cursor-move'
			} ${isHovered && '!el-hover'}`}
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
							// 坑：twcss不支持动态构造类名 https://tailwindcss.com/docs/content-configuration#dynamic-class-names
							className={`w-full h-full select-none line-clamp-1 whitespace-pre-wrap ${lineClampMap(
								options.rowCount || 1,
							)}`}
							style={{
								opacity: options.alpha ?? 1,
							}}
						>
							{options.content}
						</div>
					)}
					{isActive &&
						(options.type === 'text' ? (
							<>
								<div className="line line-top" draggable={false}></div>
								<div className="line line-bottom" draggable={false}></div>
								<div className="line line-left" draggable={false}></div>
								<div className="line line-right" draggable={false}></div>
							</>
						) : (
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
						))}
					<div className="w-full h-full hidden hover-border" />
				</>
			}
		/>
	);
});

export default Component;
