import { useState, useCallback } from 'react';
import { ModalType, ModalData } from '../lib/types';

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData | null;
}

export function useModal() {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null
  });

  const onOpen = useCallback((type: ModalType, data: ModalData = {}) => {
    setState({
      isOpen: true,
      type,
      data
    });
  }, []);

  const onClose = useCallback(() => {
    setState({
      isOpen: false,
      type: null,
      data: null
    });
  }, []);

  return {
    ...state,
    onOpen,
    onClose
  };
}
