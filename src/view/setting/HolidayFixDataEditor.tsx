import React, {ChangeEvent, useState} from "react";
import DustCalendarPlugin from "../../main";


export default function HolidayFixDataEditor({plugin}: { plugin: DustCalendarPlugin }) {

    const [holidayFixData, setHolidayFixData] = useState<Record<string, string>>(plugin.calendarViewController.getHolidayFixData());
    const [newYear, setNewYear] = useState<string>("");

    const updateYear = (year: string, value: string) => {
        const next = {...holidayFixData, [year]: value};
        setHolidayFixData(next);
        plugin.calendarViewController.setHolidayFixData(next);
    };

    const removeYear = (year: string) => {
        const next = {...holidayFixData};
        delete next[year];
        setHolidayFixData(next);
        plugin.calendarViewController.setHolidayFixData(next);
    };

    const addYear = () => {
        const year = newYear.trim();
        if (year.length === 0 || !/^20\d{2}$/.test(year)) {
            return;
        }
        const num = parseInt(year);
        if (num < 2025 || num > 2099) {
            return;
        }
        if (holidayFixData[year] !== undefined) {
            return;
        }
        const next = {...holidayFixData, [year]: ""};
        setHolidayFixData(next);
        plugin.calendarViewController.setHolidayFixData(next);
        setNewYear("");
    };

    const onNewYearChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        if (text.length !== 0 && !/^\d{0,4}$/.test(text)) {
            return;
        }
        setNewYear(text);
    };

    const years = Object.keys(holidayFixData).sort();

    return <>
        <div className="setting-item-info">
            <div className="setting-item-name">
                节假日修正数据
            </div>
            <div className="setting-item-description">
                <div>按年份输入 lunar-typescript 的节假日修正数据（HolidayUtil.fix），用于修正官方默认节假日与调休信息。</div>
            </div>
        </div>
        <div className="setting-item-control">
            <div>
                {years.map(year => (
                    <div key={year} style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px"}}>
                        <span style={{width: "48px", fontWeight: "bold"}}>{year}</span>
                        <input
                            type="text"
                            value={holidayFixData[year] || ""}
                            onChange={(e) => updateYear(year, e.target.value)}
                            style={{flex: 1, minWidth: "200px"}}
                        />
                        <button
                            type="button"
                            onClick={() => removeYear(year)}
                            aria-label={`删除 ${year} 年数据`}
                        >删除</button>
                    </div>
                ))}
                <div style={{display: "flex", alignItems: "center", gap: "8px", marginTop: "6px"}}>
                    <input
                        type="text"
                        value={newYear}
                        onChange={onNewYearChange}
                        placeholder="年份（2025~2099）"
                        style={{width: "120px"}}
                    />
                    <button
                        type="button"
                        onClick={addYear}
                        disabled={!newYear.trim()}
                    >新增年份</button>
                </div>
            </div>
        </div>
    </>
}
