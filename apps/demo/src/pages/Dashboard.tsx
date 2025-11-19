import React from 'react';
import {
  Typography,
  Card,
  Button,
  Stack,
  Divider,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@design-system/components';
import {
  EChart,
  createLineChartOption,
  createBarChartOption,
  createCalendarHeatmapOption,
} from '../components/charts';
import { subDays, eachDayOfInterval, format } from 'date-fns';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

const Dashboard: React.FC = () => {
  // Sample data for Line Chart (Visitors Trend)
  const visitorData = [
    { name: 'Desktop', data: [4200, 5300, 4100, 6700, 5200, 7800] },
    { name: 'Mobile', data: [3100, 4000, 3200, 5100, 4200, 6400] },
    { name: 'Tablet', data: [1500, 1800, 1400, 2200, 1900, 2600] },
  ];

  const visitorXAxis = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Sample data for Bar Chart (Device Activity)
  const activityData = [
    { name: 'Device A', data: [320, 302, 301, 334, 390] },
    { name: 'Device B', data: [220, 182, 191, 234, 290] },
    { name: 'Device C', data: [150, 212, 201, 154, 190] },
  ];

  const activityXAxis = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  // Sample data for Calendar Heatmap
  const today = new Date();
  const startDate = subDays(today, 90);
  const dateRange = eachDayOfInterval({ start: startDate, end: today });

  const calendarData = dateRange.map((date) => ({
    date: format(date, 'yyyy-MM-dd'),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 5),
  }));

  return (
    <Layout>
      <Stack spacing="3xl">
        {/* Page Header */}
        <div>
          <Stack spacing="md">
            <div className="flex items-center justify-between">
              <Typography variant="h1" className="text-slate-900 font-bold">
                Dashboard
              </Typography>
              <Stack direction="horizontal" spacing="md">
                <Select defaultValue="3m">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">Last 3 months</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="primary">Download Report</Button>
              </Stack>
            </div>
            <Typography variant="body1" className="text-slate-600">
              Welcome back! Here&apos;s what&apos;s happening with your projects
              today.
            </Typography>
          </Stack>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$1,250.00"
            change="+12.5%"
            trend="up"
            description="Trending up this month"
          />
          <StatCard
            title="New Customers"
            value="1,234"
            change="-20%"
            trend="down"
            description="Down from last period"
          />
          <StatCard
            title="Active Accounts"
            value="45,678"
            change="+12.5%"
            trend="up"
            description="Strong user retention"
          />
          <StatCard
            title="Growth Rate"
            value="4.5%"
            change="+4.5%"
            trend="up"
            description="Steady performance increase"
          />
        </div>

        {/* Charts Section */}
        <Stack spacing="2xl">
          {/* Line Chart - Visitors Trend */}
          <Card variant="elevated" padding="lg">
            <Stack spacing="2xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography
                    variant="h3"
                    className="font-bold text-slate-900 mb-2"
                  >
                    Total Visitors
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Visitor trends across all platforms for the last 6 months
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <Divider />
              <EChart
                option={createLineChartOption(
                  visitorData,
                  visitorXAxis,
                  undefined,
                  undefined,
                  'Visitors'
                )}
                height={350}
                width="100%"
              />
            </Stack>
          </Card>

          {/* Bar Chart - Device Activity */}
          <Card variant="elevated" padding="lg">
            <Stack spacing="2xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography
                    variant="h3"
                    className="font-bold text-slate-900 mb-2"
                  >
                    Device Activity
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Weekly activity output by device
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
              <Divider />
              <EChart
                option={createBarChartOption(
                  activityData,
                  activityXAxis,
                  undefined,
                  false,
                  false
                )}
                height={350}
                width="100%"
              />
            </Stack>
          </Card>

          {/* Calendar Heatmap - Daily Activity */}
          <Card variant="elevated" padding="lg">
            <Stack spacing="2xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography
                    variant="h3"
                    className="font-bold text-slate-900 mb-2"
                  >
                    Daily Activity Heatmap
                  </Typography>
                  <Typography variant="body2" className="text-slate-600">
                    Success/Fail counts for the last 90 days
                  </Typography>
                </div>
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
              <Divider />
              <EChart
                option={createCalendarHeatmapOption(
                  calendarData,
                  startDate,
                  today
                )}
                height={200}
                width="100%"
              />
            </Stack>
          </Card>
        </Stack>

        {/* Footer Info */}
        <Card variant="bordered" padding="lg">
          <Stack spacing="md">
            <Typography variant="h4" className="font-bold text-slate-900">
              About This Dashboard
            </Typography>
            <Typography variant="body2" className="text-slate-600">
              This demo dashboard showcases the <strong>Design System</strong>{' '}
              with real-world components:
            </Typography>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1 ml-4">
              <li>
                <strong>@design-system/components</strong>: Button, Card, Input,
                Badge, Typography, Stack, Select
              </li>
              <li>
                <strong>@demo/charts</strong>: Line Chart, Bar Chart, Calendar
                Heatmap (ECharts-based)
              </li>
              <li>
                <strong>@design-system/tokens</strong>: Consistent colors,
                spacing, typography, shadows
              </li>
              <li>
                <strong>@design-system/theme</strong>: Tailwind CSS preset for
                unified styling
              </li>
            </ul>
            <Divider />
            <Typography variant="caption" className="text-slate-500">
              Built with React 18, TypeScript, Vite, and the Design System •
              Inspired by shadcn/ui
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Layout>
  );
};

export default Dashboard;
