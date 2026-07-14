import { useEffect, useRef, useState } from "react";

export default function useToggleDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen === false) return;

    const body = document.body;

    function closeEvent(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        setIsOpen(false);

        return;
      }

      if (
        e.target instanceof Node &&
        dropdownRef.current !== null &&
        dropdownRef.current.contains(e.target)
      )
        return;

      setIsOpen(false);
    }

    body.addEventListener("click", closeEvent);
    body.addEventListener("keydown", closeEvent);

    return () => {
      body.removeEventListener("click", closeEvent);
      body.removeEventListener("keydown", closeEvent);
    };
  }, [isOpen]);

  function toggle() {
    setIsOpen((c) => !c);
  }

  function onClose() {
    setIsOpen(false);
  }

  return { toggle, isOpen, dropdownRef, onClose };
}
