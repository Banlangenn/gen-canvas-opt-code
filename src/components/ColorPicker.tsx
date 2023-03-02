import { useEffect, useState } from 'react';
import { Button, Input, Popover } from 'antd';
import { HexAlphaColorPicker } from 'react-colorful';
import { debounce } from 'lodash';
import { CheckOutlined } from '@ant-design/icons';

interface PropsType {
	value?: string;
	onChange?: (value: string) => void;
	onComplete?: () => void;
}

/** 验证16进制颜色值（包含透明度） */
const validateHexColor = (color: string) => {
	// 16进制颜色值正则表达式
	const hexColorRegex = /^#?([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
	return hexColorRegex.test(color);
};

/** 颜色选择器 */
const ColorPicker = ({ value, onChange, onComplete }: PropsType) => {
	const [hexValue, setHexValue] = useState('');

	useEffect(() => {
		setHexValue(value?.replace('#', '') || '');
	}, [value]);

	const handleChange = (val: string) => {
		setHexValue(val.replace('#', ''));
		onChange?.(val);
	};

	const handleInput = (e: any) => {
		const hex = e.target.value;
		setHexValue(hex);
		validateHexColor(hex) && onChange?.(`#${hex}`);
	};

	return (
		<Popover
			trigger="click"
			onOpenChange={(open) => !open && onComplete?.()}
			content={
				<div>
					<HexAlphaColorPicker
						color={`#${hexValue}`}
						onChange={debounce(handleChange, 200)}
					/>
					<Input.Group compact className="mt-12">
						<Input
							addonBefore="#"
							value={hexValue}
							className="w-[140px]"
							onBlur={(e) => e.stopPropagation()}
							onChange={handleInput}
							onPressEnter={onComplete}
						/>
						<Button icon={<CheckOutlined />} onClick={onComplete} />
					</Input.Group>
				</div>
			}
		>
			<div className="w-[116px] h-32 flex py-4 items-center px-6 text-[#000000e0] text-14 border border-[#d9d9d9] border-solid rounded-6 box-border cursor-pointer">
				<div
					className="h-full w-[40px] rounded-6 mr-8"
					style={{
						backgroundColor: value,
						boxShadow:
							'rgba(0, 0, 0, 0.2) 0px 1px 2px -1px, rgba(0, 0, 0, 0.09) 0px 0px 0px 1px inset',
					}}
				/>
				{value}
			</div>
		</Popover>
	);
};

export default ColorPicker;
