import { useCanvasStore } from '../store';
import {
	ComponentType,
	ImageOpt,
	TextOpt,
	RectOpt,
	ComponentUniType,
} from '../types';

interface ElPropsType {
	/** 组件类型 */
	type: ComponentType;
	[key: string]: any;
}

/** 创建组件类型对应的元素 */
export const Element = ({ type, ...props }: ElPropsType) => {
	return {
		image: <img {...props} />,
		text: <p {...props} />,
		rect: <div {...props} />,
	}[type];
};

interface ComponentPropsType {
	/** 组件类型 */
	type: ComponentType;
	/** 组件配置 */
	options: ComponentUniType;
	/** 组件的层级*/
	index: number;
}

/** 画布中的组件 */
const Component = ({ type, options, index }: ComponentPropsType) => {
	const isActive = options.internal.isSelected;
	const { updateEl, updateActiveEl } = useCanvasStore(state => ({ updateActiveEl: state.updateActiveEl, updateEl: state.updateEl }));

	// 样式
	const style: React.CSSProperties = {
		top: options.y,
		left: options.x,
		width: options.width,
		height: options.height,
		borderRadius: options.radius,
		position: 'absolute',
		zIndex: index,
	};
	// 特有属性
	const specific: any = {};

	// 设置不同元素的样式和属性
	switch (type) {
		case 'image': {
			specific.src = (options as ImageOpt).url;
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
			style.display = 'inline-block';
			style.overflow = 'hidden';
			style.textOverflow = 'ellipsis';
			if (opt.rowCount && opt.rowCount > 1) {
				style.display = '-webkit-box';
				style.WebkitLineClamp = opt.rowCount;
				style.WebkitBoxOrient = 'vertical';
			} else {
				style.whiteSpace = 'nowrap';
			}
			specific.children = opt.content;
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

	/** 事件处理 */
	// 元素点击
	const handleClick = () => {
		if (isActive) return;
		updateEl(options);

	};
	return (
		<Element
			type={type}
			style={style}
			{...specific}
			draggable='false'
			onClick={handleClick}
		/>
	);
};

export default Component;
