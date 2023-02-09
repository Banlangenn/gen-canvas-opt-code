import { ComponentUniType, ComponentType } from '../types';
import { COMPONENT_HEIGHT, COMPONENT_WIDTH, PLACEHOLDER_IMG } from './constant';

/** 添加画布元素配置 */
export const addOption = (list: ComponentUniType[], type: ComponentType) => {
	switch (type) {
		case 'image': {
			list.push({
				type: 'image',
				x: 20,
				y: 20,
				width: COMPONENT_WIDTH,
				height: COMPONENT_HEIGHT,
				name: `image-${list.length}`,
				url: PLACEHOLDER_IMG,
				internal: {
					id: list.length,
				},
			});
			return;
		}
		case 'text': {
			list.push({
				type: 'text',
				x: 20,
				y: 20,
				width: 200,
				height: 20,
				name: `text-${list.length}`,
				content: '文本内容',
				font: '16px PingFang-SC-Medium',
				fillStyle: '#333333',
				internal: {
					id: list.length,
				},
			});
			return;
		}
		case 'rect': {
			list.push({
				type: 'rect',
				x: 20,
				y: 20,
				width: COMPONENT_WIDTH,
				height: COMPONENT_HEIGHT,
				name: `rect-${list.length}`,
				fillStyle: '#cccccc',
				internal: {
					id: list.length,
				},
			});
			return;
		}
	}
};
