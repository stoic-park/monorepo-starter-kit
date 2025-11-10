import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@design-system/components';
import React from 'react';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'option',
    value: '1',
    label: '옵션 1',
  },
};

export const WithDescription: Story = {
  args: {
    name: 'option',
    value: '1',
    label: '옵션 1',
    description: '이 옵션에 대한 설명입니다',
  },
};

export const Error: Story = {
  args: {
    name: 'option',
    value: '1',
    label: '필수 선택',
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'option',
    value: '1',
    label: '비활성화됨',
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    name: 'option',
    value: '1',
    label: '선택됨',
    defaultChecked: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    name: 'option',
    value: '1',
  },
};

export const Group: Story = {
  args: {
    name: 'size',
    value: 'sm',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio name="size" value="sm" label="Small" defaultChecked />
      <Radio name="size" value="md" label="Medium" />
      <Radio name="size" value="lg" label="Large" />
      <Radio name="size" value="xl" label="Extra Large (비활성화)" disabled />
    </div>
  ),
};

export const UseYnGroup: Story = {
  args: {
    name: 'useYn',
    value: 'Y',
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-900 mb-1">사용 여부</div>
      <div className="flex gap-4">
        <Radio name="useYn" value="Y" label="Y" defaultChecked />
        <Radio name="useYn" value="N" label="N" />
      </div>
    </div>
  ),
};
