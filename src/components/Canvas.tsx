import { useCanvasStore } from '../store';
import { ComponentType } from '../types';
import { addOption } from '../utils';
import Component from './Component';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	const { stateList, updateStateList } = useCanvasStore();

	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
		addOption(stateList, type);
		stateList.forEach(s => {
			s.internal.isSelected = false;
		});
		stateList[stateList.length - 1].internal.isSelected = true;
		updateStateList(stateList);
	};

	return (
		<div
			className='bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)] overflow-hidden relative'
			style={style}
			onDragOver={e => e.preventDefault()}
			onDrop={handleDrop}
		>
			{stateList.map((state, index) => (
				<Component
					key={index}
					type={state.type}
					options={state}
					index={index}
				/>
			))}
		</div>
	);
};

export default Canvas;
