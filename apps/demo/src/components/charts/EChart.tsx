import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface EChartProps {
  option: EChartsOption;
  height?: number | string;
  width?: number | string;
  loading?: boolean;
  onEvents?: Record<string, (params: any) => void>;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  style?: React.CSSProperties;
}

/**
 * ECharts 공통 Wrapper 컴포넌트
 *
 * @description 모든 ECharts를 통일된 인터페이스로 사용
 * @example
 * const option = createLineChartOption(data, xAxis, 'Title');
 * <EChart option={option} height={400} onEvents={{ click: handleClick }} />
 */
export const EChart: React.FC<EChartProps> = ({
  option,
  height = 400,
  width = '100%',
  loading = false,
  onEvents = {},
  notMerge = false,
  lazyUpdate = false,
  style = {},
}) => {
  return (
    <ReactECharts
      option={option}
      style={{ height, width, ...style }}
      showLoading={loading}
      onEvents={onEvents}
      notMerge={notMerge}
      lazyUpdate={lazyUpdate}
      opts={{
        renderer: 'canvas',
        locale: 'EN',
      }}
    />
  );
};

export default EChart;

