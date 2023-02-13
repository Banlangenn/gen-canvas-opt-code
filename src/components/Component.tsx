import { useRef } from 'react';
import { useCanvasStore } from '../store';
import { ComponentType, ComponentUniType } from '../types';
import { setElOpt } from '../utils';

interface ElPropsType {
	/** 组件类型 */
	type: ComponentType;
	[key: string]: any;
}

/** 创建组件类型对应的元素 */
export const Element = ({ type, ...props }: ElPropsType) => {
	return {
		image: <div {...props} />,
		text: <p {...props} />,
		rect: <div {...props} />,
	}[type];
};

interface ComponentPropsType {
	/** 组件配置 */
	options: ComponentUniType;
	/** 组件的层级*/
	index: number;
	/** 是否是激活的组件 */
	isActive?: boolean;
}

interface OperationElType {
	/** 操作类型 移动/线/点 */
	type:
		| ''
		| 'move'
		| 'line-top'
		| 'line-bottom'
		| 'line-left'
		| 'line-right'
		| 'pointer-top-left'
		| 'pointer-top-right'
		| 'pointer-bottom-left'
		| 'pointer-bottom-right';
	/** 鼠标按下时的 x 坐标 */
	mouseX: number;
	/** 鼠标按下时的 y 坐标 */
	mouseY: number;
	/** 拖放元素的 x 坐标 */
	offsetX: number;
	/** 拖放元素的 y 坐标 */
	offsetY: number;
}
const operationElDefault: OperationElType = {
	type: '',
	mouseX: 0,
	mouseY: 0,
	offsetX: 0,
	offsetY: 0,
};

/** 画布中的组件 */
const Component = ({ options, index, isActive }: ComponentPropsType) => {
	const { updateEl, updateActiveEl } = useCanvasStore((state) => ({
		updateActiveEl: state.updateActiveEl,
		updateEl: state.updateEl,
	}));

	// 当前操作的元素信息
	const crtOperElRef = useRef<OperationElType>(operationElDefault);

	// 样式
	const style: React.CSSProperties = {
		top: options.y,
		left: options.x,
		width: options.width,
		height: options.height,
		borderRadius: options.radius,
		position: 'absolute',
		zIndex: index,
	};
	// 特有属性
	const specific: any = {};

	// 设置元素的样式和属性
	setElOpt(options, style, specific);

	/** 事件处理 */
	// 元素点击 如果点的不是自己则更新 store
	const handleClick = () => {
		if (isActive) return;
		updateEl({ ...options });
	};
	// 鼠标按下：记录当前操作类型、元素坐标点和鼠标坐标点
	const handleMouseDown = (e: any) => {
		const { type } = e.target.dataset;
	};
	// 鼠标移动：计算偏移量 根据操作类型确定修改元素的哪些样式
	const handleMouseMove = (e: any) => {
		if (!crtOperElRef.current.type) return;
	};
	// 鼠标松开：清空记录的数据
	const handleMouseUp = () => {
		if (crtOperElRef.current.type) {
			crtOperElRef.current = operationElDefault;
		}
	};
	return (
		<Element
			type={options.type}
			style={style}
			className={`${!isActive && 'hover:el-active'}`}
			{...specific}
			draggable="false"
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			children={
				isActive && (
					<>
						<div
							className="line line-top cursor-ns-resize"
							data-type="line-top"
						></div>
						<div
							className="line line-bottom cursor-ns-resize"
							data-type="line-bottom"
						></div>
						<div
							className="line line-left cursor-ew-resize"
							data-type="line-left"
						></div>
						<div
							className="line line-right cursor-ew-resize"
							data-type="line-right"
						></div>
						<div
							className="pointer pointer-top-left cursor-nwse-resize"
							data-type="pointer-top-left"
						></div>
						<div
							className="pointer pointer-top-right cursor-nesw-resize"
							data-type="pointer-top-right"
						></div>
						<div
							className="pointer pointer-bottom-left cursor-nesw-resize"
							data-type="pointer-bottom-left"
						></div>
						<div
							className="pointer pointer-bottom-right cursor-nwse-resize"
							data-type="pointer-bottom-right"
						></div>
					</>
				)
			}
		/>
	);
};

export default Component;
