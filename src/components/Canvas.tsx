import { useRef } from 'react';
import { isEqual } from 'lodash';
import { useCanvasStore } from '../store';
import { ComponentType } from '../types';
import { getElDefaultOpt } from '../utils';
import Component from './Component';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

interface ElTargetType extends HTMLElement {
	dataset: { type: OperationElType['type'] };
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
}
const operationElDefault: OperationElType = {
	type: '',
	mouseX: 0,
	mouseY: 0,
};

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	const elList = useCanvasStore((state) => state.elList, isEqual);
	const activeEl = useCanvasStore((state) => state.activeEl, isEqual);
	const { updateEl, addEl, updateActiveEl } = useCanvasStore((state) => ({
		updateEl: state.updateEl,
		addEl: state.addEl,
		updateActiveEl: state.updateActiveEl,
	}));

	// 当前操作的元素信息
	const crtOperElRef = useRef<OperationElType>(operationElDefault);

	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
		if (!type) return;
		const option = getElDefaultOpt(type, elList.length);
		addEl(option);
		updateEl(option);
	};

	// 鼠标按下：记录当前操作类型、元素坐标点和鼠标坐标点
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as ElTargetType;
		const { type } = target.dataset;
		if (!type) return;
		crtOperElRef.current = {
			type,
			mouseX: e.clientX,
			mouseY: e.clientY,
		};
		console.log(crtOperElRef.current);
	};

	// 鼠标移动：计算偏移量 根据操作类型确定修改元素的哪些样式
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!crtOperElRef.current.type) return;
		// 计算鼠标偏移值
		const offsetX = e.clientX - crtOperElRef.current.mouseX;
		const offsetY = e.clientY - crtOperElRef.current.mouseY;
		// 根据不同操作类型设置不同属性
		switch (crtOperElRef.current.type) {
			// 高度变化 top 变化
			case 'line-top': {
				break;
			}
			// 高度变化
			case 'line-bottom': {
				break;
			}
			// 宽度变化 left 变化
			case 'line-left': {
				break;
			}
			// 宽度变化
			case 'line-right': {
				break;
			}
			// 宽高变化 top left 变化
			case 'pointer-top-left': {
				break;
			}
			// 宽高变化 top 变化
			case 'pointer-top-right': {
				break;
			}
			// 宽高变化 left 变化
			case 'pointer-bottom-left': {
				break;
			}
			// 宽高变化
			case 'pointer-bottom-right': {
				break;
			}
			// 元素移动 top left 变化
			case 'move': {
				break;
			}
		}
		const left = (activeEl?.height || 0) + offsetY;
		const top = (activeEl?.height || 0) + offsetY;
		console.log(offsetX, offsetY);
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
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
		>
			{elList.map((el, index) =>
				el.internal.id === activeEl?.internal.id ? null : (
					<Component key={index} options={el} index={index} />
				),
			)}
			{activeEl && (
				<Component isActive options={activeEl} index={activeEl.internal.id} />
			)}
		</div>
	);
};

export default Canvas;
