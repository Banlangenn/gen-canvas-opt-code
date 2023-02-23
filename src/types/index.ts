/** 组件类型 */
export type ComponentType = 'image' | 'text' | 'rect' | 'line' | 'circle';

/** 组件基础配置 */
export interface BaseComponentOpt {
	/** 距离画布左侧 px */
	x: number;
	/** 距离画布顶部 px */
	y: number;
	/** 宽 px */
	width: number;
	/** 高 px */
	height: number;
	/** 标识符 */
	name: string;
	/** 组件类型 */
	type: ComponentType;
	/** 内置状态 用于组件交互 导出代码时过滤掉 */
	internal: {
		/** 组件 id */
		id: string;
		/** 组件层级 */
		index: number;
	};
}

/** 图片组件配置 */
export interface ImageOpt extends BaseComponentOpt {
	type: 'image';
	/** 图片地址 */
	url: string;
	/** 圆角 px */
	radius?: number;
}

/** 文本组件配置 */
export interface TextOpt extends BaseComponentOpt {
	type: 'text';
	/** 文本颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 字号字体 style weight size family 示例: 'normal 400 14px PingFangSC-Regular' */
	font: string;
	/** 文本内容 */
	content: string;
	/** 文本水平对齐方式 */
	align?: CanvasRenderingContext2D['textAlign'];
	/** 文本基线对齐方式 */
	baseline?: CanvasRenderingContext2D['textBaseline'];
	/** 最大宽度 px 超出打点 ... */
	maxWidth?: number;
	/** 最多行数 px 超出打点 ... */
	rowCount?: number;
	/** 行高 px */
	lineHeight?: number;
	/** 文本装饰 目前只支持 line-through 删除线 */
	textDecoration?: string;
	/** 画笔透明度 范围 0-1 */
	alpha: number;
}

/** 矩形组件配置 */
export interface RectOpt extends BaseComponentOpt {
	type: 'rect';
	/** 圆角 px */
	radius?: number;
	/** 填充内容颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 边框/线段宽度 px */
	lineWidth?: CanvasRenderingContext2D['lineWidth'];
	/** 填充边框/线段颜色 */
	strokeStyle?: CanvasRenderingContext2D['strokeStyle'];
	/** 为 'both' 时表示同时填充内容和边框 */
	mode?: 'fill' | 'stroke' | 'both';
}

/** 线组件配置 */
export interface LineOpt extends RectOpt {}

/** 圆组件配置 */
export interface CircleOpt extends RectOpt {}

export interface ComponentOptMap {
	image: ImageOpt;
	text: TextOpt;
	rect: RectOpt;
	line: LineOpt;
	circle: CircleOpt;
}

/** 组件联合类型 */
export type ComponentUniType = ComponentOptMap[ComponentType];

/** 组件默认配置 */
export type NotNeededFilds = Exclude<
	keyof BaseComponentOpt,
	'width' | 'height'
>;
export type ImageDefaultOpt = Omit<ImageOpt, NotNeededFilds>;
export type TextDefaultOpt = Omit<TextOpt, NotNeededFilds>;
export type RectDefaultOpt = Omit<RectOpt, NotNeededFilds>;
export type ComponentDefaultOpt =
	| ImageDefaultOpt
	| TextDefaultOpt
	| RectDefaultOpt;
