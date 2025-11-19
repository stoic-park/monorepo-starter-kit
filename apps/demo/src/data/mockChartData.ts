import { subHours, subDays, eachDayOfInterval, format } from 'date-fns';

// Task Gantt Chart mock data
export const generateMockTaskData = () => {
  const now = new Date();
  const taskData = Array.from({ length: 20 }, (_, i) => {
    const start = subHours(now, 20 - i);
    const duration = Math.random() * 0.5; // 0-30분
    const end = new Date(start.getTime() + duration * 3600000);

    return {
      maintenanceSno: 1,
      fileSno: i + 1,
      startTime: start,
      endTime: end,
      isDefect: Math.random() > 0.9,
      recipe: ['RUN', 'AGING', 'N/I'][Math.floor(Math.random() * 3)],
      type: ['RUN', 'AGING', 'N/I'][Math.floor(Math.random() * 3)],
      lot: `LOT${String(i + 1).padStart(3, '0')}`,
      taskNo: `T${i + 1}`,
      isAbort: Math.random() > 0.95,
      value: Math.random() * 100,
      layer: 1,
      percent: Math.random() * 100,
    };
  });

  const maintenanceData = Array.from({ length: 3 }, (_, i) => {
    const start = subHours(now, (3 - i) * 8);
    const end = new Date(start.getTime() + 3600000);
    return {
      startTime: start,
      endTime: end,
      maintenanceSno: i + 1,
      result: i % 2 === 0 ? 'C' : 'E',
    };
  });

  return { taskData, maintenanceData };
};

// Backward compatibility
export const generateMockWaferData = generateMockTaskData;

// Line Chart 데이터 (학습 진행률)
export const generateMockTrainingData = () => {
  return {
    series: [
      {
        name: 'Train Accuracy',
        data: [65, 70, 75, 78, 82, 85, 87, 89, 90, 91],
      },
      {
        name: 'Validation Accuracy',
        data: [62, 68, 72, 75, 79, 82, 84, 86, 87, 88],
      },
      {
        name: 'Train Loss',
        data: [0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3, 0.28, 0.25],
      },
    ],
    xAxis: [
      'Epoch 1',
      'Epoch 2',
      'Epoch 3',
      'Epoch 4',
      'Epoch 5',
      'Epoch 6',
      'Epoch 7',
      'Epoch 8',
      'Epoch 9',
      'Epoch 10',
    ],
  };
};

// Bar Chart 데이터 (센서 데이터 수집)
export const generateMockDataCollectionBar = () => {
  return {
    series: [
      {
        name: 'Collected',
        data: [1200, 1350, 1100, 1450, 1250, 1600, 1400],
      },
      {
        name: 'Failed',
        data: [50, 45, 60, 40, 55, 35, 48],
      },
    ],
    xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };
};

// Line Chart 데이터 (센서 값 추이)
export const generateMockDataCollectionLine = () => {
  return {
    series: [
      {
        name: 'Sensor A',
        data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 200],
      },
      {
        name: 'Sensor B',
        data: [220, 182, 191, 234, 290, 330, 310, 280, 290, 300],
      },
      {
        name: 'Sensor C',
        data: [150, 232, 201, 154, 190, 330, 410, 380, 390, 400],
      },
    ],
    xAxis: [
      '00:00',
      '02:00',
      '04:00',
      '06:00',
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
    ],
    range: {
      high: [130, 140, 110, 140, 100, 240, 220, 190, 200, 210],
      mid: [120, 132, 101, 134, 90, 230, 210, 180, 190, 200],
      low: [110, 124, 91, 124, 80, 220, 200, 170, 180, 190],
    },
  };
};

// Scatter Chart 데이터 (센서 분석)
export const generateMockScatterData = () => {
  const categories = ['Sensor A', 'Sensor B', 'Sensor C', 'Sensor D'];
  const data = Array.from({ length: 100 }, (_, i) => ({
    value: Math.random() * 10,
    target: i % 20 === 0,
    category: categories[i % 4],
    index: i,
  }));

  const categoryBounds = {
    'Sensor A': { upper: 8, lower: 2 },
    'Sensor B': { upper: 7, lower: 3 },
    'Sensor C': { upper: 9, lower: 1 },
    'Sensor D': { upper: 6, lower: 4 },
  };

  return { data, categories, categoryBounds };
};

// Calendar Heatmap 데이터 (PM 관리)
export const generateMockCalendarData = () => {
  const today = new Date();
  const startDate = subDays(today, 90);
  const dateRange = eachDayOfInterval({ start: startDate, end: today });

  return dateRange.map((date) => ({
    date: format(date, 'yyyy-MM-dd'),
    success: Math.floor(Math.random() * 15),
    fail: Math.floor(Math.random() * 5),
  }));
};

// Radar Chart 데이터 (공정 관리)
export const generateMockRadarData = () => {
  return {
    indicators: [
      'Temperature',
      'Pressure',
      'Flow Rate',
      'RF Power',
      'Gas Flow',
    ],
    series: [
      {
        name: 'Current',
        value: [0.8, 0.7, 0.9, 0.85, 0.75],
        color: '#3B82F6',
      },
      {
        name: 'Target',
        value: [0.85, 0.8, 0.95, 0.9, 0.8],
        color: '#10B981',
      },
      {
        name: 'Upper Limit',
        value: [0.95, 0.95, 1.0, 0.95, 0.95],
        color: '#EF4444',
      },
    ],
  };
};

