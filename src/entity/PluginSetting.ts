import {FontSizeChangeMode, QuarterNameMode, TemplatePlugin, TodoAnnotationMode} from "../base/enum";

export default class PluginSetting {

    shouldDisplayLunarInfo: boolean;                        // 是否显示农历信息
    shouldDisplayHolidayInfo: boolean;                      // 是否显示调休信息
    holidayFixData: Record<string, string>;                 // 各年份的节假日修正数据（键为年份，值为 HolidayUtil.fix 数据）

    fontSizeChangeMode: FontSizeChangeMode;                 // 字体大小调整方式
    immutableFontSizeFactor: number;                        // 固定字体的大小

    quarterNameMode: QuarterNameMode;                       // 季度命名方式

    wordsPerDot: number;                                    // 多少字一个点
    dotUpperLimit: number;                                  // 最多几个点
    todoAnnotationMode: TodoAnnotationMode;                 // 待办呈现方式：不展示、颜色标注、圆孔标注

    shouldConfirmBeforeCreatingNote: boolean;               // 创建新笔记之前是否需要确认
    templatePlugin: TemplatePlugin;                         // 模板插件

    dailyNoteOption: boolean;                               // 每日笔记开关
    dailyNotePattern: string;                               // 每日笔记文件命名规则
    dailyTemplateFilename: string;                          // 每日笔记模板文件名称

    weeklyNoteOption: boolean;                              // 每周笔记开关
    weeklyNotePattern: string;                              // 每周笔记文件命名规则
    weeklyTemplateFilename: string;                         // 每周笔记模板文件名称

    monthlyNoteOption: boolean;                             // 每月笔记开关
    monthlyNotePattern: string;                             // 每月笔记文件命名规则
    monthlyTemplateFilename: string;                        // 每月笔记模板文件名称

    quarterlyNoteOption: boolean;                           // 季度笔记开关
    quarterlyNotePattern: string;                           // 季度笔记文件命名规则
    quarterlyTemplateFilename: string;                      // 季度笔记模板文件名称

    yearlyNoteOption: boolean;                              // 年度笔记开关
    yearlyNotePattern: string;                              // 年度笔记文件命名规则
    yearlyTemplateFilename: string;                         // 年度笔记模板文件名称

    constructor() {

        this.shouldDisplayLunarInfo = true;
        this.shouldDisplayHolidayInfo = true;
        this.holidayFixData = {
            "2026": "202601010120260101202601020120260101202601030120260101202601040020260101202602141020260217202602151120260217202602161120260217202602171120260217202602181120260217202602191120260217202602201120260217202602211120260217202602221120260217202602231120260217202602281020260217202604042120260405202604052120260405202604062120260405202605013120260501202605023120260501202605033120260501202605043120260501202605053120260501202605093020260501202606194120260619202606204120260619202606214120260619202609206020261001202609255120260925202609265120260925202609275120260925202610016120261001202610026120261001202610036120261001202610046120261001202610056120261001202610066120261001202610076120261001202610106020261001"
        };

        this.fontSizeChangeMode = FontSizeChangeMode.IMMUTABLE;
        this.immutableFontSizeFactor = 1;

        this.quarterNameMode = QuarterNameMode.NUMBER;

        this.wordsPerDot = 200;
        this.dotUpperLimit = 3;
        this.todoAnnotationMode = TodoAnnotationMode.HOLE;

        this.shouldConfirmBeforeCreatingNote = true;
        this.templatePlugin = TemplatePlugin.NONE;

        this.dailyNoteOption = false;
        this.dailyNotePattern = "";
        this.dailyTemplateFilename = "";

        this.weeklyNoteOption = false;
        this.weeklyNotePattern = "";
        this.weeklyTemplateFilename = "";

        this.monthlyNoteOption = false;
        this.monthlyNotePattern = "";
        this.monthlyTemplateFilename = "";

        this.quarterlyNoteOption = false;
        this.quarterlyNotePattern = "";
        this.quarterlyTemplateFilename = "";

        this.yearlyNoteOption = false;
        this.yearlyNotePattern = "";
        this.yearlyTemplateFilename = "";
    }

}
