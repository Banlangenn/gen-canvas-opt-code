interface PropsType {
	/** 标题 */
	title: string;
	/** 宽度 px */
	width: number;
	/** 位置 左或右 */
	position?: 'left' | 'right';
	/** children */
	children?: React.ReactNode;
}

/** 侧边栏 */
const SideBar = ({
	title = 'Side Bar',
	width = 260,
	position = 'left',
	children,
}: PropsType) => {
	return (
		<div
			className='h-[100vh] overflow-y-scroll bg-white transition-all duration-300'
			style={{
				width,
				boxShadow:
					position === 'left'
						? '-5px 0 20px 0 rgba(0,0,0,0.25)'
						: '5px 0 20px 0 rgba(0,0,0,0.25)',
			}}
		>
			<div className='bg-[#cccccc50] h-[60px] flex items-center justify-center text-444 text-24 font-medium mb-32 sticky top-0'>
				{title}
			</div>
			<div className='px-20'>{children}</div>
		</div>
	);
};

export default SideBar;
