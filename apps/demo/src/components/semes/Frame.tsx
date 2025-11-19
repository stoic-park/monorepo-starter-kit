import React from 'react';
import {
  Typography,
  Card,
  Alert,
  Button,
  Stack,
} from '@design-system/components';
import {
  EChart,
  createLineChartOption,
  createBarChartOption,
  createScatterChartOption,
  createRadarChartOption,
  createCalendarHeatmapOption,
  createTaskGanttChartOption,
} from '../charts';
import { ITabMenu } from '../../types/menu';
import {
  generateMockTaskData,
  generateMockTrainingData,
  generateMockDataCollectionBar,
  generateMockDataCollectionLine,
  generateMockScatterData,
  generateMockCalendarData,
  generateMockRadarData,
} from '../../data/mockChartData';

interface FrameProps {
  activeTab: ITabMenu | null;
}

const Frame: React.FC<FrameProps> = ({ activeTab }) => {
  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <Card variant="elevated" padding="lg" className="max-w-md">
          <Stack spacing="xl" className="text-center">
            <Typography variant="h3" className="text-slate-900">
              Welcome to Demo Workspace
            </Typography>
            <Typography variant="body1" className="text-slate-600">
              Select a menu from the sidebar to get started
            </Typography>
            <Alert variant="info">
              This is a demo application showcasing the Design System
            </Alert>
          </Stack>
        </Card>
      </div>
    );
  }

  // 메뉴별 차트 렌더링
  const renderChartContent = () => {
    const programId = activeTab.programId;

    switch (programId) {
      case 'REALTIME_MON':
        return <RealtimeMonitoringContent />;

      case 'DATA_ANALYSIS':
        return <DataAnalysisContent />;

      case 'TRAINING_PROC':
        return <TrainingProcessContent />;

      case 'DATA_VIEW':
        return <DataCollectionViewContent />;

      case 'PM_MGMT':
        return <PmManagementContent />;

      case 'PROCESS_MGMT':
        return <ProcessManagementContent />;

      default:
        return <DefaultContent menuName={activeTab.menuName} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <Typography variant="h3" className="text-slate-900 font-bold">
          {activeTab.menuName}
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          {activeTab.programId || 'Program ID not assigned'}
        </Typography>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6 overflow-auto">{renderChartContent()}</div>
    </div>
  );
};

// 1. Real-time Monitoring
const RealtimeMonitoringContent: React.FC = () => {
  const { taskData, maintenanceData } = generateMockTaskData();
  const now = new Date();
  const startTime = new Date(now.getTime() - 24 * 3600000); // 24시간 전

  const colorMapping = {
    AGING: '#F59E0B',
    RUN: '#3B82F6',
    'N/I': '#6B7280',
    defect: '#EF4444',
    abort: '#F97316',
    normal_maintenance: '#10B981',
    inspection_maintenance: '#EF4444',
  };

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Real-time Monitoring">
        실시간 작업 모니터링 화면입니다. 작업 타임라인과 그룹 정보를 확인할 수
        있습니다.
      </Alert>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Task Timeline
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              최근 24시간 동안의 작업 타임라인
            </Typography>
          </div>
          <EChart
            option={createTaskGanttChartOption(
              taskData,
              maintenanceData,
              [startTime, now],
              colorMapping
            )}
            height={400}
          />
        </Stack>
      </Card>

      <Card variant="default" padding="md">
        <Typography variant="body2" className="text-slate-600">
          💡 차트를 클릭하거나 줌/팬 기능을 사용해보세요. 실제 환경에서는 그룹
          네트워크 그래프도 함께 표시됩니다.
        </Typography>
      </Card>
    </Stack>
  );
};

// 2. Data Analysis
const DataAnalysisContent: React.FC = () => {
  const { taskData, maintenanceData } = generateMockTaskData();
  const { data, categories, categoryBounds } = generateMockScatterData();
  const now = new Date();
  const startTime = new Date(now.getTime() - 24 * 3600000);

  const colorMapping = {
    AGING: '#F59E0B',
    RUN: '#3B82F6',
    'N/I': '#6B7280',
    defect: '#EF4444',
    abort: '#F97316',
    normal_maintenance: '#10B981',
    inspection_maintenance: '#EF4444',
  };

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Data Analysis">
        데이터 분석 화면입니다. 작업 항목 선택 후 값별 이상치를 분석할 수
        있습니다.
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated" padding="lg">
          <Stack spacing="xl">
            <div>
              <Typography variant="h4" className="mb-2">
                Activity Timeline
              </Typography>
              <Typography variant="body2" className="text-slate-600">
                분석할 작업 항목을 선택하세요
              </Typography>
            </div>
            <EChart
              option={createTaskGanttChartOption(
                taskData,
                maintenanceData,
                [startTime, now],
                colorMapping
              )}
              height={350}
            />
          </Stack>
        </Card>

        <Card variant="elevated" padding="lg">
          <Stack spacing="xl">
            <div>
              <Typography variant="h4" className="mb-2">
                Value Analysis
              </Typography>
              <Typography variant="body2" className="text-slate-600">
                값별 분포 및 이상치 분석
              </Typography>
            </div>
            <EChart
              option={createScatterChartOption(
                data,
                categories,
                categoryBounds,
                [0, 10],
                'Value Distribution'
              )}
              height={350}
            />
          </Stack>
        </Card>
      </div>

      <Card variant="default" padding="md">
        <Typography variant="body2" className="text-slate-600">
          💡 작업 항목을 선택하면 해당 항목의 데이터가 우측 차트에
          표시됩니다. 상한/하한을 벗어난 값은 이상치로 표시됩니다.
        </Typography>
      </Card>
    </Stack>
  );
};

// 3. Training Process
const TrainingProcessContent: React.FC = () => {
  const { series, xAxis } = generateMockTrainingData();

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Learning Process">
        학습 프로세스 모니터링 화면입니다. 학습 진행 상황과 정확도를
        실시간으로 확인할 수 있습니다.
      </Alert>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Learning Progress
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              학습 정확도 및 손실 추이
            </Typography>
          </div>
          <EChart
            option={createLineChartOption(
              series,
              xAxis,
              'Model Training Progress',
              undefined,
              'Accuracy (%)'
            )}
            height={400}
          />
        </Stack>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-slate-600">
              Current Epoch
            </Typography>
            <Typography variant="h3" className="text-slate-900">
              10 / 100
            </Typography>
          </Stack>
        </Card>
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-slate-600">
              Best Accuracy
            </Typography>
            <Typography variant="h3" className="text-slate-900">
              91.2%
            </Typography>
          </Stack>
        </Card>
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-slate-600">
              Training Time
            </Typography>
            <Typography variant="h3" className="text-slate-900">
              2h 15m
            </Typography>
          </Stack>
        </Card>
      </div>
    </Stack>
  );
};

// 4. Data Collection View
const DataCollectionViewContent: React.FC = () => {
  const barData = generateMockDataCollectionBar();
  const lineData = generateMockDataCollectionLine();

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Data Collection View">
        데이터 수집 현황을 확인할 수 있습니다. 수집량, 실패율, 값
        추이를 모니터링합니다.
      </Alert>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Daily Collection Status
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              일별 데이터 수집량 및 실패 건수
            </Typography>
          </div>
          <EChart
            option={createBarChartOption(
              barData.series,
              barData.xAxis,
              'Data Collection Status',
              false,
              true
            )}
            height={350}
          />
        </Stack>
      </Card>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Value Trend
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              시간대별 값 추이 및 정상 범위
            </Typography>
          </div>
          <EChart
            option={createLineChartOption(
              lineData.series,
              lineData.xAxis,
              'Sensor Value Trend (24h)',
              lineData.range,
              'Sensor Value'
            )}
            height={350}
          />
        </Stack>
      </Card>
    </Stack>
  );
};

// 5. PM Management
const PmManagementContent: React.FC = () => {
  const calendarData = generateMockCalendarData();
  const startDate = new Date(calendarData[0].date);
  const endDate = new Date(calendarData[calendarData.length - 1].date);

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Maintenance Management">
        정비 관리 화면입니다. 정비 일정 및 수행 이력을 확인할 수
        있습니다.
      </Alert>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Maintenance Schedule & History
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              최근 90일간의 정비 수행 이력 (성공/실패)
            </Typography>
          </div>
          <EChart
            option={createCalendarHeatmapOption(
              calendarData,
              startDate,
              endDate
            )}
            height={200}
            onEvents={{
              click: (params: any) => {
                console.log('Selected date:', params.value[0]);
              },
            }}
          />
        </Stack>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-slate-600">
              Total Maintenance
            </Typography>
            <Typography variant="h3" className="text-slate-900">
              245
            </Typography>
          </Stack>
        </Card>
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-green-600">
              Success
            </Typography>
            <Typography variant="h3" className="text-green-600">
              232
            </Typography>
          </Stack>
        </Card>
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-red-600">
              Failed
            </Typography>
            <Typography variant="h3" className="text-red-600">
              13
            </Typography>
          </Stack>
        </Card>
        <Card variant="default" padding="md">
          <Stack spacing="sm">
            <Typography variant="caption" className="text-slate-600">
              Success Rate
            </Typography>
            <Typography variant="h3" className="text-slate-900">
              94.7%
            </Typography>
          </Stack>
        </Card>
      </div>
    </Stack>
  );
};

// 6. Process Management
const ProcessManagementContent: React.FC = () => {
  const radarData = generateMockRadarData();

  return (
    <Stack spacing="2xl">
      <Alert variant="info" title="Workflow Management">
        워크플로우 관리 화면입니다. 워크플로우 파라미터 모니터링 및 관리를 수행합니다.
      </Alert>

      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <div>
            <Typography variant="h4" className="mb-2">
              Workflow Parameters
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              주요 워크플로우 파라미터 현황 (현재값 vs 목표값 vs 상한선)
            </Typography>
          </div>
          <div className="flex justify-center">
            <EChart
              option={createRadarChartOption(
                radarData.indicators,
                radarData.series,
                1
              )}
              height={400}
              width="100%"
            />
          </div>
        </Stack>
      </Card>

      <div className="grid grid-cols-5 gap-4">
        {radarData.indicators.map((indicator, index) => (
          <Card key={indicator} variant="default" padding="md">
            <Stack spacing="sm">
              <Typography variant="caption" className="text-slate-600">
                {indicator}
              </Typography>
              <Typography variant="h4" className="text-slate-900">
                {(radarData.series[0].value[index] * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" className="text-slate-500">
                Target: {(radarData.series[1].value[index] * 100).toFixed(0)}%
              </Typography>
            </Stack>
          </Card>
        ))}
      </div>
    </Stack>
  );
};

// Default Content (차트가 없는 메뉴)
const DefaultContent: React.FC<{ menuName: string }> = ({ menuName }) => {
  return (
    <Card variant="bordered" padding="lg">
      <Stack spacing="2xl">
        <Alert variant="info" title="Demo Page">
          This is a placeholder for <strong>{menuName}</strong> functionality.
          All UI components are built with Design System.
        </Alert>

        <div>
          <Typography variant="h4" className="mb-4">
            Available Actions
          </Typography>
          <Stack direction="horizontal" spacing="md">
            <Button variant="primary">Search</Button>
            <Button variant="secondary">Add New</Button>
            <Button variant="outline">Export</Button>
            <Button variant="ghost">Refresh</Button>
          </Stack>
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Sample Content
          </Typography>
          <Card variant="default" padding="md">
            <Typography variant="body2" className="text-slate-600">
              This area would contain the actual functionality of the page, such
              as data tables, forms, charts, or other interactive elements. The
              layout structure is ready for integration with real data and
              business logic.
            </Typography>
          </Card>
        </div>
      </Stack>
    </Card>
  );
};

export default Frame;
