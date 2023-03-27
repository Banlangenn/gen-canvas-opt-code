import { memo, useRef, useState } from 'react';
import { useCanvasStore } from '../store';
import { ComponentType, ComponentUniType } from '../types';
import { getElDefaultOpt } from '../utils';
import Component from './Component';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

interface ElTargetType extends HTMLElement {
	dataset: { type: OperationElType['type']; actived: string };
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
	/** 鼠标按下时元素的 x 坐标 */
	x: number;
	/** 鼠标按下时元素的 y 坐标 */
	y: number;
	/** 鼠标按下时元素的 宽 */
	w: number;
	/** 鼠标按下时元素的 高 */
	h: number;
}
const operationElDefault: OperationElType = {
	type: '',
	mouseX: 0,
	mouseY: 0,
	x: 0,
	y: 0,
	w: 0,
	h: 0,
};

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	const { elList, activedEl, activeEl, addEl, updateActivedEl, cancelActive } =
		useCanvasStore((state) => ({
			elList: state.elList,
			activedEl: state.activedEl,
			activeEl: state.activeEl,
			addEl: state.addEl,
			updateActivedEl: state.updateActivedEl,
			cancelActive: state.cancelActive,
		}));

	// 是否正在移动（显示标尺）
	const [isMoving, setIsMoving] = useState(false);
	// 是否正在改变元素宽高（显示宽高）
	const [isReSize, setIsReSize] = useState(false);

	// 当前操作的元素信息
	const crtOperElRef = useRef<OperationElType>(operationElDefault);

	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
		if (!['image', 'text', 'rect', 'circle', 'line'].includes(type)) return;
		const option = getElDefaultOpt(type);
		addEl(option);
		activeEl(option);
	};

	// 鼠标按下：记录当前操作类型、元素坐标点和鼠标坐标点
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as ElTargetType;
		const { type, actived } = target.dataset;

		if (!type || !actived || (type !== 'move' && activedEl?.type === 'text'))
			return;
		crtOperElRef.current = {
			type,
			mouseX: e.clientX,
			mouseY: e.clientY,
			x: activedEl?.x || 0,
			y: activedEl?.y || 0,
			w: activedEl?.width || 0,
			h: activedEl?.height || 0,
		};
	};

	// 鼠标移动：计算偏移量 根据操作类型确定修改元素的哪些样式
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!crtOperElRef.current.type) return;
		const { mouseX, mouseY, x, y, w, h, type } = crtOperElRef.current;
		// 计算鼠标偏移值
		const offsetX = e.clientX - mouseX;
		const offsetY = e.clientY - mouseY;

		// 新的坐标
		let left = x + offsetX;
		let top = y + offsetY;

		// 新的宽高
		let width = w + offsetX;
		let height = h + offsetY;

		// 负增长
		if (['line-top', 'pointer-top-left', 'pointer-top-right'].includes(type)) {
			height = h + -offsetY;
		}
		if (
			['line-left', 'pointer-top-left', 'pointer-bottom-left'].includes(type)
		) {
			width = w + -offsetX;
		}

		// 四角操作点等比例缩放
		if (
			[
				'pointer-top-left',
				'pointer-top-right',
				'pointer-bottom-left',
				'pointer-bottom-right',
			].includes(type)
		) {
			if (height > width) {
				width = height;
				left = x + (type === 'pointer-top-left' ? offsetY : -offsetY);
			}
			if (width > height) {
				height = width;
				top = y + (type === 'pointer-top-left' ? offsetX : -offsetX);
			}
		}

		// 底部和右侧边界
		const bottom = top + height + 1;
		const right = left + width + 1;

		// 不能超出自身边界
		if (height < 0) height = 1;
		if (width < 0) width = 1;
		if (top > bottom) top = bottom;
		if (left > right) left = right;

		// 移动时不能超出画布边界
		if (type === 'move') {
			if (top < 0) top = 0;
			if (left < 0) left = 0;
			// console.log(left + width, style.width);
			// if (left + width >= style.width) left -= left + width - style.width;
			// if (top + height >= style.height) top -= top + height -style.height;
		}

		// 需要改变的状态
		let newState: any = {};

		// 根据不同操作类型设置不同属性
		switch (type) {
			// 高度变化 top 变化
			case 'line-top': {
				newState = { height, y: top };
				break;
			}
			// 高度变化
			case 'line-bottom': {
				newState = { height };
				break;
			}
			// 宽度变化 left 变化
			case 'line-left': {
				newState = { width, x: left };
				break;
			}
			// 宽度变化
			case 'line-right': {
				newState = { width };
				break;
			}
			// 宽高变化 top left 变化
			case 'pointer-top-left': {
				newState = {
					width,
					height,
					y: top,
					x: left,
				};
				break;
			}
			// 宽高变化 top 变化
			case 'pointer-top-right': {
				newState = {
					width,
					height,
					y: top,
				};
				break;
			}
			// 宽高变化 left 变化
			case 'pointer-bottom-left': {
				newState = {
					width,
					height,
					x: left,
				};
				break;
			}
			// 宽高变化
			case 'pointer-bottom-right': {
				newState = {
					width,
					height,
				};
				break;
			}
			// 元素移动 top left 变化
			case 'move': {
				newState = {
					x: left,
					y: top,
				};
				break;
			}
		}

		// 设置是否正在移动和改变宽高
		type === 'move' ? setIsMoving(true) : setIsReSize(true);

		// 更新元素状态
		updateActivedEl({
			...(activedEl as ComponentUniType),
			...newState,
		});
	};

	// 鼠标松开：清空记录的数据
	const handleMouseUp = () => {
		if (crtOperElRef.current.type) {
			setIsMoving(false);
			setIsReSize(false);
			crtOperElRef.current = { ...operationElDefault };
		}
	};

	// 鼠标离开画布：清空记录的数据
	const handleMouseLeave = handleMouseUp;

	return (
		<div
			className="bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] relative"
			style={style}
			draggable="false"
			onClick={cancelActive}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onMouseDown={handleMouseDown}
			onMouseMove={(e) =>
				requestAnimationFrame(() => {
					handleMouseMove(e);
				})
			}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
		>
			{elList.map((el, index) =>
				el.internal.id === activedEl?.internal?.id ? null : (
					<Component key={index} options={el} />
				),
			)}
			{activedEl &&
				['image', 'text', 'rect'].includes(activedEl?.type || '') && (
					<Component isActive options={activedEl} />
				)}
			{/* x、y标尺线 */}
			{isMoving && (
				<>
					{/* top */}
					<div
						className="flex flex-col items-center absolute origin-top-left rotate-[-90deg] z-[999]"
						style={{
							width: activedEl?.y,
							top: activedEl?.y,
							left: activedEl?.x,
						}}
					>
						<div className="ruler-line" />
						<span className="mt-4 bg-orange px-[5px] h-[16px] rounded-4 flex justify-center items-center text-8 text-white select-none">
							{activedEl?.y}
						</span>
					</div>
					{/* left */}
					<div
						className="flex flex-col items-center absolute left-0 z-[999]"
						style={{
							width: activedEl?.x,
							top: activedEl?.y,
						}}
					>
						<div className="ruler-line" />
						<span className="mt-4 bg-orange px-[5px] h-[16px] rounded-4 flex justify-center items-center text-8 text-white select-none">
							{activedEl?.x}
						</span>
					</div>
				</>
			)}
			{/* 宽高值 */}
			{isReSize && (
				<div
					className="bg-primary px-[5px] h-[16px] rounded-4 flex justify-center items-center text-8 text-white select-none absolute z-[999]"
					style={{
						top: (activedEl?.y || 0) + (activedEl?.height || 0) + 4,
						left: activedEl?.x || 0,
					}}
				>
					{activedEl?.width} x {activedEl?.height}
				</div>
			)}
		</div>
	);
};

export default memo(Canvas);
