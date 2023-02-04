import {
	PictureOutlined,
	FontSizeOutlined,
	BorderOutlined,
} from '@ant-design/icons';

/** 组件类型 */
export type ComponentType = 'image' | 'text' | 'rect';

/** 组件配置信息 */
export const ComponentOptions = [
	{
		label: '图片',
		type: 'image' as ComponentType,
		icon: (
			<PictureOutlined
				style={{
					fontSize: 40,
					color: '#666',
				}}
			/>
		),
	},
	{
		label: '文本',
		type: 'text' as ComponentType,
		icon: (
			<FontSizeOutlined
				style={{
					fontSize: 40,
					color: '#666',
				}}
			/>
		),
	},
	{
		label: '矩形',
		type: 'rect' as ComponentType,
		icon: (
			<BorderOutlined
				style={{
					fontSize: 40,
					color: '#666',
				}}
			/>
		),
	},
];

/** 基础配置 */
interface BaseComponentOpt {
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

/** 组件基类 */
class BaseComponent<T = {}> {
	options: BaseComponentOpt & T;

	constructor(options: BaseComponentOpt & T) {
		this.options = options;
	}
}

/** 图片组件特有属性*/
interface ImageOpt {
	/** 图片地址 */
	url: string;
}

/** 图片组件 */
export class Image extends BaseComponent<ImageOpt> {
	constructor(options: BaseComponentOpt & ImageOpt) {
		super(options);
	}
}

/** 文本组件特有属性*/
interface TextOpt {
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

/** 文本组件 */
export class Text extends BaseComponent<TextOpt> {
	constructor(options: BaseComponentOpt & TextOpt) {
		super(options);
	}
}

/** 矩形组件特有属性*/
interface RectOpt {
	/** 边框/线段宽度 px */
	lineWidth: CanvasRenderingContext2D['lineWidth'];
	/** 填充内容颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 填充边框/线段颜色 */
	strokeStyle: CanvasRenderingContext2D['strokeStyle'];
	/** 为 'both' 时表示同时填充内容和边框 */
	mode: string;
}

/** 矩形组件 */
export class Rect extends BaseComponent<RectOpt> {
	constructor(options: BaseComponentOpt & RectOpt) {
		super(options);
	}
}
