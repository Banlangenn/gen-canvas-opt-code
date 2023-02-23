import { ComponentType, ComponentDefaultOpt } from '../types';

/** 画布默认宽度 */
export const CANVAS_WIDTH = 375;
/** 画布默认高度 */
export const CANVAS_HEIGHT = 650;

/** 组件配置默认值 */
export const DEFAULT_VALUES: Record<ComponentType, ComponentDefaultOpt> = {
	text: {
		/** 文字的水平对齐 left/right/center */
		align: 'left',
		/** 画笔透明度 范围 0-1 */
		alpha: 1,
		/** 文字的竖直对齐方式 top/middle/bottom */
		baseline: 'bottom',
		/** 文本内容 */
		content: '文本内容',
		/** 字体颜色 */
		fillStyle: '#111111',
		/** 字号字体 style weight size family */
		font: 'normal 400 14px PingFangSC-Regular',
		/** 行高 */
		lineHeight: 20,
		/** 最大宽度 */
		maxWidth: 375,
		/** 最大行数 */
		rowCount: 1,
		/** 文本装饰 */
		textDecoration: 'line-through',
		width: 375,
		height: 20,
	},
	image: {
		/** 图片高度 */
		height: 300,
		/** 图片宽度 */
		width: 300,
		/** 图片圆角 */
		radius: 4,
		/** 图片链接 */
		url: 'https://static.guaguayoupin.com/ui/mini-ggyp/avatar/default_avatar.jpg',
	},
	rect: {
		/** 填充颜色 */
		fillStyle: '#cccccc',
		/** 矩形路径的高度 */
		height: 100,
		/** 矩形路径的宽度 */
		width: 100,
		/** 边框线条的宽度，单位px */
		lineWidth: 1,
		/** 绘制方式 strock/fill/both */
		mode: 'fill',
		/** 描边颜色 */
		strokeStyle: '#000000',
		/** 图片圆角 */
		radius: 4,
	},
	line: {
		/** 填充颜色 */
		fillStyle: '#cccccc',
		/** 矩形路径的高度 */
		height: 1,
		/** 矩形路径的宽度 */
		width: 300,
		/** 绘制方式 stroke/fill/both */
		mode: 'fill',
	},
	circle: {
		/** 填充颜色 */
		fillStyle: '#cccccc',
		/** 矩形路径的高度 */
		height: 100,
		/** 矩形路径的宽度 */
		width: 100,
		/** 绘制方式 strock/fill/both */
		mode: 'fill',
		/** 图片圆角 */
		radius: 50,
	},
};
