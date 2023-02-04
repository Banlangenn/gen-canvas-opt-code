/** 组件类型 */
export type ComponentType = 'image' | 'text' | 'rect';

/** 基础配置 */
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
	/** 圆角 px */
	radius?: number;
}

/** 图片组件配置 */
export interface ImageOpt extends BaseComponentOpt {
	/** 图片地址 */
	url: string;
}

/** 文本组件配置 */
export interface TextOpt extends BaseComponentOpt {
	/** 文本颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 字体大小 + 字体样式 示例: '11px PingFang-SC-Medium' */
	font: string;
	/** 文本内容 */
	content: string;
	/** 文本水平对齐方式 */
	align: CanvasRenderingContext2D['textAlign'];
	/** 文本基线对齐方式 */
	baseline: CanvasRenderingContext2D['textBaseline'];
	/** 最大宽度 px 超出打点 ... */
	maxWidth: number;
	/** 最多行数 px 超出打点 ... */
	rowCount: number;
	/** 行高 px */
	lineHeight: number;
	/** 文本装饰 目前只支持 line-through 删除线 */
	textDecoration: string;
}

/** 矩形组件配置 */
export interface RectOpt extends BaseComponentOpt {
	/** 边框/线段宽度 px */
	lineWidth: CanvasRenderingContext2D['lineWidth'];
	/** 填充内容颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 填充边框/线段颜色 */
	strokeStyle: CanvasRenderingContext2D['strokeStyle'];
	/** 为 'both' 时表示同时填充内容和边框 */
	mode: string;
}
