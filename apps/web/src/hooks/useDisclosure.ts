import { useMemo, useState } from "react";

const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  return useMemo(() => {
    const onClose = () => setIsOpen(false);
    const onOpen = () => setIsOpen(true);
    const onToggle = () => setIsOpen((prev) => !prev);
    return { isOpen, onClose, onOpen, onToggle, setIsOpen };
  }, [setIsOpen, isOpen]);
};

export default useDisclosure;
