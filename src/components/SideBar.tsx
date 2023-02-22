interface PropsType {
	/** 标题 */
	title: string;
	/** 宽度 px */
	width: number;
	/** 位置 左或右 */
	position?: 'left' | 'right';
	/** 标题左侧插槽 */
	titleLeft?: React.ReactNode;
	/** 标题右侧插槽 */
	titleRight?: React.ReactNode;
	/** children */
	children?: React.ReactNode;
}

/** 侧边栏 */
const SideBar = ({
	title = 'Side Bar',
	width = 260,
	position = 'left',
	titleLeft,
	titleRight,
	children = null,
}: PropsType) => {
	return (
		<div
			className="h-[100vh] overflow-y-scroll bg-white transition-all duration-300 relative"
			style={{
				width,
				boxShadow:
					position === 'left'
						? '-5px 0 20px 0 rgba(0,0,0,0.25)'
						: '5px 0 20px 0 rgba(0,0,0,0.25)',
			}}
		>
			<div className="bg-[#cccccc50] h-[60px] flex items-center justify-between text-444 text-24 font-medium sticky top-0 z-50 left-0 px-16">
				{titleLeft || <div />}
				{title}
				{titleRight || <div />}
			</div>
			{children}
		</div>
	);
};

export default SideBar;
