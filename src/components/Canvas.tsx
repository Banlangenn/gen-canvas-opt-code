import React from 'react';

interface PropsType {
	/** 样式 */
	style: React.CSSProperties;
}

/** 画布 */
const Canvas = ({ style }: PropsType) => {
	return (
		<div
			className='bg-white shadow-[2px_2px_20px_0_rgba(0,0,0,0.25)]'
			style={style}
		></div>
	);
};

export default Canvas;
