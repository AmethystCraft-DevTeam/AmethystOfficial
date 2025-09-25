## AmethystOpen 开发日志

## 今日目标
- 使用 InspiraUI 构建一个带有黑洞动效背景的官网主页。
- 搭建文档阅读区，通过 `#docs/<slug>` 形式进行锚点导航。
- 引入 SmoothCursor 光标效果，提升交互体验。

## 改动摘要
- 重写 `src/App.vue`，保留全屏黑洞背景，叠加 "AmethystOpen" 标题，增加文档侧栏与正文区域。
- 通过 `import.meta.glob` 读取 `src/docs` 目录下的 Markdown，结合 `config.json` 构建侧栏导航。
- 自行实现轻量级 Markdown 渲染器，支持标题、段落、列表、代码块与表格。
- 添加 `CardSpotlight` 导航组件，实现文档上下篇跳转，自动根据配置计算顺序。
- 引入 SmoothCursor 组件，隐藏系统光标并使用 spring 动画跟随鼠标。
- 编写 `src/types/docs-config.d.ts`，确保 TypeScript 能识别 JSON 配置模块。

## 技术要点
- 使用 `import.meta.glob` + `query: '?raw'` 读取 Markdown 原文，并通过 `withDefaults` 管理道具默认值。
- 通过 `useColorMode` 读取当前主题，为 CardSpotlight 提供不同的渐变色。
- `renderMarkdown` 函数中维护列表、代码、表格缓冲区，逐行转换为 HTML。
- 使用 `nextTick` + `scrollIntoView` 处理 `#docs/<slug>` 锚点跳转。
- 创建全局类 `smooth-cursor-hidden` 并添加 `cursor: none !important;`，干净地覆盖浏览器默认光标。

## 后续计划
- 根据需要补充更多 Markdown 文档与侧栏配置。
- 引入真正的 Markdown 解析器（如 `markdown-it`），以更完整地支持语法特性。
- 增加暗色主题下的更多视觉细节，例如光标主题变体或自定义字体。
