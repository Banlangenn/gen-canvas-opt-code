import {
	ComponentType,
	ComponentUniType,
	ImageOpt,
	TextOpt,
	RectOpt,
} from '../types';
import { COMPONENT_HEIGHT, COMPONENT_WIDTH, PLACEHOLDER_IMG } from './constant';

/** 获取画布元素默认配置 */
export const getElDefaultOpt = (type: ComponentType, id: number) => {
	return {
		image: {
			type: 'image',
			x: 20,
			y: 20,
			width: COMPONENT_WIDTH,
			height: COMPONENT_HEIGHT,
			name: `image-${id}`,
			url: PLACEHOLDER_IMG,
			internal: {
				id,
			},
		},
		text: {
			type: 'text' as ComponentType,
			x: 20,
			y: 20,
			width: 200,
			height: 20,
			name: `text-${id}`,
			content: '文本内容',
			font: '16px PingFang-SC-Medium',
			fillStyle: '#333333',
			internal: {
				id,
			},
		},
		rect: {
			type: 'rect' as ComponentType,
			x: 20,
			y: 20,
			width: COMPONENT_WIDTH,
			height: COMPONENT_HEIGHT,
			name: `rect-${id}`,
			fillStyle: '#cccccc',
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
			style.backgroundImage = `url(${(options as ImageOpt).url})`;
			style.backgroundRepeat = 'no-repeat';
			style.backgroundPosition = 'center center';
			style.backgroundSize = '100% 100%';
			break;
		}

		case 'text': {
			const opt = options as TextOpt;
			const [fontSize, fontFamily] = opt.font.split(' ');
			style.fontFamily = fontFamily;
			style.fontSize = Number(fontSize.replace('px', ''));
			// @ts-ignore
			style.color = opt.fillStyle;
			style.textAlign = opt.align || 'left';
			opt.baseline && (style.verticalAlign = opt.baseline);
			opt.maxWidth && (style.maxWidth = opt.maxWidth);
			opt.lineHeight && (style.lineHeight = opt.lineHeight);
			opt.textDecoration && (style.textDecoration = opt.textDecoration);
			if (opt.rowCount && opt.rowCount > 1) {
				style.display = '-webkit-box';
				style.WebkitLineClamp = opt.rowCount;
				style.WebkitBoxOrient = 'vertical';
			} else {
				style.whiteSpace = 'nowrap';
			}
			break;
		}

		case 'rect': {
			const opt = options as RectOpt;
			// @ts-ignore
			style.backgroundColor = opt.fillStyle;
			if (opt.strokeStyle) {
				style.border = `${opt.lineWidth}px solid ${opt.strokeStyle}`;
			}
			// TODO: opt.mode 需要验证一下才知道有没有效果
			break;
		}
	}
};
