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
  args: {},
  render: () => (
    <div className="w-96">
      <p className="text-sm">�?번째 ?�션</p>
      <Divider />
      <p className="text-sm">??번째 ?�션</p>
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
    label: '??보기',
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
      <span className="text-sm">?�쪽</span>
      <Divider orientation="vertical" />
      <span className="text-sm">가?�데</span>
      <Divider orientation="vertical" />
      <span className="text-sm">?�른�?/span>
    </div>
  ),
};

export const InCard: Story = {
  args: {},
  render: () => (
    <div className="w-96 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-bold mb-2">카드 ?�목</h3>
      <p className="text-sm text-gray-600 mb-4">�?번째 ?�션???�용?�니??</p>

      <Divider />

      <h3 className="text-lg font-bold mb-2">??번째 ?�션</h3>
      <p className="text-sm text-gray-600 mb-4">??번째 ?�션???�용?�니??</p>

      <Divider label="추�? ?�보" />

      <p className="text-sm text-gray-600">??번째 ?�션???�용?�니??</p>
    </div>
  ),
};
