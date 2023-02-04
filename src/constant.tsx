import {
	PictureOutlined,
	FontSizeOutlined,
	BorderOutlined,
} from '@ant-design/icons';
import { ComponentType } from './types';

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
