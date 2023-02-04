import React from 'react';
import { ComponentType } from '../constant';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	// 放置组件
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const type = event.dataTransfer.getData('type') as ComponentType;
	};

	return (
		<div
			className='bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]'
			style={style}
			onDragOver={e => e.preventDefault()}
			onDrop={handleDrop}
		></div>
	);
};

export default Canvas;
