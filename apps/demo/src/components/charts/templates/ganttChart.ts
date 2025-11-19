import { EChartsOption } from 'echarts';
import { colors } from '@design-system/tokens';

export interface GanttData {
  taskId: string;
  startTime: Date;
  endTime: Date;
  state: string;
  queuedDuration?: number;
  runDuration?: number;
}

/**
 * Gantt Chart 템플릿
 *
 * @description Airflow Task 실행 타임라인
 * @param tasks Task 데이터 배열
 * @param statusColors 상태별 색상 맵
 * @param showAnnotation 현재 시간 표시 여부
 */
export const createGanttChartOption = (
  tasks: GanttData[],
  statusColors: Record<string, string>,
  showAnnotation = true
): EChartsOption => {
  const minTime = Math.min(...tasks.map((t) => t.startTime.getTime() / 1000));
  const maxTime = Math.max(...tasks.map((t) => t.endTime.getTime() / 1000));

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: colors.background,
      borderColor: colors.border,
      textStyle: {
        color: colors.foreground,
      },
      formatter: (params: any) => {
        const task = tasks[params.dataIndex];
        return `
          <strong>${task.taskId}</strong><br/>
          Queued: ${task.queuedDuration || 0}s<br/>
          Running: ${task.runDuration || 0}s<br/>
          Start: ${task.startTime.toLocaleString()}<br/>
          End: ${task.endTime.toLocaleString()}
        `;
      },
    },
    grid: {
      left: 100,
      right: 50,
      top: 50,
      bottom: 30,
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      min: minTime,
      max: maxTime,
      position: 'top',
      axisLabel: {
        formatter: (value: number) => {
          return (
            new Date(value * 1000).toLocaleTimeString('en-GB', {
              hour12: false,
              timeZone: 'UTC',
            }) + ' UTC'
          );
        },
        rotate: 30,
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
    yAxis: {
      type: 'category',
      data: tasks.map((t) => t.taskId),
      axisLabel: {
        color: colors.muted.foreground,
      },
      axisLine: {
        lineStyle: {
          color: colors.border,
        },
      },
    },
    series: [
      // Queued duration
      ...(tasks[0].queuedDuration !== undefined
        ? [
            {
              name: 'Queued',
              type: 'bar' as const,
              stack: 'total',
              data: tasks.map((t) => ({
                value: [t.queuedDuration || 0, t.taskId],
                itemStyle: {
                  color: colors.amber[500],
                },
              })),
            },
          ]
        : []),
      // Run duration
      {
        name: 'Running',
        type: 'bar' as const,
        stack: 'total',
        data: tasks.map((t) => ({
          value: [t.runDuration || 0, t.taskId],
          itemStyle: {
            color: statusColors[t.state] || colors.gray[500],
          },
        })),
      },
      // Current time annotation
      ...(showAnnotation
        ? [
            {
              name: 'Current Time',
              type: 'line' as const,
              markLine: {
                silent: true,
                data: [
                  {
                    xAxis: Date.now() / 1000,
                    lineStyle: {
                      color: colors.error.DEFAULT,
                      width: 2,
                      type: 'dashed' as const,
                    },
                    label: {
                      formatter: 'Now',
                      position: 'end',
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ] as any[],
  };
};
