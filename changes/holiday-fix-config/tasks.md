# 任务：可配置的节假日 fix 数据

## 交付/验证映射

| 需求 | 任务 | 验证命令 |
|------|------|----------|
| REQ-HF-1 | T1 | `pnpm run build` |
| REQ-HF-4 | T1 | 检查 `data.json` 含 `holidayFixData` |
| REQ-HF-3 | T2 | `pnpm run build` + 运行时抽查 `getHoliday` |
| REQ-HF-2 | T3 | `pnpm run build` + 手动打开设置界面 |

## 任务

### T1：新增配置字段与默认数据

- [x] 完成

**受影响路径**: `src/entity/PluginSetting.ts`

**内容**: 在 `PluginSetting` 中新增 `holidayFixData: Record<string, string>` 字段，并在构造函数中预置 `"2026"` 键及 2026 年全年 fix 数据（用户提供的字符串）。

**可观察结果**: `PluginSetting` 实例化后 `holidayFixData["2026"]` 存在且为 2026 年 fix 数据；`data.json` 可持久化该字段。

**验证命令**: `pnpm run build`

### T2：加载时应用 fix 数据

- [x] 完成

**受影响路径**: `src/core/HolidayFixUtil.ts`（新增）、`src/main.ts`

**内容**: 新增 `HolidayFixUtil.ts` 封装「遍历 `holidayFixData`，对每个年份调用 `HolidayUtil.fix(year, data)`」，空数据跳过、异常 try/catch 记录警告。在 `main.ts` 的 `onload` 中、`loadSetting()` 之后调用。

**可观察结果**: 插件加载后 2026 年节假日数据被修正；`HolidayUtil.getHoliday(2026, 10, 1)` 返回「国庆节」节假日状态。

**验证命令**: `pnpm run build` + 运行时抽查

### T3：配置界面输入框

- [x] 完成

**受影响路径**: `src/view/setting/MainSettingTab.tsx`

**内容**: 新增「节假日修正数据」配置区，为 `holidayFixData` 中每个年份渲染输入框（年份标签 + 文本输入框），支持新增年份（2025~2099）与删除年份条目，改动经 `saveSetting` 持久化。

**可观察结果**: 设置界面显示各年份 fix 数据输入框；编辑/新增/删除后 `data.json` 更新。

**验证命令**: `pnpm run build` + 手动打开设置界面验证

## 依赖

- T1 → T2（T2 依赖 `holidayFixData` 字段）
- T1 → T3（T3 依赖 `holidayFixData` 字段）
- T2 与 T3 相互独立，可并行
