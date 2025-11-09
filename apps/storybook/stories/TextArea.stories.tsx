import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@design-system/components';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    fullWidth: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '내용을 입력하세요',
  },
};

export const WithLabel: Story = {
  args: {
    label: '설명',
    placeholder: '자세한 설명을 입력하세요',
    rows: 5,
  },
};

export const Error: Story = {
  args: {
    label: '설명',
    placeholder: '내용을 입력하세요',
    error: true,
    errorMessage: '설명을 입력해주세요.',
  },
};

export const Disabled: Story = {
  args: {
    label: '설명',
    placeholder: '비활성화됨',
    disabled: true,
  },
};

export const NoResize: Story = {
  args: {
    label: '고정 ?�기',
    placeholder: '리사?�즈 불�?',
    resize: 'none',
  },
};

export const HorizontalResize: Story = {
  args: {
    label: '가로 리사이즈',
    placeholder: '가로로만 크기 조절 가능',
    resize: 'horizontal',
  },
};

export const LargeTextArea: Story = {
  args: {
    label: '�??�용',
    placeholder: '�??�용???�력?�세??,
    rows: 10,
  },
};
