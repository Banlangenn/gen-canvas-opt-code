import { Alert } from 'antd';
import { useCanvasStore } from '../store';

import ComponentList from './ComponentList';
import OptionsForm from './OptionsForm';
/** 组件配置 */
const Options = () => {
	const activedEl = useCanvasStore((state) => state.activedEl);

	return (
		<>
			{activedEl?.type === 'text' && (
				<Alert
					message="文本组件不支持修改宽高，请通过最大宽度和行高来控制。"
					type="warning"
					style={{ margin: '10px 10px 0' }}
				/>
			)}
			<div className={`${activedEl && 'px-20 pt-32'}`}>
				{activedEl ? <OptionsForm /> : <ComponentList />}
			</div>
		</>
	);
};

export default Options;
