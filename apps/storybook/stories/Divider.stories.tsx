import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '@design-system/components';
import React from 'react';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: () => (
    <div className="w-96">
      <p className="text-sm">첫번째 섹션</p>
      <Divider />
      <p className="text-sm">두번째 섹션</p>
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: '또는',
    labelPosition: 'center',
  },
  render: (args) => (
    <div className="w-96">
      <p className="text-sm">로그인</p>
      <Divider {...args} />
      <p className="text-sm">소셜 로그인</p>
    </div>
  ),
};

export const LabelLeft: Story = {
  args: {
    label: '추가 옵션',
    labelPosition: 'left',
  },
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
};

export const LabelRight: Story = {
  args: {
    label: '더 보기',
    labelPosition: 'right',
  },
  render: (args) => (
    <div className="w-96">
      <Divider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: () => (
    <div className="flex items-center h-20">
      <span className="text-sm">왼쪽</span>
      <Divider orientation="vertical" />
      <span className="text-sm">가운데</span>
      <Divider orientation="vertical" />
      <span className="text-sm">오른쪽</span>
    </div>
  ),
};

export const InCard: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: () => (
    <div className="w-96 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-bold mb-2">카드 제목</h3>
      <p className="text-sm text-gray-600 mb-4">첫번째 섹션의 내용입니다</p>

      <Divider />

      <h3 className="text-lg font-bold mb-2">두번째 섹션</h3>
      <p className="text-sm text-gray-600 mb-4">두번째 섹션의 내용입니다</p>

      <Divider label="추가 정보" />

      <p className="text-sm text-gray-600">세번째 섹션의 내용입니다</p>
    </div>
  ),
};
