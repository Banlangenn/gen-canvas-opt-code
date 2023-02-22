import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ExportOutlined, SyncOutlined } from '@ant-design/icons';
import { useCanvasSizeStore, useCanvasStore } from './store';
import { ComponentListOpt } from './utils/options';
import { ComponentType } from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './utils/constant';
import Canvas from './components/Canvas';
import CanvasSizeForm from './components/CanvasSizeForm';
import SideBar from './components/SideBar';
import Options from './components/Options';
import ExportCodeModal from './components/ExportCodeModal';

function App() {
	const { cancelActive, clearStore, deleteActivedEl } = useCanvasStore(
		(state) => ({
			cancelActive: state.cancelActive,
			clearStore: state.clearStore,
			deleteActivedEl: state.deleteActivedEl,
		}),
	);
	const canvasSize = useCanvasSizeStore((state) => state.size);
	const updateCanvasSize = useCanvasSizeStore((state) => state.updateSize);
	const [exportModalOpen, setExportModalOpen] = useState(false);

	// 注册键盘按下事件
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// 开始拖拽
	const handleDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		type: ComponentType,
	) => {
		// 设置组件类型
		event.dataTransfer.setData('type', type);
	};

	// 重置
	const handleRest = () => {
		updateCanvasSize(CANVAS_WIDTH, CANVAS_HEIGHT);
		clearStore();
	};

	// 导出代码
	const handleExportCode = () => {
		cancelActive();
		setExportModalOpen(true);
	};

	// 键盘按下：监听删除键，删除正在激活的组件
	const handleKeyDown = (e: KeyboardEvent) => {
		if (
			e.code === 'Backspace' &&
			// @ts-ignore
			!['INPUT', 'TEXTAREA'].includes(e?.target?.nodeName)
		) {
			deleteActivedEl();
		}
	};

	return (
		<div className="w-[100vw] min-w-[1100px] h-[100vh] flex justify-center overflow-hidden">
			<SideBar title="组件" width={260}>
				<div className="flex flex-wrap px-20 pt-32">
					{ComponentListOpt.map((item) => (
						<div
							key={item.type}
							draggable
							className="flex flex-col justify-center items-center w-[100px] h-[100px] rounded-8 bg-[#cccccc33] odd:mr-20 mb-20 cursor-pointer hover:shadow-2xl transition-all duration-300"
							onDragStart={(e) => handleDragStart(e, item.type)}
						>
							{item.icon}
							<span className="text-18 text-666 mt-[3px]">{item.label}</span>
						</div>
					))}
				</div>
			</SideBar>
			<div className="flex-1 h-[100vh] overflow-y-scroll">
				<div className="text-center py-[100px]">
					<CanvasSizeForm
						width={canvasSize.width}
						height={canvasSize.height}
						onChange={updateCanvasSize}
					>
						<Button
							type="primary"
							className="ml-10"
							icon={<ExportOutlined />}
							onClick={handleExportCode}
						>
							导出
						</Button>
						<Button
							type="primary"
							className="ml-10"
							icon={<SyncOutlined />}
							onClick={handleRest}
						>
							重置
						</Button>
					</CanvasSizeForm>
					<Canvas
						style={{
							width: canvasSize.width,
							height: canvasSize.height,
							margin: '0 auto',
							flexShrink: 0,
						}}
					/>
				</div>
			</div>
			<SideBar title="配置" width={400} position="right">
				<Options />
			</SideBar>
			<ExportCodeModal open={exportModalOpen} setOpen={setExportModalOpen} />
		</div>
	);
}

export default App;
