import { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Empty, Dropdown, Space, Upload } from 'antd';
import {
	PlusOutlined,
	MinusCircleOutlined,
	DeleteOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { useCanvasStore } from '../store';
import { OptionType, getComponentOption } from '../utils/options';
import { ComponentUniType } from '../types';
import { DEFAULT_VALUES } from '../utils/constant';

const OptionsForm = () => {
	const activedEl = useCanvasStore(
		(state) => state.activedEl,
	) as ComponentUniType;
	const { updateActivedEl, deleteActivedEl } = useCanvasStore((state) => ({
		updateActivedEl: state.updateActivedEl,
		deleteActivedEl: state.deleteActivedEl,
	}));

	const [form] = Form.useForm();
	/** 表单项 根据已有值字段得出 */
	const [formItems, setFormItems] = useState<OptionType[]>([]);
	/** 可选表单项 可以动态添加 */
	const [optionalItems, setOptionalItems] = useState<OptionType[]>([]);

	useEffect(() => {
		/** requiredOpt: 必有字段 optionalOpt: 可选字段 */
		const [requiredOpt, optionalOpt] = getComponentOption(activedEl.type);
		/** 根据必有字段和可选字段中有值的字段得出 */
		const items: OptionType[] = [];

		// 将必选字段加入到表单项中
		requiredOpt.forEach((opt) => {
			const key = opt.formItemProps.name as unknown as keyof ComponentUniType;
			form.setFieldValue(key, activedEl[key]);
			items.push(opt);
		});

		/** 将有值的可选字段添加到表单中 */
		setOptionalItems(
			optionalOpt.filter((opt) => {
				// 字段名
				const key = opt.formItemProps.name as unknown as keyof ComponentUniType;
				// 根据 state 中是否有值确定是否将可选项加入表单
				if (key && activedEl.hasOwnProperty(key)) {
					// 可选项添加标识
					opt.isOptional = true;
					form.setFieldValue(key, activedEl[key]);
					items.push(opt);
					// 添加到表单后将该项从可选列表中剔除
					return false;
				}
				return true;
			}),
		);

		setFormItems(items);

		return () => {
			form.resetFields();
			setFormItems([]);
			setOptionalItems([]);
		};
	}, [activedEl]);

	// 删除表单字段
	const handleDelete = (name: keyof ComponentUniType) => {
		const newState = {} as ComponentUniType;
		Object.keys(activedEl).forEach((key) => {
			if (key !== name) {
				// @ts-ignore
				newState[key] = activedEl[key];
			}
		});
		updateActivedEl(newState);
	};

	// 添加表单字段
	const handleAddField = (val: any) => {
		const { key } = val;
		updateActivedEl({
			...activedEl,
			// @ts-ignore
			[key]: DEFAULT_VALUES[activedEl.type][key],
		});
	};

	// 删除组件
	const handleDeleteEl = () => {
		deleteActivedEl();
	};

	// 失去焦点，同步状态
	const handleBlur = () => {
		const values = form.getFieldsValue();
		updateActivedEl({
			...activedEl,
			...values,
		});
	};

	// 渲染表单项
	const renderFormItem = (item: OptionType) => {
		if (item.isOptional) {
			return (
				<Form.Item>
					<Space align="baseline">
						<Form.Item {...item.formItemProps} />
						<MinusCircleOutlined
							style={{
								fontSize: 20,
								color: '#666',
								marginLeft: 10,
								verticalAlign: 'middle',
							}}
							onClick={() =>
								handleDelete(item.formItemProps.name as keyof ComponentUniType)
							}
						/>
					</Space>
				</Form.Item>
			);
		} else if (item.formItemProps.name === 'url') {
			return (
				<Form.Item>
					<Space align="baseline">
						<Form.Item {...item.formItemProps} />
						<Upload
							action=""
							accept="image/*"
							fileList={[]}
							beforeUpload={(file) => {
								const url = URL.createObjectURL(file);
								form.setFieldValue('url', url);
								handleBlur();
								return false;
							}}
						>
							<Button icon={<UploadOutlined />} />
						</Upload>
					</Space>
				</Form.Item>
			);
		} else {
			return <Form.Item {...item.formItemProps} />;
		}
	};

	return (
		<Form form={form} onBlur={handleBlur}>
			<Row gutter={[20, 20]}>
				{formItems.map((item, index) => (
					<Col key={index} {...item.colProps}>
						{renderFormItem(item)}
					</Col>
				))}
				<Col span={24}>
					<Form.Item>
						{optionalItems.length > 0 && (
							<Dropdown
								menu={{
									items: optionalItems.map((item) => ({
										key: item.formItemProps.name as string,
										label: `${item.formItemProps.label}(${item.formItemProps.name})`,
									})),
									onClick: handleAddField,
								}}
							>
								<Button
									type="dashed"
									style={{ width: '100%' }}
									icon={<PlusOutlined />}
								>
									添加配置
								</Button>
							</Dropdown>
						)}

						<Button
							type="primary"
							danger
							style={{ width: '100%' }}
							className="mt-20"
							icon={<DeleteOutlined />}
							onClick={handleDeleteEl}
						>
							删除组件
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

/** 组件配置 */
const Options = () => {
	const activedEl = useCanvasStore((state) => state.activedEl);

	return activedEl ? (
		<OptionsForm />
	) : (
		<Empty description={<span className="text-666">未选择组件～</span>} />
	);
};

export default Options;
