import { InputNumber } from 'antd';

interface PropsType {
	/** 宽度 */
	width: number;
	/** 高度 */
	height: number;
	/** 设置宽高 */
	onChange(size: { width: number; height: number }): void;
}

/** 设置画布大小 */
const CanvasSizeForm = ({ width = 375, height = 650, onChange }: PropsType) => {
	return (
		<div className='flex items-center text-16 text-555'>
			<span className='mr-6'>画布尺寸</span>
			<InputNumber
				min={1}
				max={375}
				defaultValue={width}
				onChange={val => onChange({ width: val || 1, height })}
			/>
			<span className='mx-6'>x</span>
			<InputNumber
				min={1}
				defaultValue={height}
				onChange={val => onChange({ width, height: val || 1 })}
			/>
		</div>
	);
};

export default CanvasSizeForm;
