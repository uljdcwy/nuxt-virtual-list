# Nuxt Virtual List Demo

一个基于 Nuxt 3 + Vue 3 的虚拟列表示例（支持固定高度实现，并说明动态高度的扩展设计），包含 10,000 条模拟数据与防抖搜索。

## 快速开始

1. 解压并进入项目目录：
```bash
cd nuxt-virtual-list
npm install
npm run dev
```
2. 打开浏览器访问：`http://localhost:3000`

## 项目结构（关键）
- `components/VirtualList.vue`：虚拟列表组件（固定高度实现）
- `pages/index.vue`：演示页面，包含搜索、防抖和示例控制
- `utils/generateData.ts`：生成 10k 测试数据
- `composables/useDebounce.ts`：防抖工具

## 动态高度实现（设计说明）
在组件中已保留设计注释。关键点：
1. 使用 `ResizeObserver` 或 `offsetHeight` 在项挂载时测量
2. 维护前缀和数组（或分段前缀）以在 `scrollTop` 下通过二分快速定位索引
3. 初始用 `avgHeight` 估算未知项，后续按真实测量调整并微调 `scrollTop` 保持滚动体验

## 许可
MIT
