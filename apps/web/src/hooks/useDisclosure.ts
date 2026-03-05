import { useCallback, useMemo, useState } from "react";

export interface UseDisclosureReturn {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const useDisclosure = (initialState: boolean = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  return useMemo(
    () => ({ isOpen, onClose, onOpen, onToggle, setIsOpen }),
    [isOpen, onClose, onOpen, onToggle, setIsOpen]
  );
};

export default useDisclosure;
