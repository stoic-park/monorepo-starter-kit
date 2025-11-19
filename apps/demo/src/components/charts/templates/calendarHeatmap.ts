import { EChartsOption } from 'echarts';
import { format } from 'date-fns';
import { colors } from '@design-system/tokens';

export interface CalendarValue {
  date: string;
  success: number;
  fail: number;
}

/**
 * Calendar Heatmap 템플릿
 *
 * @description react-calendar-heatmap 대체
 * @param calendarValues 날짜별 데이터
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 */
export const createCalendarHeatmapOption = (
  calendarValues: CalendarValue[],
  startDate: Date,
  endDate: Date
): EChartsOption => {
  const heatmapColors = {
    none: colors.slate[100],
    success: colors.success.DEFAULT,
    fail: colors.error.DEFAULT,
    mixed: colors.warning.DEFAULT,
  };

  return {
    tooltip: {
      formatter: (params: any) => {
        const value = params.value;
        const success = value[2] || 0;
        const fail = value[3] || 0;

        return `
        <strong>${value[0]}</strong><br/>
        ${success > 0 ? `Success: ${success}<br/>` : ''}
        ${fail > 0 ? `Fail: ${fail}` : ''}
      `;
      },
      backgroundColor: colors.background,
      borderColor: colors.border,
      textStyle: {
        color: colors.foreground,
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 10,
      calculable: true,
      seriesIndex: 0,
      inRange: {
        color: [heatmapColors.none, heatmapColors.success],
      },
    },
    calendar: {
      range: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
      cellSize: ['auto', 13],
      splitLine: {
        show: true,
        lineStyle: {
          color: colors.border,
          width: 2,
        },
      },
      yearLabel: {
        show: false,
      },
      monthLabel: {
        nameMap: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        fontSize: 12,
        color: colors.muted.foreground,
      },
      dayLabel: {
        firstDay: 1,
        nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        fontSize: 10,
        color: colors.muted.foreground,
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: colors.white,
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarValues.map((v) => {
          const total = v.success + v.fail;
          return [v.date, total, v.success, v.fail];
        }),
        itemStyle: {
          color: (params: any) => {
            const success = params.value[2];
            const fail = params.value[3];

            if (success === 0 && fail === 0) return heatmapColors.none;
            if (success > 0 && fail > 0) return heatmapColors.mixed;
            if (success > 0) return heatmapColors.success;
            if (fail > 0) return heatmapColors.fail;
            return heatmapColors.none;
          },
        },
        emphasis: {
          itemStyle: {
            borderColor: colors.slate[800],
            borderWidth: 2,
          },
        },
      },
    ],
  };
};

