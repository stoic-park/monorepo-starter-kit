import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
} from './Modal';

describe('Modal', () => {
  const renderModal = (props = {}) => {
    return render(
      <Modal {...props}>
        <ModalTrigger>모달 열기</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>모달 제목</ModalTitle>
            <ModalClose />
          </ModalHeader>
          <ModalBody>모달 내용입니다.</ModalBody>
          <ModalFooter>
            <ModalClose>닫기</ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  it('렌더링이 정상적으로 되어야 함', () => {
    renderModal();
    expect(screen.getByText('모달 열기')).toBeInTheDocument();
  });

  it('트리거 클릭 시 모달이 열려야 함', async () => {
    const user = userEvent.setup();
    renderModal();

    const trigger = screen.getByText('모달 열기');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('모달 제목')).toBeInTheDocument();
      expect(screen.getByText('모달 내용입니다.')).toBeInTheDocument();
    });
  });

  it('닫기 버튼 클릭 시 모달이 닫혀야 함', async () => {
    const user = userEvent.setup();
    renderModal();

    // 모달 열기
    const trigger = screen.getByText('모달 열기');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('모달 제목')).toBeInTheDocument();
    });

    // 모달 닫기
    const closeButton = screen.getByRole('button', { name: '닫기' });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('모달 제목')).not.toBeInTheDocument();
    });
  });

  it('ESC 키로 모달이 닫혀야 함', async () => {
    const user = userEvent.setup();
    renderModal();

    // 모달 열기
    const trigger = screen.getByText('모달 열기');
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('모달 제목')).toBeInTheDocument();
    });

    // ESC 키 누르기
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('모달 제목')).not.toBeInTheDocument();
    });
  });

  it('defaultOpen prop으로 초기 열림 상태 설정', async () => {
    render(
      <Modal defaultOpen>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent>
          <ModalBody>내용</ModalBody>
        </ModalContent>
      </Modal>
    );

    await waitFor(() => {
      expect(screen.getByText('내용')).toBeInTheDocument();
    });
  });

  it('onOpenChange 콜백이 호출되어야 함', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Modal onOpenChange={handleOpenChange}>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent>
          <ModalBody>내용</ModalBody>
        </ModalContent>
      </Modal>
    );

    const trigger = screen.getByText('트리거');
    await user.click(trigger);

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('ModalDescription이 렌더링되어야 함', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>제목</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalDescription>설명입니다.</ModalDescription>
            내용
          </ModalBody>
        </ModalContent>
      </Modal>
    );

    await user.click(screen.getByText('트리거'));

    await waitFor(() => {
      expect(screen.getByText('설명입니다.')).toBeInTheDocument();
    });
  });

  it('size prop이 적용되어야 함', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent size="sm" data-testid="modal-content">
          <ModalBody>내용</ModalBody>
        </ModalContent>
      </Modal>
    );

    await user.click(screen.getByText('트리거'));

    await waitFor(() => {
      const content = screen.getByTestId('modal-content');
      expect(content).toHaveClass('max-w-md');
    });
  });

  it('커스텀 className이 적용되어야 함', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent className="custom-class" data-testid="modal-content">
          <ModalBody>내용</ModalBody>
        </ModalContent>
      </Modal>
    );

    await user.click(screen.getByText('트리거'));

    await waitFor(() => {
      const content = screen.getByTestId('modal-content');
      expect(content).toHaveClass('custom-class');
    });
  });

  it('ModalClose 아이콘 버튼이 작동해야 함', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger>트리거</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>제목</ModalTitle>
            <ModalClose data-testid="close-icon" />
          </ModalHeader>
          <ModalBody>내용</ModalBody>
        </ModalContent>
      </Modal>
    );

    await user.click(screen.getByText('트리거'));

    await waitFor(() => {
      expect(screen.getByText('제목')).toBeInTheDocument();
    });

    const closeIcon = screen.getByTestId('close-icon');
    await user.click(closeIcon);

    await waitFor(() => {
      expect(screen.queryByText('제목')).not.toBeInTheDocument();
    });
  });

  it('controlled 모드로 작동해야 함', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <button onClick={() => setOpen(true)}>외부 버튼</button>
          <Modal open={open} onOpenChange={setOpen}>
            <ModalContent>
              <ModalBody>내용</ModalBody>
              <ModalFooter>
                <ModalClose>닫기</ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      );
    };

    render(<TestComponent />);

    const externalButton = screen.getByText('외부 버튼');
    await user.click(externalButton);

    await waitFor(() => {
      expect(screen.getByText('내용')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: '닫기' });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('내용')).not.toBeInTheDocument();
    });
  });
});
