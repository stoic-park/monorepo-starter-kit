import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack, Button, Card, Typography } from '@design-system/components';

/**
 * Stack 컴포넌트
 *
 * 디자인 토큰 기반 간격 관리 컴포넌트
 * className으로 직접 Tailwind를 사용할 수도 있고 일관된 간격 제공
 */
const meta = {
  title: 'Components/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalSmall: Story = {
  args: {
    direction: 'vertical',
    spacing: 'sm',
    children: (
      <>
        <Button>버튼 1</Button>
        <Button>버튼 2</Button>
        <Button>버튼 3</Button>
      </>
    ),
  },
};

export const VerticalMedium: Story = {
  args: {
    direction: 'vertical',
    spacing: 'md',
    children: (
      <>
        <Button>버튼 1</Button>
        <Button>버튼 2</Button>
        <Button>버튼 3</Button>
      </>
    ),
  },
};

export const VerticalLarge: Story = {
  args: {
    direction: 'vertical',
    spacing: 'xl',
    children: (
      <>
        <Button>버튼 1</Button>
        <Button>버튼 2</Button>
        <Button>버튼 3</Button>
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'lg',
    children: (
      <>
        <Button>버튼 1</Button>
        <Button>버튼 2</Button>
        <Button>버튼 3</Button>
      </>
    ),
  },
};

export const SpacingComparison: Story = {
  args: {
    spacing: 'xs',
    direction: 'vertical',
  },
  render: () => (
    <Stack spacing="4xl">
      <Card variant="bordered">
        <Typography variant="h4" className="mb-4">
          xs (8px)
        </Typography>
        <Stack spacing="xs">
          <Button size="sm">버튼 1</Button>
          <Button size="sm">버튼 2</Button>
          <Button size="sm">버튼 3</Button>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Typography variant="h4" className="mb-4">
          md (16px)
        </Typography>
        <Stack spacing="md">
          <Button size="sm">버튼 1</Button>
          <Button size="sm">버튼 2</Button>
          <Button size="sm">버튼 3</Button>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Typography variant="h4" className="mb-4">
          xl (32px)
        </Typography>
        <Stack spacing="xl">
          <Button size="sm">버튼 1</Button>
          <Button size="sm">버튼 2</Button>
          <Button size="sm">버튼 3</Button>
        </Stack>
      </Card>

      <Card variant="bordered">
        <Typography variant="h4" className="mb-4">
          2xl (48px)
        </Typography>
        <Stack spacing="2xl">
          <Button size="sm">버튼 1</Button>
          <Button size="sm">버튼 2</Button>
          <Button size="sm">버튼 3</Button>
        </Stack>
      </Card>
    </Stack>
  ),
};

export const NestedStacks: Story = {
  args: {
    spacing: 'xl',
    direction: 'vertical',
  },
  render: () => (
    <Stack spacing="3xl">
      <Card variant="elevated" padding="lg">
        <Stack spacing="xl">
          <Typography variant="h3">중첩된 Stack 예시</Typography>

          <Stack spacing="lg">
            <Typography variant="h4">가로 버튼 그룹</Typography>
            <Stack direction="horizontal" spacing="md">
              <Button variant="primary">확인</Button>
              <Button variant="outline">취소</Button>
            </Stack>
          </Stack>

          <Stack spacing="lg">
            <Typography variant="h4">세로 버튼 그룹</Typography>
            <Stack spacing="sm">
              <Button fullWidth>옵션 1</Button>
              <Button fullWidth>옵션 2</Button>
              <Button fullWidth>옵션 3</Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  ),
};
