import { useRef } from 'react';
import { isEqual, debounce } from 'lodash';
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
	const elList = useCanvasStore((state) => state.elList, isEqual);
	const activeEl = useCanvasStore((state) => state.activeEl, isEqual);
	const { updateEl, addEl, updateActiveEl, cancelSelect } = useCanvasStore(
		(state) => ({
			updateEl: state.updateEl,
			addEl: state.addEl,
			updateActiveEl: state.updateActiveEl,
			cancelSelect: state.cancelSelect,
		}),
	);

	// 当前操作的元素信息
	const crtOperElRef = useRef<OperationElType>(operationElDefault);

	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
		if (!['image', 'text', 'rect'].includes(type)) return;
		const option = getElDefaultOpt(type, elList.length);
		addEl(option);
		updateEl(option);
	};

	// 鼠标按下：记录当前操作类型、元素坐标点和鼠标坐标点
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as ElTargetType;
		const { type, actived } = target.dataset;

		if (!type || !actived) return;
		crtOperElRef.current = {
			type,
			mouseX: e.clientX,
			mouseY: e.clientY,
			x: activeEl?.x || 0,
			y: activeEl?.y || 0,
			w: activeEl?.width || 0,
			h: activeEl?.height || 0,
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
		const left = x + offsetX;
		const top = y + offsetY;
		// 新的宽高
		let width = w + offsetX;
		let height = h + offsetY;
		if (['line-top', 'pointer-top-left', 'pointer-top-right'].includes(type)) {
			height = h + -offsetY;
		}
		if (
			['line-left', 'pointer-top-left', 'pointer-bottom-left'].includes(type)
		) {
			width = w + -offsetX;
		}

		// 根据不同操作类型设置不同属性
		switch (type) {
			// 高度变化 top 变化
			case 'line-top': {
				updateActiveEl({ ...(activeEl as ComponentUniType), height, y: top });
				break;
			}
			// 高度变化
			case 'line-bottom': {
				updateActiveEl({ ...(activeEl as ComponentUniType), height });
				break;
			}
			// 宽度变化 left 变化
			case 'line-left': {
				updateActiveEl({ ...(activeEl as ComponentUniType), width, x: left });
				break;
			}
			// 宽度变化
			case 'line-right': {
				updateActiveEl({ ...(activeEl as ComponentUniType), width });
				break;
			}
			// 宽高变化 top left 变化
			case 'pointer-top-left': {
				updateActiveEl({
					...(activeEl as ComponentUniType),
					width,
					height,
					y: top,
					x: left,
				});
				break;
			}
			// 宽高变化 top 变化
			case 'pointer-top-right': {
				updateActiveEl({
					...(activeEl as ComponentUniType),
					width,
					height,
					y: top,
				});
				break;
			}
			// 宽高变化 left 变化
			case 'pointer-bottom-left': {
				updateActiveEl({
					...(activeEl as ComponentUniType),
					width,
					height,
					x: left,
				});
				break;
			}
			// 宽高变化
			case 'pointer-bottom-right': {
				updateActiveEl({
					...(activeEl as ComponentUniType),
					width,
					height,
				});
				break;
			}
			// 元素移动 top left 变化
			case 'move': {
				updateActiveEl({ ...(activeEl as ComponentUniType), x: left, y: top });
				break;
			}
		}
	};

	// 鼠标松开：清空记录的数据
	const handleMouseUp = () => {
		if (crtOperElRef.current.type) {
			crtOperElRef.current = { ...operationElDefault };
		}
	};

	// 鼠标离开画布：清空记录的数据
	const handleMouseLeave = () => {
		if (crtOperElRef.current.type) {
			crtOperElRef.current = { ...operationElDefault };
		}
	};

	return (
		<div
			className="bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] overflow-hidden relative"
			style={style}
			draggable="false"
			onClick={cancelSelect}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onMouseDown={handleMouseDown}
			onMouseMove={debounce(handleMouseMove, 10)}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
		>
			{elList.map((el, index) =>
				el.internal.id === activeEl?.internal?.id ? null : (
					<Component key={index} options={el} index={index} />
				),
			)}
			{activeEl && ['image', 'text', 'rect'].includes(activeEl?.type || '') && (
				<Component isActive options={activeEl} index={activeEl?.internal?.id} />
			)}
		</div>
	);
};

export default Canvas;
