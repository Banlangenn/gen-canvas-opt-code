import React from 'react';
import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Empty, Table, Button, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCanvasStore } from '../store';
import { isEqual, cloneDeep } from 'lodash';
import { ComponentUniType } from '../types';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: props['data-row-key'],
	});

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
		transition,
		...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
		cursor: 'pointer',
	};

	return (
		<tr {...props} ref={setNodeRef} style={style} {...attributes}>
			{React.Children.map(children, (child) => {
				if ((child as React.ReactElement).key === 'sort') {
					return React.cloneElement(child as React.ReactElement, {
						children: (
							<MenuOutlined
								ref={setActivatorNodeRef}
								style={{ touchAction: 'none', cursor: 'move', fontSize: 20 }}
								{...listeners}
							/>
						),
					});
				}
				return child;
			})}
		</tr>
	);
};

/** 组件列表 */
const ComponentList = () => {
	const elList = useCanvasStore((state) => state.elList, isEqual);
	const { activeEl, updateElList, setHoveredEl } = useCanvasStore((state) => ({
		activeEl: state.activeEl,
		setHoveredEl: state.setHoveredEl,
		updateElList: state.updateElList,
	}));
	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			const list = cloneDeep(elList);
			const activeIndex = list.findIndex((el) => el.internal.id === active.id);
			const overIndex = list.findIndex((el) => el.internal.id === over?.id);
			// 重排顺序
			const newList = arrayMove(list, activeIndex, overIndex);
			newList.forEach((el, i) => (el.internal.index = i));
			// 更新列表
			updateElList(newList);
		}
	};

	const columns: ColumnsType<ComponentUniType> = [
		{
			key: 'sort',
		},
		{
			title: '名称',
			dataIndex: 'name',
		},
		{
			title: '层级',
			render: (el) => el.internal.index,
			defaultSortOrder: 'descend',
			sorter: (a, b) => a.internal.index - b.internal.index,
		},
		{
			title: '操作',
			render: (el) => (
				<>
					<Button
						danger
						icon={<DeleteOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							Modal.confirm({
								title: '提示',
								content: '确认删除该组件？',
								onOk() {
									updateElList(
										elList.filter((i) => i.internal.id !== el.internal.id),
									);
								},
							});
						}}
					>
						删除
					</Button>
				</>
			),
		},
	];

	return elList.length > 0 ? (
		<DndContext onDragEnd={onDragEnd}>
			<SortableContext
				// rowKey array
				items={elList.map((el) => el.internal.id)}
				strategy={verticalListSortingStrategy}
			>
				<Table
					showHeader={true}
					pagination={false}
					components={{
						body: {
							row: Row,
						},
					}}
					onRow={(record) => {
						return {
							onMouseEnter: () => setHoveredEl(record.internal.id), // 鼠标移入行
							onMouseLeave: () => setHoveredEl(null),
							onClick: () => {
								activeEl(record);
								setHoveredEl(null);
							},
						};
					}}
					showSorterTooltip={false}
					rowKey={(el) => el.internal.id}
					columns={columns}
					dataSource={elList}
				/>
			</SortableContext>
		</DndContext>
	) : (
		<Empty
			style={{ marginTop: 60 }}
			description={<span className="text-666">这里还没有组件～</span>}
		/>
	);
};

export default ComponentList;
