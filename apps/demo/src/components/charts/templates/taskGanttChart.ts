import { EChartsOption } from 'echarts';
import { colors } from '@design-system/tokens';

export interface TaskData {
  maintenanceSno: number;
  fileSno: number;
  startTime: Date;
  endTime: Date;
  isDefect: boolean;
  recipe: string;
  type: string;
  lot?: string;
  taskNo?: string;
  isAbort: boolean;
  value?: number;
  layer: number;
  percent: number;
}

export interface MaintenanceData {
  startTime: Date;
  endTime: Date;
  maintenanceSno: number;
  result: string;
}

export interface ColorMapping {
  AGING: string;
  RUN: string;
  'N/I': string;
  defect: string;
  abort: string;
  normal_maintenance: string;
  inspection_maintenance: string;
}

/**
 * Task Gantt Chart 템플릿 (Multi-layer)
 *
 * @description Multi-layer Gantt Chart for task timeline visualization
 * @param taskData 작업 데이터
 * @param maintenanceData 정비 데이터
 * @param timeRange 시간 범위
 * @param colorMapping 타입별 색상
 * @param hiddenTypes 숨길 타입
 * @param showAnnotation 현재 시간 표시 여부
 */
export const createTaskGanttChartOption = (
  taskData: TaskData[],
  maintenanceData: MaintenanceData[],
  timeRange: [Date, Date],
  colorMapping: ColorMapping,
  hiddenTypes: Set<string> = new Set(),
  showAnnotation = true
): EChartsOption => {
  const layers = ['Maintenance', 'Task', 'Abort', 'Value On-time'];

  // 숨기지 않은 task 데이터만 필터링
  const visibleTaskData = taskData.filter((t) => !hiddenTypes.has(t.type));

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.background,
      borderColor: colors.border,
      textStyle: {
        color: colors.foreground,
      },
      formatter: (params: any) => {
        const data = params.data;

        if (data.dataType === 'maintenance') {
          return `
            <strong>Maintenance ${data.result === 'C' ? '정상' : '불량'}</strong><br/>
            Maintenance No: ${data.maintenanceSno}<br/>
            Start: ${new Date(data.value[1]).toLocaleString()}<br/>
            End: ${new Date(data.value[2]).toLocaleString()}
          `;
        }

        if (data.dataType === 'task') {
          return `
            <strong>Task ${data.taskNo || data.fileSno}</strong><br/>
            Lot: ${data.lot || 'N/A'}<br/>
            Recipe: ${data.recipe}<br/>
            Type: ${data.type}<br/>
            ${data.isDefect ? '<span style="color: red;">⚠️ Defect</span><br/>' : ''}
            ${data.isAbort ? '<span style="color: orange;">⚠️ Abort</span><br/>' : ''}
            Start: ${new Date(data.value[1]).toLocaleString()}<br/>
            End: ${new Date(data.value[2]).toLocaleString()}
          `;
        }

        return '';
      },
    },
    grid: {
      left: 100,
      right: 50,
      top: 20,
      bottom: 30,
    },
    xAxis: {
      type: 'time',
      min: timeRange[0].getTime(),
      max: timeRange[1].getTime(),
      axisLabel: {
        formatter: (value: number) => {
          return new Date(value).toLocaleTimeString('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
        color: colors.muted.foreground,
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: colors.slate[300],
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: layers,
      axisLabel: {
        fontSize: 12,
        color: colors.muted.foreground,
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
      splitLine: {
        show: false,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none',
        bottom: 5,
      },
    ],
    series: [
      // Layer 0: Maintenance
      {
        type: 'custom',
        name: 'Maintenance',
        renderItem: (_params: any, api: any) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;
          const result = api.value(3);

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: Math.max(end[0] - start[0], 2),
              height: height,
            },
            style: {
              fill:
                result === 'C'
                  ? colorMapping.normal_maintenance
                  : colorMapping.inspection_maintenance,
            },
          };
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: maintenanceData.map((m) => ({
          value: [
            0, // Maintenance layer
            m.startTime.getTime(),
            m.endTime.getTime(),
            m.result,
          ],
          dataType: 'maintenance',
          maintenanceSno: m.maintenanceSno,
          result: m.result,
        })),
        z: 1,
      },
      // Layer 1: Task
      {
        type: 'custom',
        name: 'Task',
        renderItem: (_params: any, api: any) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;
          const taskType = api.value(3);
          const isDefect = api.value(4);

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: Math.max(end[0] - start[0], 2),
              height: height,
            },
            style: {
              fill:
                colorMapping[taskType as keyof ColorMapping] ||
                colors.gray[500],
              stroke: isDefect ? colorMapping.defect : 'none',
              lineWidth: isDefect ? 2 : 0,
            },
          };
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: visibleTaskData
          .filter((t) => !t.isAbort)
          .map((t) => ({
            value: [
              1, // Task layer
              t.startTime.getTime(),
              t.endTime.getTime(),
              t.type,
              t.isDefect,
            ],
            dataType: 'task',
            ...t,
          })),
        z: 2,
      },
      // Layer 2: Abort
      {
        type: 'custom',
        name: 'Abort',
        renderItem: (_params: any, api: any) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;

          return {
            type: 'rect',
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: Math.max(end[0] - start[0], 2),
              height: height,
            },
            style: {
              fill: colorMapping.abort,
            },
          };
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: visibleTaskData
          .filter((t) => t.isAbort)
          .map((t) => ({
            value: [
              2, // Abort layer
              t.startTime.getTime(),
              t.endTime.getTime(),
            ],
            dataType: 'task',
            ...t,
          })),
        z: 2,
      },
      // Layer 3: Value On-time (Line Chart)
      {
        type: 'line',
        name: 'Value On-time',
        data: visibleTaskData
          .filter(
            (t) =>
              t.value !== undefined &&
              (t.recipe === 'RUN' || t.recipe === 'AGING')
          )
          .map((t) => [t.startTime.getTime(), t.value]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: colors.info.DEFAULT,
        },
        yAxisIndex: 1, // 별도 Y축 사용
        z: 3,
      },
    ],
    // 두 번째 Y축 (Value On-time용)
    ...(visibleTaskData.some((t) => t.value !== undefined)
      ? {
          yAxis: [
            {
              type: 'category' as const,
              data: layers,
            },
            {
              type: 'value' as const,
              name: 'Value On-time',
              position: 'right',
              axisLabel: {
                formatter: '{value}',
                color: colors.muted.foreground,
              },
              axisLine: {
                lineStyle: {
                  color: colors.border,
                },
              },
            },
          ],
        }
      : {}),
    // 현재 시간 표시
    ...(showAnnotation
      ? {
          series: [
            {
              type: 'line',
              markLine: {
                symbol: 'none',
                data: [
                  {
                    xAxis: Date.now(),
                    lineStyle: {
                      color: colors.error.DEFAULT,
                      type: 'solid',
                      width: 2,
                    },
                  },
                ],
              },
            },
          ],
        }
      : {}),
  };
};

