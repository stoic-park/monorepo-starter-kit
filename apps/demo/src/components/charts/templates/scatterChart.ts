import { EChartsOption } from 'echarts';
import { colors } from '@design-system/tokens';

export interface ScatterData {
  value: number;
  target: boolean;
  category: string;
  index: number;
}

export interface CategoryBounds {
  upper: number;
  lower: number;
}

/**
 * Scatter Chart 템플릿 (카테고리별 산점도)
 *
 * @description 카테고리별로 그룹화된 산점도 + 상한/하한 밴드
 * @param data 산점도 데이터
 * @param categories 카테고리 배열
 * @param categoryBounds 카테고리별 상한/하한
 * @param yRange Y축 범위
 * @param title 차트 제목
 * @param targetCategory 강조할 카테고리
 */
export const createScatterChartOption = (
  data: ScatterData[],
  categories: string[],
  categoryBounds: Record<string, CategoryBounds>,
  yRange: number[],
  title?: string,
  _targetCategory?: string
): EChartsOption => {
  const margin = (yRange[1] - yRange[0]) * 0.15;
  const yMin = yRange[0] - margin;
  const yMax = yRange[1] + margin;

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
    title: title
      ? {
          text: title.toUpperCase(),
          left: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 700,
            color: colors.foreground,
          },
        }
      : undefined,
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.background,
      borderColor: colors.border,
      textStyle: {
        color: colors.foreground,
      },
      formatter: (params: any) => {
        const item = data[params.dataIndex];
        return `
          <strong>Category:</strong> ${item.category}<br/>
          <strong>Value:</strong> ${item.value.toFixed(2)}<br/>
          <strong>Index:</strong> ${item.index}
        `;
      },
    },
    grid: {
      left: 60,
      right: 30,
      top: 40,
      bottom: 80,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45,
        interval: 0,
        color: colors.muted.foreground,
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [colors.slate[50], colors.slate[100]],
        },
      },
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLabel: {
        color: colors.muted.foreground,
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
      splitLine: {
        lineStyle: {
          color: colors.slate[200],
        },
      },
    },
    series: [
      // 상한/하한 밴드
      ...categories
        .map((category, index) => {
          const bounds = categoryBounds[category];
          if (!bounds) return null;

          return {
            name: `${category} Bounds`,
            type: 'line' as const,
            data: categories.map((c) => (c === category ? bounds.upper : null)),
            lineStyle: { opacity: 0 },
            stack: 'bounds',
            symbol: 'none',
            silent: true,
            markArea: {
              itemStyle: {
                color: colors.error.light,
                opacity: 0.2,
              },
              data: [
                [
                  { name: 'Upper', xAxis: index },
                  { name: 'Lower', xAxis: index },
                ] as any,
              ],
            },
          };
        })
        .filter((s): s is NonNullable<typeof s> => !!s),
      // 실제 산점도 데이터
      ...categories.map((category, catIndex) => {
        const categoryData = data.filter((d) => d.category === category);
        return {
          name: category,
          type: 'scatter' as const,
          data: categoryData.map((item) => [
            catIndex,
            item.value,
            item.target ? 1 : 0,
            item.index,
          ]),
          symbolSize: (data: any) => (data[2] ? 12 : 8),
          itemStyle: {
            color: chartColors[catIndex % chartColors.length],
            opacity: 0.7,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
            },
          },
        };
      }),
    ],
  };
};
