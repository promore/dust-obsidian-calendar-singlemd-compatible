import {HolidayUtil} from "lunar-typescript";

/**
 * 节假日修正工具：根据配置的 fix 数据，修正 lunar-typescript 的节假日数据。
 */
export default class HolidayFixUtil {

    /**
     * 应用各年份的节假日修正数据。
     * 遍历 holidayFixData，对每个年份调用 HolidayUtil.fix(year, data)。
     * 空数据跳过；单个年份数据异常时记录警告，不阻塞其他年份。
     */
    public static applyFix(holidayFixData: Record<string, string>): void {
        if (!holidayFixData) {
            return;
        }
        for (const year of Object.keys(holidayFixData)) {
            const data = holidayFixData[year];
            if (!data) {
                continue;
            }
            try {
                HolidayUtil.fix(year, data);
            } catch (e) {
                console.warn(`[DustCalendar] 应用 ${year} 年节假日修正数据失败:`, e);
            }
        }
    }

}
