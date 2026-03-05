import { useCallback, useMemo, useState } from "react";

const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

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
    [isOpen, onClose, onOpen, onToggle, setIsOpen],
  );
};

export default useDisclosure;
