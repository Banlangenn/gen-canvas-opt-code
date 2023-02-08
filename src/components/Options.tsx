
import { Button, Row, Col, Form, Empty, FormItemProps } from 'antd';
import { useCanvasStore } from '../store';
import { OptionType, getComponentOption } from '../utils/options';
import { useEffect, useState } from 'react';
import { ComponentOptMap, ComponentType } from '../types';


const OptionsForm = ({ state }: { state: ComponentOptMap[ComponentType] }) => {
  const [form] = Form.useForm();
  const [formItems, setFormItems] = useState<OptionType[]>([]);
  /** requiredOpt: 必有字段 optionalOpt: 可选字段 */
  let requiredOpt: OptionType[],
    optionalOpt: OptionType[];

  useEffect(() => {
    [requiredOpt, optionalOpt] = getComponentOption(state.type)
    const items: OptionType[] = []
    requiredOpt.forEach(opt => {
      const key = opt.formItemProps.name as unknown as keyof ComponentOptMap[ComponentType];
      if (key && state[key]) {
        form.setFieldValue(key, state[key])
        items.push(opt);
      }
    })
    optionalOpt = optionalOpt.filter(opt => {
      const key = opt.formItemProps.name as unknown as keyof ComponentOptMap[ComponentType];
      if (key && state[key]) {
        form.setFieldValue(key, state[key])
        items.push(opt);
        return false;
      }
      return true;
    })
    setFormItems(items);

    return () => {
      form.resetFields();
      setFormItems([]);
    }
  }, [state])





  return <Form form={form}>
    <Row gutter={[20, 20]} >
      {formItems.map((item, index) => (<Col key={index} {...item.colProps}>
        <Form.Item {...item.formItemProps} />
      </Col>))}
    </Row >
  </Form>
}

/** 组件配置 */
const Options = () => {
  const { stateList } = useCanvasStore();

  const state = stateList.find(s => s.internal.isSelected);

  return state ?
    <OptionsForm state={state} /> :
    <Empty description={<span className='text-666'>未选择组件～</span>} />
}

export default Options