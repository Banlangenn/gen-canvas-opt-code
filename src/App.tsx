import { Button } from 'antd';
import { useState } from 'react';
import Canvas from './components/Canvas';
import CanvasSizeForm from './components/CanvasSizeForm';
import SideBar from './components/SideBar';
import { ComponentOptions } from './constant';
import { ComponentType } from './types';

function App() {
	const [canvasSize, setCanvasSize] = useState({ width: 375, height: 650 });

	// 开始拖拽
	const handleDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		type: ComponentType,
	) => {
		// 设置组件类型
		event.dataTransfer.setData('type', type);
	};

	return (
		<div className='w-full h-[100vh] flex justify-center'>
			<SideBar title='组件' width={260}>
				<div className='flex flex-wrap'>
					{ComponentOptions.map(item => (
						<div
							key={item.type}
							draggable
							className='flex flex-col justify-center items-center w-[100px] h-[100px] rounded-8 bg-[#cccccc33] odd:mr-20 mb-20 cursor-pointer hover:shadow-2xl transition-all duration-300'
							onDragStart={e => handleDragStart(e, item.type)}
						>
							{item.icon}
							<span className='text-18 text-666 mt-[3px]'>
								{item.label}
							</span>
						</div>
					))}
				</div>
			</SideBar>
			<div className='flex-1 flex items-center flex-col h-[100vh] overflow-y-scroll pt-[100px]'>
				<CanvasSizeForm
					width={canvasSize.width}
					height={canvasSize.height}
					onChange={setCanvasSize}
				>
					<Button type='primary' className='ml-20'>
						导出
					</Button>
				</CanvasSizeForm>
				<Canvas
					style={{
						width: canvasSize.width,
						height: canvasSize.height,
						marginTop: 20,
						marginBottom: 100,
						flexShrink: 0,
					}}
				/>
			</div>
			<SideBar title='配置' width={300} position='right'>
				配置
			</SideBar>
		</div>
	);
}

export default App;
