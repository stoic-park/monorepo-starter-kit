import { EChartsOption } from 'echarts';
import { colors } from '@design-system/tokens';

export interface RadarChartData {
  name: string;
  value: number[];
  color?: string;
}

/**
 * Radar Chart 템플릿
 *
 * @description 다차원 데이터 비교 (MIN, MAX, AVG, STD 등)
 * @param indicators 축 이름 배열
 * @param data 데이터 배열
 * @param max 최대값 (기본: 1)
 */
export const createRadarChartOption = (
  indicators: string[],
  data: RadarChartData[],
  max = 1
): EChartsOption => {
  const chartColors = [
    colors.chart[1],
    colors.chart[2],
    colors.chart[3],
    colors.chart[4],
    colors.chart[5],
    colors.chart[6],
    colors.chart[7],
    colors.chart[8],
    colors.chart[9],
    colors.chart[10],
  ];

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.background,
      borderColor: colors.border,
      textStyle: {
        color: colors.foreground,
      },
    },
    legend: {
      data: data.map((d) => d.name),
      bottom: 0,
      textStyle: {
        color: colors.muted.foreground,
      },
    },
    radar: {
      indicator: indicators.map((name) => ({
        name,
        max,
      })),
      shape: 'polygon',
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: colors.slate[300],
        },
      },
      splitArea: {
        areaStyle: {
          color: [colors.white, colors.slate[50]],
        },
      },
      axisLine: {
        lineStyle: {
          color: colors.slate[500],
        },
      },
      axisName: {
        color: colors.muted.foreground,
      },
    },
    series: [
      {
        name: 'Radar',
        type: 'radar',
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color || chartColors[index % chartColors.length],
          },
          areaStyle: {
            opacity: 0.3,
          },
        })),
        emphasis: {
          lineStyle: {
            width: 3,
          },
        },
      },
    ] as any[],
  };
};

/**
 * Billboard.js RadarGraph 마이그레이션용
 */
export const createRadarFromColumns = (columns: any[]): EChartsOption => {
  // columns[0]이 indicator (축 이름)
  const indicators = columns[0].slice(1);
  const data = columns.slice(1).map((col) => ({
    name: col[0],
    value: col.slice(1),
  }));

  return createRadarChartOption(indicators, data);
};
