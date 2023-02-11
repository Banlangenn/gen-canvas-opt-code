import { InputNumber } from 'antd';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/constant';

interface PropsType {
	/** 宽度 */
	width: number;
	/** 高度 */
	height: number;
	/** 设置宽高 */
	onChange(width: number, height: number): void;
	/** children */
	children?: React.ReactNode;
}

/** 设置画布大小 */
const CanvasSizeForm = ({
	width = CANVAS_WIDTH,
	height = CANVAS_HEIGHT,
	onChange,
	children,
}: PropsType) => {
	return (
		<div className='flex items-center text-16 text-555'>
			<span className='mr-6'>画布尺寸</span>
			<InputNumber
				min={1}
				max={375}
				value={width}
				onChange={val => onChange(val || 1, height)}
			/>
			<span className='mx-6'>x</span>
			<InputNumber
				min={1}
				value={height}
				onChange={val => onChange(width, val || 1)}
			/>
			{children}
		</div>
	);
};

export default CanvasSizeForm;
