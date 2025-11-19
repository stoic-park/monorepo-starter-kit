import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup, RadioGroupItem } from './Radio';

describe('RadioGroup', () => {
  it('렌더링이 정상적으로 되어야 함', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="1" label="옵션 1" />
        <RadioGroupItem value="2" label="옵션 2" />
      </RadioGroup>
    );

    expect(screen.getByText('옵션 1')).toBeInTheDocument();
    expect(screen.getByText('옵션 2')).toBeInTheDocument();
  });

  it('defaultValue가 설정되어야 함', () => {
    render(
      <RadioGroup defaultValue="2">
        <RadioGroupItem value="1" label="옵션 1" />
        <RadioGroupItem value="2" label="옵션 2" data-testid="radio-2" />
      </RadioGroup>
    );

    const radio2 = screen.getByTestId('radio-2');
    expect(radio2).toHaveAttribute('data-state', 'checked');
  });

  it('클릭 시 선택되어야 함', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioGroupItem value="1" label="옵션 1" />
        <RadioGroupItem value="2" label="옵션 2" />
      </RadioGroup>
    );

    const radio1 = screen.getByLabelText('옵션 1');
    await user.click(radio1);

    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('한 번에 하나만 선택되어야 함', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup>
        <RadioGroupItem value="1" label="옵션 1" data-testid="radio-1" />
        <RadioGroupItem value="2" label="옵션 2" data-testid="radio-2" />
      </RadioGroup>
    );

    const radio1 = screen.getByTestId('radio-1');
    const radio2 = screen.getByTestId('radio-2');

    await user.click(radio1);
    expect(radio1).toHaveAttribute('data-state', 'checked');
    expect(radio2).toHaveAttribute('data-state', 'unchecked');

    await user.click(radio2);
    expect(radio1).toHaveAttribute('data-state', 'unchecked');
    expect(radio2).toHaveAttribute('data-state', 'checked');
  });

  it('label 클릭으로 선택할 수 있어야 함', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioGroupItem value="1" label="옵션 1" />
      </RadioGroup>
    );

    const label = screen.getByText('옵션 1');
    await user.click(label);

    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('description이 표시되어야 함', () => {
    render(
      <RadioGroup>
        <RadioGroupItem
          value="1"
          label="프리미엄 플랜"
          description="모든 기능을 사용할 수 있습니다"
        />
      </RadioGroup>
    );

    expect(
      screen.getByText('모든 기능을 사용할 수 있습니다')
    ).toBeInTheDocument();
  });

  it('disabled 상태가 적용되어야 함', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="1" label="비활성화됨" disabled />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  it('disabled 상태에서 클릭이 불가능해야 함', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioGroupItem value="1" label="비활성화됨" disabled />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    await user.click(radio);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('error 상태가 표시되어야 함', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="1" label="에러 상태" error />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveClass('border-red-500');
  });

  it('required prop이 적용되어야 함', () => {
    render(
      <RadioGroup required>
        <RadioGroupItem value="1" label="필수" />
      </RadioGroup>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeRequired();
  });

  it('커스텀 className이 적용되어야 함', () => {
    render(
      <RadioGroup className="custom-group">
        <RadioGroupItem
          value="1"
          className="custom-item"
          data-testid="custom-radio"
        />
      </RadioGroup>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toHaveClass('custom-group');

    const radio = screen.getByTestId('custom-radio');
    expect(radio).toHaveClass('custom-item');
  });

  it('name prop이 적용되어야 함', () => {
    render(
      <RadioGroup name="option">
        <RadioGroupItem value="1" label="옵션 1" />
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'option');
  });

  it('controlled 모드로 작동해야 함', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = useState('1');

      return (
        <div>
          <div>선택된 값: {value}</div>
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioGroupItem value="1" label="옵션 1" />
            <RadioGroupItem value="2" label="옵션 2" />
          </RadioGroup>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText('선택된 값: 1')).toBeInTheDocument();

    const radio2 = screen.getByLabelText('옵션 2');
    await user.click(radio2);

    expect(screen.getByText('선택된 값: 2')).toBeInTheDocument();
  });

  it('키보드 네비게이션이 작동해야 함', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue="1">
        <RadioGroupItem value="1" label="옵션 1" data-testid="radio-1" />
        <RadioGroupItem value="2" label="옵션 2" data-testid="radio-2" />
        <RadioGroupItem value="3" label="옵션 3" data-testid="radio-3" />
      </RadioGroup>
    );

    const radio1 = screen.getByTestId('radio-1');
    radio1.focus();

    // 아래 화살표로 다음 항목 선택
    await user.keyboard('{ArrowDown}');
    const radio2 = screen.getByTestId('radio-2');
    expect(radio2).toHaveAttribute('data-state', 'checked');

    // 아래 화살표로 다음 항목 선택
    await user.keyboard('{ArrowDown}');
    const radio3 = screen.getByTestId('radio-3');
    expect(radio3).toHaveAttribute('data-state', 'checked');
  });
});
