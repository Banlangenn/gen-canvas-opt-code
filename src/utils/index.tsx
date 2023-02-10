import { ComponentType, ComponentUniType } from '../types';
import { COMPONENT_HEIGHT, COMPONENT_WIDTH, PLACEHOLDER_IMG } from './constant';

/** 获取画布元素默认配置 */
export const getElDefaultOpt = (type: ComponentType, id: number) => {
	return {
		image: {
			type: 'image',
			x: 20,
			y: 20,
			width: COMPONENT_WIDTH,
			height: COMPONENT_HEIGHT,
			name: `image-${id}`,
			url: PLACEHOLDER_IMG,
			internal: {
				id,
			},
		},
		text: {
			type: 'text' as ComponentType,
			x: 20,
			y: 20,
			width: 200,
			height: 20,
			name: `text-${id}`,
			content: '文本内容',
			font: '16px PingFang-SC-Medium',
			fillStyle: '#333333',
			internal: {
				id,
			},
		},
		rect: {
			type: 'rect' as ComponentType,
			x: 20,
			y: 20,
			width: COMPONENT_WIDTH,
			height: COMPONENT_HEIGHT,
			name: `rect-${id}`,
			fillStyle: '#cccccc',
			internal: {
				id: id,
			},
		}
	}[type] as ComponentUniType;
};
