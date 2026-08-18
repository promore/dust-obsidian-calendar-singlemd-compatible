# Dust Calendar (fork)

本仓库是 [Dust Calendar](https://github.com/a-nano-dust/dust-obsidian-calendar) 的一个 fork 版本，基于原项目做了针对性的功能扩展。

原项目地址：<https://github.com/a-nano-dust/dust-obsidian-calendar>

## 本 fork 修改的内容

### 1. 天格子待办标注支持月度笔记文件

原项目中，待办标注（颜色 / 圆孔）只能从「每日笔记」文件（如 `yyyy-MM-dd.md`）读取，天格子无法标注待办。

本 fork 扩展为：当每日笔记文件不存在时，自动回退到「每月笔记」文件（如 `yyyy-MM.md`），并读取其中对应日期小节（`## yyyy-MM-dd`）下的待办事项来标注天格子。

- 若每日笔记文件存在，仍按每日笔记文件统计（保持原行为）；
- 若每日笔记文件不存在，则从月度笔记文件中对应日期的 `## yyyy-MM-dd` 小节统计待办并标注到天格子。

这适用于将每天事件统一存放在月度文件（`# yyyy-MM` 一级标题 + `## yyyy-MM-dd` 二级标题）中的使用方式。

### 2. 修复构建类型错误

修复了 `src/core/NoteController.ts` 中误用全局变量 `app`、以及 `src/main.ts` 中 `leaf` 可能为 `null` 的类型错误，使 `pnpm run build` 能够通过完整的 TypeScript 类型检查。

## 使用说明

请参考原项目文档：<https://github.com/a-nano-dust/dust-obsidian-calendar>
