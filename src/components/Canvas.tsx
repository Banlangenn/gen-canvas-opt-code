import { isEqual } from 'lodash';
import { useCanvasStore } from '../store';
import { ComponentType } from '../types';
import { getElDefaultOpt } from '../utils';
import Component from './Component';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	const elList = useCanvasStore(state => state.elList, isEqual);
	const activeEl = useCanvasStore(state => state.activeEl, isEqual);
	const { updateEl, addEl } = useCanvasStore(state => ({
		updateEl: state.updateEl,
		addEl: state.addEl,
	}));

	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
		const option = getElDefaultOpt(type, elList.length);
		addEl(option);
		updateEl(option);
	};

	return (
		<div
			className='bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] overflow-hidden relative'
			style={style}
			onDragOver={e => e.preventDefault()}
			onDrop={handleDrop}
		>
			{elList.map((el, index) =>
				el.internal.id === activeEl?.internal.id ? null : (
					<Component
						key={index}
						options={el}
						index={index}
					/>
				),
			)}
			{activeEl && (
				<Component
					isActive
					options={activeEl}
					index={activeEl.internal.id}
				/>
			)}
		</div>
	);
};

export default Canvas;
