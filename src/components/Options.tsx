import { useCanvasStore } from '../store';

import ComponentList from './ComponentList';
import OptionsForm from './OptionsForm';

/** 组件配置 */
const Options = () => {
	const activedEl = useCanvasStore((state) => state.activedEl);

	return (
		<div className={`${activedEl && 'px-20 pt-32'}`}>
			{activedEl ? <OptionsForm /> : <ComponentList />}
		</div>
	);
};

export default Options;
