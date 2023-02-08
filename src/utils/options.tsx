import {
	PictureOutlined,
	FontSizeOutlined,
	BorderOutlined,
} from '@ant-design/icons';
import { InputNumber, ColProps, FormItemProps, Input, Select } from 'antd'
import { ComponentType } from '../types';

/** 组件列表 */
export const ComponentList = [
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

export interface OptionType {
	/** 是否为可选字段 可选字段可以动态增删 */
	isOptional?: boolean;
	/** Col Props */
	colProps: ColProps,
	/** From.Item Props */
	formItemProps: FormItemProps
}

export interface OptionsMapType {
	/** 必填配置 */
	required: OptionType[];
	/** 可选配置 */
	optional: OptionType[];
}

/** 组件配置 */
export const getComponentOption = (type: ComponentType) => {
	if (!type) return [[], []]
	/** 基础配置 */
	const baseOptions: OptionsMapType = {
		required: [
			{
				colProps: {
					span: 12
				},
				formItemProps: {
					label: 'X',
					name: 'x',
					children: <InputNumber min={0} />
				},
			},
			{
				colProps: {
					span: 12
				},
				formItemProps: {
					label: 'Y',
					name: 'y',
					children: <InputNumber min={0} />
				},
			},
			{
				colProps: {
					span: 12
				},
				formItemProps: {
					label: '宽',
					name: 'width',
					children: <InputNumber min={0} />
				},
			},
			{
				colProps: {
					span: 12
				},
				formItemProps: {
					label: '高',
					name: 'height',
					children: <InputNumber min={0} />
				},
			},
			{
				colProps: {
					span: 24
				},
				formItemProps: {
					label: 'name',
					name: 'name',
					children: <Input />
				},
			},
		],
		optional: [
			{
				isOptional: true,
				colProps: {
					span: 12
				},
				formItemProps: {
					label: '圆角',
					name: 'radius',
					children: <InputNumber min={0} />
				},
			},
		]
	};

	/** 特有配置 */
	const specificOptions: { [key: string]: OptionsMapType } = {
		image: {
			required: [
				{
					colProps: {
						span: 24
					},
					formItemProps: {
						label: '图片地址',
						name: 'url',
						children: <Input.TextArea />
					},
				},
			],
			optional: []
		},
		text: {
			required: [
				{
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '颜色',
						name: 'fillStyle',
						children: <Input type='color' />
					},
				},
				{
					colProps: {
						span: 24
					},
					formItemProps: {
						label: '字号字体',
						name: 'font',
						children: <Input placeholder='示例：11px PingFang-SC-Medium' />
					},
				},
				{
					colProps: {
						span: 24
					},
					formItemProps: {
						label: '内容',
						name: 'content',
						children: <Input.TextArea />
					},
				},
			],
			optional: [
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '水平对齐',
						name: 'align',
						children: <Select
							defaultValue="left"
							options={[
								{ value: 'left', label: '左' },
								{ value: 'center', label: '中' },
								{ value: 'right', label: '右' },
							]}
						/>
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '垂直对齐',
						name: 'baseline',
						children: <Select
							defaultValue="bottom"
							options={[
								{ value: 'top', label: '上' },
								{ value: 'middle', label: '中' },
								{ value: 'bottom', label: '下' },
							]}
						/>
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '最大宽度',
						name: 'maxWidth',
						children: <InputNumber min={0} />
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '最多行数',
						name: 'rowCount',
						children: <InputNumber min={1} />
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '行高',
						name: 'lineHeight',
						children: <InputNumber min={0} />
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '文本装饰',
						name: 'textDecoration',
						children: <Select
							defaultValue="line-through"
							options={[
								{ value: 'line-through', label: '删除线' },
							]}
						/>
					},
				},
			],
		},
		rect: {
			required: [
				{
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '填充颜色',
						name: 'fillStyle',
						children: <Input type='color' />
					},
				},
			],
			optional: [
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '边框宽度',
						name: 'lineWidth',
						children: <InputNumber min={0} />
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '边框',
						name: 'strokeStyle',
						children: <Input type='color' />
					},
				},
				{
					isOptional: true,
					colProps: {
						span: 12
					},
					formItemProps: {
						label: '填充模式',
						name: 'mode',
						children: <Select
							defaultValue="both"
							options={[
								{ value: 'both', label: '填充内容和边框' },
							]}
						/>
					},
				}
			],
		},
	}

	return [
		[
			...baseOptions.required,
			...specificOptions[type].required
		],
		[
			...baseOptions.optional,
			...specificOptions[type].optional
		]
	]
}