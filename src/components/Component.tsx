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

/** 画布中的组件 */
const Component = ({ options, index, isActive }: ComponentPropsType) => {
	const updateEl = useCanvasStore((state) => state.updateEl);

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
	return (
		<Element
			type={options.type}
			style={style}
			className={`${!isActive && 'hover:el-active'}`}
			{...specific}
			draggable="false"
			data-type="move"
			onClick={handleClick}
			children={
				isActive && (
					<>
						<div
							className="line line-top cursor-ns-resize"
							data-type="line-top"
							draggable="false"
						></div>
						<div
							className="line line-bottom cursor-ns-resize"
							data-type="line-bottom"
							draggable="false"
						></div>
						<div
							className="line line-left cursor-ew-resize"
							data-type="line-left"
							draggable="false"
						></div>
						<div
							className="line line-right cursor-ew-resize"
							data-type="line-right"
							draggable="false"
						></div>
						<div
							className="pointer pointer-top-left cursor-nwse-resize"
							data-type="pointer-top-left"
							draggable="false"
						></div>
						<div
							className="pointer pointer-top-right cursor-nesw-resize"
							data-type="pointer-top-right"
							draggable="false"
						></div>
						<div
							className="pointer pointer-bottom-left cursor-nesw-resize"
							data-type="pointer-bottom-left"
							draggable="false"
						></div>
						<div
							className="pointer pointer-bottom-right cursor-nwse-resize"
							data-type="pointer-bottom-right"
							draggable="false"
						></div>
					</>
				)
			}
		/>
	);
};

export default Component;
