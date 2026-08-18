# 执行合同

## Intent Lock

- **变更名称**：holiday-fix-config
- **要解决的问题**：`lunar-typescript` 的默认节假日数据存在更新及时性问题，2026 年及以后的节假日标注与调休信息不正确，且插件无任何途径让用户修正。
- **范围内**：新增 `holidayFixData` 配置字段；配置界面按年份（2025~2099）输入 fix 数据；插件加载时调用 `HolidayUtil.fix` 应用修正；数据持久化到 `data.json`；默认提供 2026 年 fix 数据。
- **范围外**：不修改 `lunar-typescript` 版本（保持 `^1.7.2`）；不改变 `HolidayUtil.getHoliday` 调用方式与节假日显示渲染逻辑；不涉及农历显示；不自动从网络拉取数据。

## Approved Behavior

- **已批准需求摘要**：
  - REQ-HF-1：`PluginSetting` 新增 `holidayFixData: Record<string, string>` 字段，构造函数预置 `"2026"` 键及 2026 年 fix 数据。
  - REQ-HF-2：设置界面新增「节假日修正数据」配置区，为每个已配置年份显示输入框，支持新增（2025~2099）与删除年份。
  - REQ-HF-3：插件 `onload` 时遍历 `holidayFixData`，对每个年份调用 `HolidayUtil.fix(year, data)`；空数据跳过、异常 try/catch 记录警告。
  - REQ-HF-4：`holidayFixData` 通过 `loadData`/`saveData` 持久化到 `data.json`。
- **关键场景**：插件加载后 `HolidayUtil.getHoliday(2026, 10, 1)` 返回「国庆节」节假日状态；配置界面能编辑/新增/删除年份并持久化。
- **验收检查**：`pnpm run build` 通过；2026 年节假日数据被正确修正；`data.json` 含 `holidayFixData`。

## Design Constraints

- **架构约束**：新增独立工具模块 `src/core/HolidayFixUtil.ts` 封装 fix 应用逻辑；`main.ts` 的 `onload` 在 `loadSetting()` 之后调用。
- **接口约束**：`HolidayUtil.fix(a: string | string[], b?: string): void`，按年份调用 `fix(year, data)`。
- **依赖约束**：`lunar-typescript` 保持 `^1.7.2`；配置界面沿用 Obsidian `Setting` + React 模式。
- **数据约束**：`holidayFixData` 为 `Record<string, string>`，键为年份字符串，值为 fix 数据字符串；经 `Object.assign` 合并到 `data.json`。

## Execution Plan

full 流程，先运行 `ssf execution recommend` 列出可用执行方式并推荐一种，保存 recommendation receipt。用户通过 `--confirm` 确认模式后，`ssf execution plan` 将执行计划保存到 `<change>/.superpowers/sdd/execution-plan.json`。Batch Inline 为串行模式。

## Execution Waves

### Wave 1

- **Wave ID**：wave-1
- **任务**：T1（新增配置字段与默认数据）
- **依赖 wave**：无
- **策略**：`serial`
- **目标**：`PluginSetting` 新增 `holidayFixData` 字段并预置 2026 年默认数据
- **输入**：`src/entity/PluginSetting.ts`、2026 年 fix 数据字符串
- **输出**：`PluginSetting` 含 `holidayFixData["2026"]`
- **完成标准**：`pnpm run build` 通过；`holidayFixData["2026"]` 存在且为 2026 年 fix 数据
- **Review gate**：review report 路径、base/head SHA、review receipt（`pass` | `fail`）

### Wave 2

- **Wave ID**：wave-2
- **任务**：T2（加载时应用 fix 数据）、T3（配置界面输入框）
- **依赖 wave**：wave-1
- **策略**：`parallel`
- **目标**：插件加载时应用 fix 数据；配置界面提供按年份输入框
- **输入**：`src/core/HolidayFixUtil.ts`（新增）、`src/main.ts`、`src/view/setting/MainSettingTab.tsx`
- **输出**：`onload` 应用 fix；配置界面可编辑/新增/删除年份
- **完成标准**：`pnpm run build` 通过；`getHoliday(2026, 10, 1)` 返回「国庆节」；设置界面可用
- **Review gate**：review report 路径、base/head SHA、review receipt（`pass` | `fail`）

## Test Obligations

- **必须先从失败测试开始的行为**：无（本变更以构建验证 + 运行时抽查为主，无既有测试框架；需验证 `getHoliday(2026, 10, 1)` 修正生效）
- **必需的边界情况**：空 `holidayFixData`、空字符串数据、非法 fix 数据（异常不阻塞加载）、年份超出 2025~2099
- **回归敏感区域**：`src/entity/PluginSetting.ts`（设置合并）、`src/main.ts`（onload 初始化顺序）

## Execution Mode

- **可用方式与推荐**：`ssf execution recommend <change-dir> [--wave <id>:<parallel|serial>:<task,...>[:<depends-on,...>]]`
- **用户确认的模式**：待 `ssf execution recommend` 后确认（`sdd` | `inline` | `batch-inline`）
- **推荐理由 / 项目事实**：3 个任务、2 个 wave（wave-1 串行、wave-2 并行），跨模块变更
- **非推荐选择的风险确认**：`--acknowledge-recommendation`（若适用）
- **执行计划命令**：`ssf execution plan <change-dir> --mode <mode> --confirm --reason <text> --wave <id>:<parallel|serial>:<task,...>[:<depends-on,...>] [--acknowledge-recommendation]`
- **允许的修订**：保留/升级为 `sdd`；先重新 recommend，以 `--confirm` 生成新 revision 并清除旧 receipt；不允许降级
- **计划 revision / artifact hash**：待 `ssf execution plan` 生成

## Verification Dimensions

| 维度 | 状态 | 发现 |
|------|------|------|
| Completeness | Pending | — |
| Correctness | Pending | — |
| Coherence | Pending | — |

**总体结论**：Pending

## Review Gates

- **强制审查点**：每个 Execution Wave 完成后记录 `ssf execution review` 的 review receipt
- **阻塞类别**：依赖未通过、review receipt 为 `fail`、缺失或过期
- **收口条件**：所有当前 wave 都有 `pass` review receipt

## Escalation Rules

- **何时回退到 `specifying`**：spec 需求变更、scope 扩大超出契约范围、需求与契约不匹配
- **何时回退到 `bridging`**：契约与 artifacts 不一致、约束变化
- **何时不得继续实现**：无当前 `ssf execution plan`、review receipt 缺失或 `fail`、契约过期
