import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from './../../store';
import { ComponentType, ComponentUniType } from './../../types';
import { getElDefaultOpt } from './../../utils';
import {
	createApp,
	ImageShape,
	TextShape,
	StrokeShape,
	loadImage,
	computeMaxArea,
	GroupShape,
	RubberShape,
	RectShape,
	TextTowShape,
	Crop,
} from './src';
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

const createEdit = async () => {
	// console.log(document.querySelector('.App'))
	const cropInstance = createApp({
		el: '.canvas',
		penColor: '#f80',
		penWidth: 2,
		status: 211,
		canDraw: true,
		canRender: true,
		nativeEventStop: false,
		nativeEventPrev: false,
		graphics: [
			GroupShape,
			ImageShape,
			RubberShape,
			RectShape,
			TextShape,
			StrokeShape,
			TextTowShape,
		],
	});

	return cropInstance;
};

const genData = (data: any) => {
	if (!data || !data.type) {
		throw new Error('Data object must contain a "type" property');
	}

	const type = data.type;

	switch (type) {
		case 'rect': {
			const rectData = {
				x: data.x,
				y: data.y,
				color: data.fillStyle as string,
				fillColor: data.fillStyle as string,
				width: data.width,
				height: data.height,
				id: data.internal.id,
				fill: true,
				radius: data.radius,
			};

			return [11, rectData] as const;
		}

		case 'text': {
			const fontSize = Number(data.font.match(/\d+(?=px)/)[0]);

			const textData = {
				ellipsis: data.rowCount && data.rowCount > 0,
				height: data.rowCount
					? data.rowCount * (data.lineHeight || 0)
					: Math.max(data.height, data.lineHeight || 0),
				textAlign: data.align,
				x: data.x,
				y: data.y,
				fontSize,
				color: data.fillStyle as string,
				fillColor: data.fillStyle as string,
				strokeColor: data.fillStyle,
				lineHeight: data.lineHeight,
				width: data.maxWidth || data.content.length * fontSize,
				text: data.content as string,
				alpha: data.alpha as string,
				id: data.internal.id,
			};

			return [21, textData] as const;
		}

		case 'image': {
			const imageData = {
				imageOrUri: data.url,
				x: data.x,
				y: data.y,
				width: data.width,
				height: data.height,
				id: data.internal.id,
			};

			return [8, imageData] as const;
		}

		default: {
			// throw new Error(`Unknown type "${type}"`);
			return null;
		}
	}
};
const genIdMap = (list: { internal: { id: string } }[]) => {
	return {
		idsObj: list.reduce<{ [x: string]: boolean }>((p, n) => {
			p[n.internal.id] = true;
			return p;
		}, {}),
		length: list.length,
	};
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

	const idMap = useRef(genIdMap(elList as any));

	const containerRef = useRef<Crop>();
	useEffect(() => {
		createEdit().then((e) => {
			containerRef.current = e;
			containerRef.current.resize({
				width: style.width as number,
				height: style.height as number,
			});

			elList.forEach((e) => {
				const result = genData(e);

				if (!result) {
					return;
				}
				const [key, data] = result;

				containerRef.current?.appendToImage({
					...data,
					key,
				});
			});
		});
	}, []);
	useEffect(() => {
		containerRef.current?.resize({
			width: style.width as number,
			height: style.height as number,
		});
	}, [style]);

	// TODO: 图片渲染有问题
	// 全部删除有问题
	//
	useEffect(() => {
		if (elList.length !== Object.keys(idMap.current.idsObj).length) {
			idMap.current = genIdMap(elList as any);
		}
		const allG = containerRef.current?.getCurrentPageData(false);
		if (elList.length === 0) {
			// containerRef.current?.capturingGraphicsToRender();
			containerRef.current?.reset();
		} else if (elList.length < (allG?.length || 0)) {
			// 有删除 对比一下是哪个
			const deleteItem = allG?.find((e) => !idMap.current.idsObj[e.id]);

			if (!deleteItem) {
				return;
			}
			// containerRef.current?.capturingGraphicsToRender();
			containerRef.current?.getGraphicsById(deleteItem?.id, true);
			containerRef.current?.render();
		}
	}, [elList.length]);

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
		const result = genData(option);
		if (!result) {
			return;
		}

		const [key, data] = result;
		containerRef.current?.appendToImage({
			...data,
			key,
		});

		addEl(option);
		activeEl(option);
	};

	useEffect(() => {
		// 自己触发的操作  需要return--
		// ---
		if (elList.length === 0) return;

		if (!activedEl) {
			containerRef.current?.capturingGraphicsToRender();
			return;
		}

		const result = genData(activedEl);
		if (!result) {
			return;
		}
		const [_, data] = result;
		const curG = containerRef.current?.getActiveGraphics();

		if (!curG || curG.getData().id !== data.id) {
			//  变为编辑状态
			containerRef.current?.setCurrentGraphicsById(activedEl.internal.id);
			return;
		}

		curG.setData(data);
		containerRef.current?.capturingDrawCurrentStroke();
	}, [activedEl]);

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

		// 不能超出边界
		if (height < 0) height = 1;
		if (width < 0) width = 1;
		if (top > bottom) top = bottom;
		if (left > right) left = right;

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

	return (
		<div
			className="canvas bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] "
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onClick={cancelActive}
			style={style}
		/>
	);
};

export default Canvas;
