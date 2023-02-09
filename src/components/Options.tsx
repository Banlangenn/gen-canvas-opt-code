import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Empty, Dropdown } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { useCanvasStore } from '../store';
import { OptionType, getComponentOption } from '../utils/options';
import { ComponentUniType } from '../types';

const OptionsForm = ({ state }: { state: ComponentUniType }) => {
	const { stateList, updateStateList } = useCanvasStore();
	const [form] = Form.useForm();
	/** 表单项 根据已有值字段得出 */
	const [formItems, setFormItems] = useState<OptionType[]>([]);
	/** 可选表单项 可以动态添加 */
	const [optionalItems, setOptionalItems] = useState<OptionType[]>([]);

	useEffect(() => {
		/** requiredOpt: 必有字段 optionalOpt: 可选字段 */
		const [requiredOpt, optionalOpt] = getComponentOption(state.type);
		/** 根据必有字段和可选字段中有值的字段得出 */
		const items: OptionType[] = [];
		requiredOpt.forEach(opt => {
			const key = opt.formItemProps
				.name as unknown as keyof ComponentUniType;
			form.setFieldValue(key, state[key]);
			items.push(opt);
		});
		/** 将有值的字段 */
		setOptionalItems(
			optionalOpt.filter(opt => {
				// 可选项添加可删除组件
				opt.formItemProps.children = (
					<>
						{opt.formItemProps.children}
						<MinusCircleOutlined
							style={{
								fontSize: 20,
								color: '#666',
								marginLeft: 10,
							}}
							onClick={() =>
								handleDelete(
									opt.formItemProps
										.name as keyof ComponentUniType,
								)
							}
						/>
					</>
				);
				// 根据 state 中是否有值确定是否将可选项加入表单
				const key = opt.formItemProps
					.name as unknown as keyof ComponentUniType;
				if (key && state[key]) {
					form.setFieldValue(key, state[key]);
					items.push(opt);
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
	}, [state]);

	// 表单字段修改
	const handleValuesChange = (value: any) => {
		updateStateList(
			stateList.map(s => {
				return s.internal.id === state.internal.id
					? { ...state, ...value }
					: s;
			}),
		);
	};

	// 删除表单字段
	const handleDelete = (name: keyof ComponentUniType) => {
		console.log(name);

		updateStateList(
			stateList.map(s => {
				if (s.internal.id === state.internal.id) {
					delete s[name];
				}
				return s;
			}),
		);
	};

	// 添加表单字段
	const handleAddField = (val: any) => {
		const { key } = val;
		setOptionalItems(
			optionalItems.filter(item => {
				if (item.formItemProps.name === key) {
					setFormItems([...formItems, item]);
					return false;
				}
				return true;
			}),
		);
	};

	return (
		<Form form={form} onValuesChange={debounce(handleValuesChange, 500)}>
			<Row gutter={[20, 0]}>
				{formItems.map((item, index) => (
					<Col key={index} {...item.colProps}>
						<Form.Item {...item.formItemProps} />
					</Col>
				))}
				<Col span={24}>
					<Form.Item>
						<Dropdown
							menu={{
								items: optionalItems.map(item => ({
									key: item.formItemProps.name as string,
									label: `${item.formItemProps.label}(${item.formItemProps.name})`,
								})),
								onClick: handleAddField,
							}}
						>
							<Button
								type='dashed'
								style={{ width: '100%' }}
								icon={<PlusOutlined />}
							>
								添加字段
							</Button>
						</Dropdown>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

/** 组件配置 */
const Options = () => {
	const stateList = useCanvasStore(state => state.stateList);

	const state = stateList.find(s => s.internal.isSelected);
	console.log(state);

	return state ? (
		<OptionsForm state={state} key={state.internal.id} />
	) : (
		<Empty description={<span className='text-666'>未选择组件～</span>} />
	);
};

export default Options;
