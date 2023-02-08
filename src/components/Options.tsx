
import { useEffect, useMemo, useState } from 'react';
import { Button, Row, Col, Form, Empty, FormItemProps } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash'
import { useCanvasStore } from '../store';
import { OptionType, getComponentOption } from '../utils/options';
import { ComponentOptMap, ComponentType } from '../types';


const OptionsForm = ({ state }: { state: ComponentOptMap[ComponentType] }) => {
  const { stateList, updateStateList } = useCanvasStore();
  const [form] = Form.useForm();
  /** 表单项 根据已有值字段得出 */
  const [formItems, setFormItems] = useState<OptionType[]>([]);
  /** 可选表单项 可以动态添加 */
  const [optionalItems, setOptionalItems] = useState<OptionType[]>([]);

  useEffect(() => {
    /** requiredOpt: 必有字段 optionalOpt: 可选字段 */
    const [requiredOpt, optionalOpt] = getComponentOption(state.type)
    /** 根据必有字段和可选字段中有值的字段得出 */
    const items: OptionType[] = []
    requiredOpt.forEach(opt => {
      const key = opt.formItemProps.name as unknown as keyof ComponentOptMap[ComponentType];
      form.setFieldValue(key, state[key])
      items.push(opt);
    })
    /** 将有值的字段 */
    setOptionalItems(optionalOpt.filter(opt => {
      const key = opt.formItemProps.name as unknown as keyof ComponentOptMap[ComponentType];
      if (key && state[key]) {
        form.setFieldValue(key, state[key])
        items.push(opt);
        return false;
      }
      return true;
    }));
    setFormItems(items);

    return () => {
      form.resetFields();
      setFormItems([]);
      setOptionalItems([]);
    }
  }, [state])

  // 表单字段修改
  const handleValuesChange = (value: any) => {
    updateStateList(stateList.map(s => {
      return s.internal.id === state.internal.id ? { ...state, ...value } : s
    }))
  }

  return <Form form={form} onValuesChange={debounce(handleValuesChange, 500)}>
    <Row gutter={[20, 0]} >
      {formItems.map((item, index) => (<Col key={index} {...item.colProps}>
        <Form.Item {...item.formItemProps} />
      </Col>))}
      <Col span={24}>
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => { }}
            style={{ width: '100%' }}
            icon={<PlusOutlined />}
          >
            Add field
          </Button>
        </Form.Item>
      </Col>

    </Row >
  </Form>
}

/** 组件配置 */
const Options = () => {
  const stateList = useCanvasStore(state => state.stateList);
  const state = stateList.find(s => s.internal.isSelected);

  return state ?
    <OptionsForm state={state} key={state.internal.id} /> :
    <Empty description={<span className='text-666'>未选择组件～</span>} />
}

export default Options