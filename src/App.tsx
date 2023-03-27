import { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import { ExportOutlined, LeftOutlined, SyncOutlined } from '@ant-design/icons';
import { useCanvasSizeStore, useCanvasStore } from './store';
import { ComponentListOpt } from './utils/options';
import {
	ComponentType,
	CodeModalType,
	MoveDirection,
	ComponentUniType,
} from './types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './utils/constant';
import Canvas from './components/Canvas';
import CanvasSizeForm from './components/CanvasSizeForm';
import SideBar from './components/SideBar';
import Options from './components/Options';
import CodeModal from './components/CodeModal';
import Icon from './components/Icon';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';

/** 剪贴板 */
let clipboardEl: ComponentUniType | null = null;

// 复制元素
const copyEl = (activedEl: ComponentUniType | null, index: number) => {
	if (activedEl) {
		clipboardEl = cloneDeep(activedEl);
		clipboardEl.x += 5;
		clipboardEl.y += 5;
		clipboardEl.internal.id = nanoid();
		clipboardEl.internal.index = index;
		clipboardEl.name = `${clipboardEl.type}-${index}`;
	}
};

function App() {
	const {
		activedEl,
		elList,
		cancelActive,
		clearStore,
		moveActiveEl,
		deleteActivedEl,
		addEl,
		activeEl,
	} = useCanvasStore((state) => ({
		elList: state.elList,
		activedEl: state.activedEl,
		moveActiveEl: state.moveActiveEl,
		cancelActive: state.cancelActive,
		clearStore: state.clearStore,
		deleteActivedEl: state.deleteActivedEl,
		addEl: state.addEl,
		activeEl: state.activeEl,
	}));
	const canvasSize = useCanvasSizeStore((state) => state.size);
	const updateCanvasSize = useCanvasSizeStore((state) => state.updateSize);
	const [exportModalOpen, setExportModalOpen] = useState(false);
	const [codeType, setCodeType] = useState<CodeModalType>('export');
	console.log('[ rende ] >');

	const canvasStyle = useMemo(
		() => ({
			width: canvasSize.width,
			height: canvasSize.height,
			margin: '0 auto',
			flexShrink: 0,
		}),
		[canvasSize],
	);

	// 注册键盘按下事件
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [activedEl]);

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

	// 导入导出代码
	const handleCode = (type: CodeModalType) => {
		cancelActive();
		setCodeType(type);
		setExportModalOpen(true);
	};

	// 键盘按下
	const handleKeyDown = (e: KeyboardEvent) => {
		// 删除键，删除正在激活的组件
		if (
			activedEl &&
			e.code === 'Backspace' &&
			!['INPUT', 'TEXTAREA'].includes(e?.target?.nodeName)
		) {
			Modal.confirm({
				title: '提示',
				content: '确定删除该组件吗？',
				onOk() {
					deleteActivedEl();
				},
			});
		}
		// 上下左右方向键 移动组件
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
			e.preventDefault();
			moveActiveEl(e.code as MoveDirection);
		}

		// Esc 取消选择
		if (e.code === 'Escape') {
			cancelActive();
		}

		// 复制
		if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
			e.preventDefault();
			copyEl(activedEl, elList.length);
		}
		// 粘贴
		if ((e.ctrlKey || e.metaKey) && e.code === 'KeyV' && clipboardEl) {
			e.preventDefault();
			addEl(clipboardEl);
			activeEl(clipboardEl);
			// 将最新元素添加到粘贴板
			copyEl(clipboardEl, clipboardEl.internal.index + 1);
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
				<div className="py-[100px]">
					<div className="w-[375px] mx-auto mb-16">
						<Button
							type="primary"
							icon={<Icon type="icon-line-codesslashdaimasxiegang" />}
							onClick={() => handleCode('import')}
						>
							导入代码
						</Button>
						<Button
							type="primary"
							className="ml-10"
							icon={<ExportOutlined />}
							onClick={() => handleCode('export')}
						>
							导出代码
						</Button>
						<Button
							type="primary"
							className="ml-10"
							icon={<SyncOutlined />}
							onClick={handleRest}
						>
							重置画布
						</Button>
					</div>
					<CanvasSizeForm
						width={canvasSize.width}
						height={canvasSize.height}
						onChange={updateCanvasSize}
					></CanvasSizeForm>
					<Canvas style={canvasStyle} />
				</div>
			</div>
			<SideBar
				title={activedEl ? '配置' : '组件列表'}
				width={400}
				position="right"
				titleLeft={
					activedEl && (
						<LeftOutlined className="cursor-pointer" onClick={cancelActive} />
					)
				}
			>
				<Options />
			</SideBar>
			<CodeModal
				open={exportModalOpen}
				setOpen={setExportModalOpen}
				type={codeType}
			/>
		</div>
	);
}

export default App;
