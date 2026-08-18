# 规格：可配置的节假日 fix 数据

## ADDED Requirements

### Requirement: 配置字段

插件设置模型 SHALL 包含一个 `holidayFixData` 字段，类型为 `Record<string, string>`，键为年份字符串（如 `"2026"`），值为该年份的 `HolidayUtil.fix` 数据字符串。

#### Scenario: 默认值存在

- **WHEN** 插件初始化 `PluginSetting` 构造函数
- **THEN** `holidayFixData` 为非空对象，且包含键 `"2026"`，其值为 2026 年全年节假日 fix 数据字符串

#### Scenario: 无年份数据

- **WHEN** 用户未配置某年份
- **THEN** 该年份不作为 `holidayFixData` 的键存在

### Requirement: 配置界面输入

插件设置界面 SHALL 提供一个「节假日修正数据」配置区，为每个已配置年份显示一个输入框，用户可编辑该年份的 fix 数据字符串。

#### Scenario: 显示已配置年份

- **WHEN** 用户打开插件设置界面
- **THEN** 对 `holidayFixData` 中的每个年份，显示一个带年份标签的输入框，输入框内容为该年份的 fix 数据

#### Scenario: 编辑保存

- **WHEN** 用户修改某年份输入框内容并关闭设置界面
- **THEN** 该年份的 fix 数据被更新并持久化到 `data.json`

#### Scenario: 新增年份

- **WHEN** 用户在配置区点击「新增年份」并输入一个 2025~2099 范围内的年份
- **THEN** 为该年份创建一个空的 fix 数据输入框

#### Scenario: 删除年份

- **WHEN** 用户删除某年份条目
- **THEN** 该年份从 `holidayFixData` 中移除，其 fix 数据不再生效

### Requirement: 加载时应用 fix 数据

插件加载时（`onload`）SHALL 读取 `holidayFixData`，对其中每个年份调用 `HolidayUtil.fix(year, data)` 应用修正数据。

#### Scenario: 应用已配置年份

- **WHEN** 插件 `onload` 执行且 `holidayFixData` 包含年份 `"2026"`
- **THEN** 调用 `HolidayUtil.fix("2026", <2026 数据>)`，且 2026 年节假日数据被修正

#### Scenario: 空数据不调用

- **WHEN** `holidayFixData` 为空或某年份数据为空字符串
- **THEN** 不调用 `HolidayUtil.fix` 或调用空数据不产生副作用

#### Scenario: 修正生效

- **WHEN** 插件加载完成且 2026 年 fix 数据已应用
- **THEN** `HolidayUtil.getHoliday(2026, 10, 1)` 返回名称为「国庆节」且为节假日状态

### Requirement: 数据持久化

`holidayFixData` 字段 SHALL 通过 Obsidian 的 `loadData`/`saveData` 机制持久化到 `data.json`，与现有设置字段一致。

#### Scenario: 保存

- **WHEN** 用户修改 fix 数据并触发 `saveSetting`
- **THEN** `data.json` 中包含更新后的 `holidayFixData`

#### Scenario: 加载

- **WHEN** 插件启动且 `data.json` 中存在 `holidayFixData`
- **THEN** 该值被合并到 `PluginSetting` 并用于 `HolidayUtil.fix`
