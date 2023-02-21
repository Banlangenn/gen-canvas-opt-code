# 拖拽生成小程序海报画布配置代码

## 架构

系统分为两个部分：

- 全局状态层
- 视图层

### 全局状态层

有两个 `store`：

- 画布尺寸：存储画布的宽高
- 画布内容：存储画布中的组件列表和当前激活的组件

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

画布内容 store 中有 `elList` 和 `activedEl` 两个状态：

- `elList`：画布中的组件列表，渲染时将正在激活的组件从列表中剔除；
- `activedEl`：当前激活的组件，画布中使用该状态单独渲染组件，后续在画布或配置栏操作该组件时，只需单独更新该组件的状态。

更新状态：

- `addEl`：添加一个新的组件，更新组件列表，添加组件后应该立即调用 `activeEl` 方法来激活该组件；
- `activeEl`：激活组件，将该组件状态添加到 `activedEl`，将上一个激活的组件（如果有）同步到组件列表中；
- `updateActivedEl`：更新当前激活的组件的状态，在画布或配置栏中操作激活的组件时，使用该方法来更新状态；
- `cancelActive`：取消激活，将当前激活的组件同步到组件列表，取消组件的激活状态；
- `deleteActivedEl`： 删除正在激活的组件，重置激活组件；
- `clearStore`：清空画布（重置 store）。

```ts
interface CanvasStoreType {
	/** 画布中的组件列表 */
	elList: ComponentUniType[];
	/** 当前激活的组件 */
	activedEl: ComponentUniType | null;
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
	/** 清空画布(重置store) */
	clearStore: () => void;
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
export type ComponentType = 'image' | 'text' | 'rect';

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
		id: number;
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
	/** 字体大小 + 字体样式 示例: '16px PingFang-SC-Medium' */
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
	mode?: string;
}
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

#### 导出代码弹窗

功能点：

- 高亮显示格式化后的小程序画海报需要的 `json` 代码；
- 支持编辑代码；
- 支持复制代码；。

实现：

- 从画布内容 store 中取出 `elList` 组件列表，遍历组件列表，剔除里面的 `internal` 属性（小程序不需要此属性），使用 `JSON.stringify` 序列化处理后的 `elList` 列表；
- 使用 `prettier` 中的 `format` 来格式化 `json` 字符串；
- 使用 `react-simple-code-editor` 和 `prism-react-renderer` 来支持可编辑和高亮显示 `json` 代码；
- 使用 `react-copy-to-clipboard` 复制代码。

## BUG

- 矩形填充模式
- 向上、向左移动超出画布时偏移过大

## TODO

- 本地上传图片
- 拖动列表排序
- 预设线、圆组件
- 导入代码
