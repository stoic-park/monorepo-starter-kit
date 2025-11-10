import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider, useToast, Button } from '@design-system/components';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

const ToastDemo = () => {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-3 p-8">
      <h3 className="text-lg font-bold mb-2">Toast 테스트</h3>

      <Button onClick={() => toast.success('작업이 완료되었습니다')}>
        Success Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.error('오류가 발생했습니다')}
      >
        Error Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.warning('주의가 필요합니다')}
      >
        Warning Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => toast.info('새로운 알림이 있습니다')}
      >
        Info Toast
      </Button>

      <Button
        variant="ghost"
        onClick={() => toast.success('저장되었습니다', '성공')}
      >
        Toast with Title
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          toast.success('첫번째 알림');
          setTimeout(() => toast.info('두번째 알림'), 500);
          setTimeout(() => toast.warning('세번째 알림'), 1000);
        }}
      >
        Multiple Toasts
      </Button>
    </div>
  );
};

export const Interactive: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const Usage: StoryObj = {
  render: () => (
    <div className="p-8 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Toast 사용 방법</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">1. Provider 설정</h3>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
            {`import { ToastProvider } from '@design-system/components';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}`}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">2. Toast 호출</h3>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
            {`import { useToast } from '@design-system/components';

function MyComponent() {
  const toast = useToast();

  const handleSave = () => {
    toast.success('저장되었습니다');
    // toast.error('오류 발생');
    // toast.warning('경고');
    // toast.info('정보');
  };
}`}
          </pre>
        </div>
      </div>
    </div>
  ),
};
