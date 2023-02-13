import { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Empty, Dropdown, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { useCanvasStore } from '../store';
import {
	OptionType,
	getComponentOption,
	optionalFieldsDefaultValues,
} from '../utils/options';
import { ComponentUniType } from '../types';

const OptionsForm = () => {
	const activeEl = useCanvasStore(
		(state) => state.activeEl,
	) as ComponentUniType;
	const updateActiveEl = useCanvasStore((state) => state.updateActiveEl);
	const [form] = Form.useForm();
	/** 表单项 根据已有值字段得出 */
	const [formItems, setFormItems] = useState<OptionType[]>([]);
	/** 可选表单项 可以动态添加 */
	const [optionalItems, setOptionalItems] = useState<OptionType[]>([]);

	useEffect(() => {
		/** requiredOpt: 必有字段 optionalOpt: 可选字段 */
		const [requiredOpt, optionalOpt] = getComponentOption(activeEl.type);
		/** 根据必有字段和可选字段中有值的字段得出 */
		const items: OptionType[] = [];

		// 将必选字段加入到表单项中
		requiredOpt.forEach((opt) => {
			const key = opt.formItemProps.name as unknown as keyof ComponentUniType;
			form.setFieldValue(key, activeEl[key]);
			items.push(opt);
		});

		/** 将有值的可选字段添加到表单中 */
		setOptionalItems(
			optionalOpt.filter((opt) => {
				// 字段名
				const key = opt.formItemProps.name as unknown as keyof ComponentUniType;
				// 根据 state 中是否有值确定是否将可选项加入表单
				if (key && activeEl.hasOwnProperty(key)) {
					// 可选项添加标识
					opt.isOptional = true;
					form.setFieldValue(key, activeEl[key]);
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
	}, [activeEl]);

	// 表单字段修改
	const handleValuesChange = (value: any) => {
		console.log(`handleValuesChange: ${value}`);

		updateActiveEl({ ...activeEl, ...value });
	};

	// 删除表单字段
	const handleDelete = (name: keyof ComponentUniType) => {
		delete activeEl[name];
		updateActiveEl(activeEl);
	};

	// 添加表单字段
	const handleAddField = (val: any) => {
		const { key } = val;
		updateActiveEl({
			...activeEl,
			// @ts-ignore
			[key]: optionalFieldsDefaultValues[key],
		});
	};

	return (
		<Form form={form} onValuesChange={debounce(handleValuesChange, 500)}>
			<Row gutter={[20, 20]}>
				{formItems.map((item, index) => (
					<Col key={index} {...item.colProps}>
						{item.isOptional ? (
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
											handleDelete(
												item.formItemProps.name as keyof ComponentUniType,
											)
										}
									/>
								</Space>
							</Form.Item>
						) : (
							<Form.Item {...item.formItemProps} />
						)}
					</Col>
				))}
				{optionalItems.length > 0 && (
					<Col span={24}>
						<Form.Item>
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
									添加字段
								</Button>
							</Dropdown>
						</Form.Item>
					</Col>
				)}
			</Row>
		</Form>
	);
};

/** 组件配置 */
const Options = () => {
	const activeEl = useCanvasStore((state) => state.activeEl);

	return activeEl ? (
		<OptionsForm />
	) : (
		<Empty description={<span className="text-666">未选择组件～</span>} />
	);
};

export default Options;
