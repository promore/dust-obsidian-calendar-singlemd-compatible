# 设计：可配置的节假日 fix 数据

## 相关事实与约束

- `lunar-typescript` 提供 `HolidayUtil.fix(a: string | string[], b?: string): void`，支持两种调用形式：
  - `fix(year: string, data: string)`：为单个年份修正数据
  - `fix(array: string[])`：数组形式
- fix 数据格式：每 4 个字符一组，`[日期8位][类型1位][目标节假日8位]`，其中类型 `0` = 工作日（调休上班）、`1` = 节假日（放假）。
- 插件设置通过 Obsidian 的 `loadData`/`saveData`（即 `data.json`）持久化，`PluginSetting` 字段经 `Object.assign` 合并。
- 插件当前 `lunar-typescript` 版本为 `^1.7.2`，本次变更不升级版本。
- 配置界面基于 Obsidian 原生 `Setting` 组件 + React（`react-dom/client`）。

## 目标

- 用户可在配置界面按年份（2025~2099）输入/编辑/删除节假日 fix 数据
- 插件加载时应用 fix 数据修正节假日显示
- 数据持久化到 `data.json`
- 默认提供 2026 年 fix 数据

## 非目标

- 不修改 `lunar-typescript` 版本
- 不改变 `HolidayUtil.getHoliday` 调用方式与节假日显示渲染逻辑
- 不涉及农历显示
- 不从网络拉取数据

## 决策

### D1：配置字段类型为 `Record<string, string>`

**Choice**: `holidayFixData: Record<string, string>`，键为年份字符串，值为 fix 数据字符串。

**Rationale**: 用户要求按年份分组输入框，键值结构天然映射「年份 → 数据」。`Object.assign` 合并到 `data.json` 时，该对象字段可直接序列化。

**Alternatives**: 
- 单个字符串（用户最初示例）：无法按年份分组管理，且 `fix` 需要按年份拆分，复杂度更高。
- 数组 `{year, data}[]`：需要额外序列化处理，键值对象更简洁。

**Consequences**: 配置界面需为每个年份渲染输入框；新增年份需动态添加键。

### D2：默认提供 2026 年 fix 数据

**Choice**: `PluginSetting` 构造函数中为 `holidayFixData` 预置 `"2026"` 键及用户提供的 2026 年全年数据。

**Rationale**: 当前（2026 年）`lunar-typescript` 的 2026 年节假日数据不正确，预置默认数据可开箱即用，无需用户手动输入。

**Alternatives**: 
- 默认空对象：用户需手动输入，体验差。
- 预置 2025~2028 全部：数据量大且用户未提供 2025/2027/2028 的完整数据。

**Consequences**: 用户可自行删除或覆盖 2026 年数据；后续年份由用户按需添加。

### D3：应用 fix 数据的时机在 `onload`

**Choice**: 在 `DustCalendarPlugin.onload()` 中、`loadSetting()` 之后遍历 `holidayFixData` 调用 `HolidayUtil.fix`。

**Rationale**: 需先加载设置才能拿到 fix 数据；`onload` 是最早的应用点，保证日历视图渲染前节假日已修正。

**Alternatives**: 
- 在 `Database.loadSetting` 后立即应用：耦合数据层与业务逻辑。
- 在 `MonthView` 渲染时应用：可能重复调用或时机不稳定。

**Consequences**: `onload` 中新增一段应用逻辑；若用户修改配置需重启插件或重新加载设置才生效（可接受，与现有设置行为一致）。

### D4：新增独立工具模块 `HolidayFixUtil`

**Choice**: 新增 `src/core/HolidayFixUtil.ts`，封装「遍历 `holidayFixData` 并调用 `HolidayUtil.fix`」的逻辑，供 `onload` 调用。

**Rationale**: 保持 `main.ts` 简洁，应用逻辑可独立测试。

**Alternatives**: 
- 直接写在 `main.ts`：逻辑简单但难以单测，且 `main.ts` 已较臃肿。

**Consequences**: 新增一个文件；`main.ts` 引入并调用该工具。

## 风险

- **fix 数据格式错误**：用户输入非法格式时 `HolidayUtil.fix` 可能抛异常或产生错误数据。
  - 验证：空字符串跳过；异常时 try/catch 记录警告，不阻塞插件加载。
- **版本兼容**：`HolidayUtil.fix` 在 `^1.7.2` 中可用（已确认 `.d.ts` 存在 `fix(a, b)` 签名）。
  - 验证：构建通过 + 运行时调用正常。
- **2026 默认数据准确性**：预置数据需与国务院实际安排一致。
  - 验证：加载后抽查 `getHoliday(2026, 10, 1)`、`getHoliday(2026, 2, 17)` 等。
