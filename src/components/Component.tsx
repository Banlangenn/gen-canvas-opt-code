import { ComponentType, ImageOpt, TextOpt, RectOpt } from '../types';

interface PropsType {
	/** 组件类型 */
	type: ComponentType;
	[key: string]: any;
}

/** 创建组件类型对应的元素 */
export const Element = ({ type, ...props }: PropsType) => {
	return {
		image: <img {...props} />,
		text: <p {...props} />,
		rect: <div {...props} />,
	}[type];
};

/** 画布中的组件 */
const Component = ({ type }: PropsType) => {
	return <div>Component</div>;
};

export default Component;
