import { nanoid } from 'nanoid';
import { useCanvasSizeStore, useCanvasStore } from '../store';
import {
	ComponentType,
	ComponentUniType,
	ImageOpt,
	TextOpt,
	RectOpt,
} from '../types';
import { DEFAULT_VALUES } from './constant';
import { verticalAlignMap } from './options';

/** 获取画布元素默认配置 */
export const getElDefaultOpt = (type: ComponentType) => {
	const elList = useCanvasStore.getState().elList;
	const { width: canvasWidth, height: canvasHeight } =
		useCanvasSizeStore.getState().size;
	const defaultOpt: any = DEFAULT_VALUES[type];

	// 将组件放置到画布中间
	let x = Math.round(
		canvasWidth / 2 - (type === 'text' ? canvasWidth : defaultOpt.width) / 2,
	);
	let y = Math.round(canvasHeight / 2 - defaultOpt.height / 2);

	const id = nanoid();
	const index = elList.length;
	let reType = type;
	if (['line', 'circle'].includes(type)) reType = 'rect';
	const name = `${reType}-${elList.filter((el) => el.type === reType).length}`;
	const internal = { id, index };
	return {
		image: {
			type: 'image',
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name,
			url: defaultOpt.url,
			internal,
		},
		text: {
			type: 'text',
			x,
			y,
			lineHeight: defaultOpt.lineHeight,
			maxWidth: canvasWidth,
			name,
			content: defaultOpt.content,
			font: defaultOpt.font,
			fillStyle: defaultOpt.fillStyle,
			width: canvasWidth,
			height: defaultOpt.height,
			internal,
		},
		rect: {
			type: 'rect',
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name,
			fillStyle: defaultOpt.fillStyle,
			mode: defaultOpt.mode,
			internal,
		},
		line: {
			type: 'rect',
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name,
			fillStyle: defaultOpt.fillStyle,
			mode: defaultOpt.mode,
			internal,
		},
		circle: {
			type: 'rect',
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name,
			fillStyle: defaultOpt.fillStyle,
			mode: defaultOpt.mode,
			radius: defaultOpt.radius,
			internal,
		},
	}[type] as ComponentUniType;
};

/** 根据元素类型设置不同的样式和属性 */
export const setElOpt = (
	options: ComponentUniType,
	style: React.CSSProperties,
	specific: any,
) => {
	switch (options.type) {
		case 'image': {
			const opt = options as ImageOpt;
			style.borderRadius = `${opt.radius}px`;
			style.backgroundImage = `url(${(opt as ImageOpt).url})`;
			style.backgroundRepeat = 'no-repeat';
			style.backgroundPosition = 'center center';
			style.backgroundSize = '100% 100%';
			break;
		}

		case 'text': {
			const opt = options as TextOpt;
			const [fontStyle, fontWeight, fontSize, fontFamily] = opt.font.split(' ');
			style.fontStyle = fontStyle;
			style.fontWeight = fontWeight;
			style.fontSize = fontSize;
			style.fontFamily = fontFamily;
			// @ts-ignore
			style.color = opt.fillStyle;
			style.display = 'flex';
			style.textAlign = opt.align || 'left';
			opt.baseline && (style.alignItems = verticalAlignMap[opt.baseline]);
			opt.lineHeight && (style.lineHeight = `${opt.lineHeight}px`);
			style.height = opt.lineHeight || 'auto';
			style.width = opt.maxWidth || 'auto';
			opt.textDecoration && (style.textDecoration = opt.textDecoration);
			if (opt.rowCount && opt.rowCount > 0) {
				style.height = Math.round(
					opt.lineHeight ? opt.lineHeight * opt.rowCount : opt.rowCount * 22,
				);
			}
			if (opt.maxWidth && opt.maxWidth > 0) {
				style.maxWidth = opt.maxWidth;
			}
			break;
		}

		case 'rect': {
			const opt = options as RectOpt;
			style.borderRadius = `${opt.radius}px`;
			style.border = 'none';
			style.backgroundColor = 'transparent';
			if (opt.mode !== 'stroke') {
				// @ts-ignore
				style.backgroundColor = opt.fillStyle;
			}
			if (opt.mode !== 'fill' && opt.strokeStyle && opt.lineWidth) {
				style.border = `${opt.lineWidth}px solid ${opt.strokeStyle}`;
			}
			break;
		}
	}
};

// 没有必需的key
const noReuiredKey = (key: string, item: object) => {
	throw new Error(
		`数组项必需存在：${key}，\n 错误位置：${JSON.stringify(item)}`,
	);
};
// 不符合的枚举值
const nonEnumValue = (value: string, item: object) => {
	throw new Error(`错误的取值：${value}，\n 错误位置：${JSON.stringify(item)}`);
};
/** 验证导入数据的格式 */
export const verifyImportCode = (data: any) => {
	if (!Array.isArray(data)) throw new TypeError('必需传入一个数组');
	if (data.length === 0) return true;
	for (const item of data) {
		if (!item) throw new Error('数组项不能为空');
		if (item.toString() !== '[object Object]')
			throw new TypeError('数组项必需为object');
		const keys = Object.keys(item);
		if (!keys.includes('type')) noReuiredKey('type', item);
		if (!keys.includes('name')) noReuiredKey('name', item);
		if (!keys.includes('x')) noReuiredKey('x', item);
		if (!keys.includes('y')) noReuiredKey('y', item);
		if (!['image', 'text', 'rect'].includes(item.type))
			nonEnumValue('type', item.type);
		if (item.type === 'image' && !item.url) noReuiredKey('url', item);
		if (item.type === 'text' && !item.fillStyle)
			noReuiredKey('fillStyle', item);
		if (item.type === 'text' && !item.font) noReuiredKey('font', item);
		if (item.type === 'text' && !item.content) noReuiredKey('content', item);
		if (item.type === 'rect' && !item.fillStyle)
			noReuiredKey('fillStyle', item);
	}
	return true;
};
