import { useCanvasSizeStore } from '../store';
import {
	ComponentType,
	ComponentUniType,
	ImageOpt,
	TextOpt,
	RectOpt,
} from '../types';
import { DEFAULT_VALUES } from './constant';

/** 获取画布元素默认配置 */
export const getElDefaultOpt = (type: ComponentType, id: number) => {
	const { width: canvasWidth, height: canvasHeight } =
		useCanvasSizeStore.getState().size;
	const defaultOpt: any = DEFAULT_VALUES[type];
	let x = Math.round(
		canvasWidth / 2 - (type === 'text' ? canvasWidth : defaultOpt.width) / 2,
	);
	let y = Math.round(canvasHeight / 2 - defaultOpt.height / 2);
	return {
		image: {
			type: 'image',
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name: `image-${id}`,
			url: defaultOpt.url,
			internal: {
				id,
			},
		},
		text: {
			type: 'text' as ComponentType,
			x,
			y,
			lineHeight: defaultOpt.lineHeight,
			name: `text-${id}`,
			content: defaultOpt.content,
			font: defaultOpt.font,
			fillStyle: defaultOpt.fillStyle,
			width: defaultOpt.width,
			height: defaultOpt.height,
			internal: {
				id,
			},
		},
		rect: {
			type: 'rect' as ComponentType,
			x,
			y,
			width: defaultOpt.width,
			height: defaultOpt.height,
			name: `rect-${id}`,
			fillStyle: defaultOpt.fillStyle,
			mode: defaultOpt.mode,
			internal: {
				id: id,
			},
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
			style.textAlign = opt.align || 'left';
			opt.baseline && (style.verticalAlign = opt.baseline);
			opt.lineHeight && (style.lineHeight = `${opt.lineHeight}px`);
			opt.textDecoration && (style.textDecoration = opt.textDecoration);
			if (opt.rowCount && opt.rowCount > 0) {
				style.height = Math.round(
					opt.lineHeight ? opt.lineHeight * opt.rowCount : opt.rowCount * 22,
				);
			}
			if (opt.maxWidth && opt.maxWidth > 0) {
				style.width = opt.maxWidth;
				style.maxWidth = opt.maxWidth;
			}
			break;
		}

		case 'rect': {
			const opt = options as RectOpt;
			style.borderRadius = `${opt.radius}px`;
			if (opt.mode !== 'stroke') {
				// @ts-ignore
				style.backgroundColor = opt.fillStyle;
			}
			if (opt.strokeStyle && opt.mode !== 'fill') {
				style.border = `${opt.lineWidth}px solid ${opt.strokeStyle}`;
			}
			break;
		}
	}
};
