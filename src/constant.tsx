import {
	PictureOutlined,
	FontSizeOutlined,
	BorderOutlined,
} from '@ant-design/icons';

/** 组件配置信息 */
export const ComponentOptions = [
	{
		label: '图片',
		type: 'image',
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
		type: 'text',
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
		type: 'rect',
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
