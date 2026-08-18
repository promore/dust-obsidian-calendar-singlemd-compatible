# 变更提案：可配置的节假日 fix 数据

## Why

插件依赖 `lunar-typescript` 的 `HolidayUtil` 显示国家法定节假日与调休信息。`lunar-typescript` 的默认节假日数据来源于国务院办公厅发布的年度通知，一般要到年底才发布下一年度安排，因此存在更新及时性问题。例如当前（2026 年）使用 `lunar-typescript` 显示的 2026 年节假日日期是不正确的。

`lunar-typescript` 官方提供 `HolidayUtil.fix(year, data)` 接口，允许在默认数据基础上修正或追加节假日数据（参考官方手册：https://6tail.cn/calendar/api.html#holiday-util.fix.html）。

当前插件没有任何途径让用户修正节假日数据，导致 2026 年及以后的节假日标注错误且无法纠正。

## What Changes

在插件设置界面新增「节假日修正数据」配置区，用户可按年份（支持 2025 ~ 2099）输入该年份的 `HolidayUtil.fix` 数据字符串。插件加载时读取该配置，对每个已配置的年份调用 `HolidayUtil.fix(year, data)` 修正日历节假日显示。

具体改动：

1. **配置模型**（`src/entity/PluginSetting.ts`）：新增 `holidayFixData: Record<string, string>` 字段（键为年份字符串，值为该年份的 fix 数据），并在构造函数中初始化默认值（默认提供 2026 年数据）。
2. **配置界面**（`src/view/setting/MainSettingTab.tsx`）：新增「节假日修正数据」设置区，为每个已配置年份（或 2025~2099 范围内有数据的年份）提供输入框，支持新增/删除年份条目。
3. **加载应用**（`src/main.ts` 或独立工具模块）：插件 `onload` 时读取 `holidayFixData`，遍历每个年份调用 `HolidayUtil.fix(year, data)`。
4. **数据持久化**：通过 Obsidian 的 `loadData`/`saveData`（即 `data.json`）自动持久化，无需额外改动。

## Scope

### In

- 新增 `holidayFixData` 配置字段及持久化
- 配置界面：按年份分组的 fix 数据输入框（2025~2099）
- 插件加载时调用 `HolidayUtil.fix` 应用修正数据
- 默认提供 2026 年 fix 数据

### Out

- 不修改 `lunar-typescript` 版本（保持 `^1.7.2`）
- 不改变 `HolidayUtil.getHoliday` 的调用方式与节假日显示逻辑
- 不涉及农历显示逻辑
- 不自动从网络拉取节假日数据

## Impact

- `src/entity/PluginSetting.ts`：新增字段与默认值
- `src/view/setting/MainSettingTab.tsx`：新增配置区 UI
- `src/main.ts`：`onload` 中应用 fix 数据（可能新增工具函数）
- 可能新增工具模块用于解析/应用 fix 数据

## Proof of Completion

- `pnpm run build` 通过
- 插件加载后，`HolidayUtil.getHoliday(2026, 10, 1)` 等 2026 年节假日返回正确名称与调休状态
- 配置界面能显示/编辑/删除各年份的 fix 数据，改动写入 `data.json`
