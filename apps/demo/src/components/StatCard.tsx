import React from 'react';
import { Card, Typography, Badge, Stack } from '@design-system/components';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
}) => {
  return (
    <Card variant="elevated" padding="lg">
      <Stack spacing="md">
        {/* Header */}
        <Typography variant="body2" className="text-slate-600 font-medium">
          {title}
        </Typography>

        {/* Value */}
        <Typography variant="h2" className="font-bold text-slate-900">
          {value}
        </Typography>

        {/* Change & Description */}
        <Stack spacing="xs">
          <Badge variant={trend === 'up' ? 'success' : 'error'} size="sm">
            {change}
          </Badge>
          <Typography variant="caption" className="text-slate-500">
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default StatCard;

