# 拖拽生成小程序海报画布配置代码

## 架构

整个页面分为三个部分：

- 组件栏
- 画布
- 配置栏

## 组件栏

### 技术点

- 组件均可拖拽放置到画布中

### 实现

- 组件 `dragstart` 开始拖拽事件设置当前拖拽组件的类型到 `dataTransfer`，画布监听 `drop` 放置事件，根据不同的组件创建一个新的画布元素实例，画布元素结构：

```ts
interface ElType {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  type: 'image' | 'text' | 'rect';
  radius?: number;
  url?: string;
  content?: string;
  lineHeight?: number;
  /** 填充颜色 */
  fillStyle?: string;
  /** 字体样式 */
  font?: string;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  baseline?: string;
  rowCount?: number;
  textDecoration?: string;
  lineWidth?: number;
  strokeStyle?: string;
  mode?: string;
}
```

## 画布

### 技术点

- 鼠标移动到画布元素上显示蓝色轮廓，突出当前移动到的元素，移出元素蓝色轮廓消失
- 鼠标点击画布元素，显示该画布的选中状态：蓝色轮廓 + 四个角标
- 画布元素选中状态交互：点击按住元素内容区域可以移动该元素的位置，鼠标移动到四边显示垂直或水平箭头效果，按住可以改变宽高，移动到四角显示斜的箭头，按住可以等比例改变宽高
- 移动元素时在元素左上角显示标尺，显示距离画布顶部和左边的距离
