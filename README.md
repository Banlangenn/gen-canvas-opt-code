# 拖拽生成小程序海报画布配置代码

## 架构

系统分为两个部分：

- 全局状态层
- 视图层

这样做的原因：

1. 视图层直接从 store 存取数据，这样不同的视图可以独立出来，每个视图只关注自己的逻辑；
2. 在 store 上定义数据格式，相当于约束了视图对外的数据格式，确保导出正确的数据；
3. 视图内部可以使用不同的技术实现（例如 Canvas 和 DOM），只需要确保输出的数据一致即可。

### 全局状态层

有两个 store：

- 画布尺寸：存储画布的宽高以及改变宽高的方法；
- 画布内容：存储画布中的组件数据以及一些改变数据的方法。

#### 画布尺寸 store

```ts
interface CanvasSizeStoreType {
	size: {
		/** 画布宽度 */
		width: number;
		/** 画布高度 */
		height: number;
	};
	/** 更新画布尺寸 */
	updateSize: (width: number, height: number) => void;
}
```

#### 画布内容 store

```ts
interface CanvasStoreType {
	/** 画布中的组件列表 */
	elList: ComponentUniType[];
	/** 当前激活的组件 */
	activedEl: ComponentUniType | null;
	/** 当前组件列表中 hover 的组件 */
	hoveredElId: string | null;
	/** 添加组件 */
	addEl: (el: ComponentUniType) => void;
	/** 激活组件，将上一次激活的组件(如果有的话)同步到列表 */
	activeEl: (el: ComponentUniType) => void;
	/** 更新激活组件的状态 */
	updateActivedEl: (el: ComponentUniType) => void;
	/** 取消激活，将当前激活的组件同步到组件列表，取消当前组件的激活状态 */
	cancelActive: () => void;
	/** 删除正在激活的组件 */
	deleteActivedEl: () => void;
	/** 更新组件列表 */
	updateElList: (list: ComponentUniType[]) => void;
	/** 清空画布(重置store) */
	clearStore: () => void;
	/** 设置 hover */
	setHoveredEl: (id: string | null) => void;
	/** 上下左右微调组件位置 */
	moveActiveEl: (type: MoveDirection) => void;
}
```

### 视图层

分为四个部分：

- 组件栏
- 画布
- 配置栏
- 导出代码弹窗

#### 组件栏

功能点：

- 展示组件列表
- 组件均可拖拽放置到画布中

实现：

- 组件 `dragstart` 开始拖拽时设置组件的类型到 `dataTransfer`，画布监听 `drop` 放置事件，根据不同类型组件创建不同的组件实例，组件实例类型如下：

```ts
/** 组件类型 */
export type ComponentType = 'image' | 'text' | 'rect' | 'line' | 'circle';

/** 组件基础配置 */
export interface BaseComponentOpt {
	/** 距离画布左侧 px */
	x: number;
	/** 距离画布顶部 px */
	y: number;
	/** 宽 px */
	width: number;
	/** 高 px */
	height: number;
	/** 标识符 */
	name: string;
	/** 组件类型 */
	type: ComponentType;
	/** 内置状态 用于组件交互 导出代码时过滤掉 */
	internal: {
		/** 组件 id */
		id: string;
		/** 组件层级 */
		index: number;
	};
}

/** 图片组件配置 */
export interface ImageOpt extends BaseComponentOpt {
	type: 'image';
	/** 图片地址 */
	url: string;
	/** 圆角 px */
	radius?: number;
}

/** 文本组件配置 */
export interface TextOpt extends BaseComponentOpt {
	type: 'text';
	/** 文本颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 字号字体 style weight size family 示例: 'normal 400 14px PingFangSC-Regular' */
	font: string;
	/** 文本内容 */
	content: string;
	/** 文本水平对齐方式 */
	align?: CanvasRenderingContext2D['textAlign'];
	/** 文本基线对齐方式 */
	baseline?: CanvasRenderingContext2D['textBaseline'];
	/** 最大宽度 px 超出打点 ... */
	maxWidth?: number;
	/** 最多行数 px 超出打点 ... */
	rowCount?: number;
	/** 行高 px */
	lineHeight?: number;
	/** 文本装饰 目前只支持 line-through 删除线 */
	textDecoration?: string;
	/** 画笔透明度 范围 0-1 */
	alpha?: number;
}

/** 矩形组件配置 */
export interface RectOpt extends BaseComponentOpt {
	type: 'rect';
	/** 圆角 px */
	radius?: number;
	/** 填充内容颜色 */
	fillStyle: CanvasRenderingContext2D['fillStyle'];
	/** 边框/线段宽度 px */
	lineWidth?: CanvasRenderingContext2D['lineWidth'];
	/** 填充边框/线段颜色 */
	strokeStyle?: CanvasRenderingContext2D['strokeStyle'];
	/** 为 'both' 时表示同时填充内容和边框 */
	mode?: 'fill' | 'stroke' | 'both';
}

/** 线组件配置 */
export interface LineOpt extends RectOpt {}

/** 圆组件配置 */
export interface CircleOpt extends RectOpt {}

export interface ComponentOptMap {
	image: ImageOpt;
	text: TextOpt;
	rect: RectOpt;
	line: LineOpt;
	circle: CircleOpt;
}

/** 组件联合类型 */
export type ComponentUniType = ComponentOptMap[ComponentType];
```

#### 画布

功能点：

- 从组件栏拖拽元素放置到画布上时，画布创建对应组件；
- 可以拖拽多个组件到画布中，组件层级按添加顺序设置，最后添加的在最上面一层；
- 鼠标移动组件上显示蓝色轮廓，突出当前移动到的元素，移出元素蓝色轮廓消失；
- 鼠标点击画布元素，可以激活组件，最多只能激活一个组件，激活组件时，该组件具有以下样式和功能：
  - 显示该组件的激活状态：蓝色轮廓 + 四角操作点；
  - 按住组件内容区域移动鼠标可以移动该元素；
  - 移动组件时在组件左上角显示标尺线，显示距离画布顶部和左边的距离；
  - 鼠标移动到组件四边显示垂直或水平箭头样式，按住移动鼠标可以改变组件宽高；
  - 鼠标移动到四角操作点显示斜的箭头，按住可以等比例改变组件宽高。

实现：

- 使用画布内容 store 中的 `elList` 来存储组件列表；
- 添加新组件时，使用列表的长度设置该组件的 id，同时也是该组件的层级；
- `hover` 时添加蓝色边框；
- 使用画布内容 store 中的 `activeEl` 来激活组件，使用 `activedEl` 来单独渲染激活的组件，使用 `updateActivedEl` 来更新激活组件的状态；
- 激活组件的处理：
  - 子元素有四条可操作边框线和四角操作点，每个子元素通过 `data-type` 属性来标示自己的操作类型，在画布元素上捕获这些子元素身上触发的事件，从而修改组件宽高；
  - 组件自身设置 `data-type` 为 `move`，被画布捕获到 `move` 类型时，表示在激活组件内容区按下鼠标，此时的操作为“移动组件”；
  - 在组件移动时，设置 `isMove` 标示，根据组件 `x` 和 `y` 坐标值来显示标尺线；

#### 配置栏

功能点：

- 没有激活的组件时显示占位图；
- 根据当前激活组件有值的字段渲染表单字段；
- 可以动态添加、删除字段，根据组件类型而定；
- 可以删除当前激活的组件。

实现：

- 画布内容 store 中 `activedEl` 为 `null` 时渲染占位图；
- 编写不同类型组件的必填配置列表和可选配置列表，在 `form` 中先设置必填字段的值，再遍历可选字段配置列表，将有值的字段添加到 `form` 中；
- 剩余的的可选字段存储到 `optionalItems` 列表中，添加按钮的 `Dropdown` 使用 `optionalItems` 渲染，选择其中的字段时，给当前激活的组件添加对应的属性；
- 点击删除按钮时，触发 store 中的 `deleteActivedEl` 方法。

#### 导出导入代码弹窗

功能点：

- 高亮显示格式化后的小程序画海报需要的 `json` 代码；
- 支持编辑代码；
- 支持复制代码；
- 支持导入代码.

实现：

- 从画布内容 store 中取出 `elList` 组件列表，遍历组件列表，剔除里面的 `internal` 属性（小程序不需要此属性），使用 `JSON.stringify` 序列化处理后的 `elList` 列表；
- 使用 `prettier` 中的 `format` 来格式化 `json` 字符串；
- 使用 `react-simple-code-editor` 和 `prism-react-renderer` 来支持可编辑和高亮显示 `json` 代码；
- 使用 `react-copy-to-clipboard` 复制代码；
- 编写验证方法验证导出的 JSON 代码。

## 快捷键

### 选中元素时

- **ArrowUp 上箭头** 向上移动元素
- **ArrowDown 下箭头** 向下移动元素
- **ArrowLeft 左箭头** 向左移动元素
- **ArrowRight 右箭头** 向右移动元素
- **Backspace 删除键** 删除选中的元素
- **Escape Esc** 取消选中元素

## 画布性能优化

### DOM 版

- 通过 `requestAnimationFrame` 对 `mousemove` 事件进行优化，`requestAnimationFrame` 会限制 `mousemove` 的触发次数（通常是一秒 60 次，每帧触发一次），使拖动过程更流畅。
- 通过 `transform: translate()` 来控制元素的移动，`translate` 属性可以利用 GPU 加速进行硬件加速渲染。与更改 `top` 和 `left` 属性相比，使用 `transform` 的 `translate` 属性不会触发浏览器的布局重绘和重排，因为布局引擎只需要在单独的层上对元素进行变换，而不需要重新计算文档中其他元素的位置和大小。

## BUGS

- 往左或往上移动超出画布时偏移量过大
- 文本组件的宽高问题 ✅

## TODOS

- cv 复制粘贴正在激活的组件，粘贴时组件 x、y 加 5 ⌛️
- 强耦合的属性，一起加
- 填充模式和背景颜色边框颜色联动
- 点击灰色背景区域取消选中
- 选中元素是不在最上面 ✅
- name 放到最上面 ✅
- 内置圆属性，导出时计算宽度的一半圆角，圆属性不能单独修改宽高，只能等比例修改
- 移动，不能超出画布边界
- 边框移动上去不闪动 ✅
- 删除操作二次确认
- 文本组件可以直接输入
- 激活圆形组件再激活矩形组件时矩形组件会变成圆形

## PREF

- 上下左右方向键移动组件 ✅
- 表单回车、步进时更新状态 ✅
