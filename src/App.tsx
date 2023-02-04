import { useState } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import CanvasSizeForm from './components/CanvasSizeForm';
import SideBar from './components/SideBar';
import { ComponentOptions } from './constant';

function App() {
	const [canvasSize, setCanvasSize] = useState({ width: 375, height: 650 });

	return (
		<div className='w-full h-[100vh] flex justify-center'>
			<SideBar title='组件' width={260}>
				<div className='flex flex-wrap'>
					{ComponentOptions.map(item => (
						<div
							key={item.type}
							draggable
							className='flex flex-col justify-center items-center w-[100px] h-[100px] rounded-8 bg-[#cccccc33] odd:mr-20 mb-20 cursor-pointer hover:shadow-2xl transition-all duration-300'
						>
							{item.icon}
							<span className='text-18 text-666 mt-[3px]'>
								{item.label}
							</span>
						</div>
					))}
				</div>
			</SideBar>
			<div className='flex-1 flex items-center flex-col h-[100vh] overflow-y-scroll pt-[110px]'>
				{/* <div> */}
				<CanvasSizeForm
					width={canvasSize.width}
					height={canvasSize.height}
					onChange={setCanvasSize}
				/>
				<Canvas
					style={{
						width: canvasSize.width,
						height: canvasSize.height,
						marginTop: 20,
						marginBottom: 110,
						flexShrink: 0,
					}}
				/>
				{/* </div> */}
			</div>
			<SideBar title='配置' width={300} position='right'>
				配置
			</SideBar>
		</div>
	);
}

export default App;
