import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useInteractions,
  useDismiss,
} from '@floating-ui/react';
import { type ReactNode, useState } from 'react';

interface MenuButtonProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export const MenuButton = ({ icon, label, children }: MenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        className={`flex cursor-pointer items-center overflow-hidden rounded-full px-3 py-2 text-black transition-all duration-200 dark:text-white hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${isOpen ? 'bg-gray-300 dark:bg-neutral-700' : 'bg-gray-200 dark:bg-neutral-900'} hover:bg-gray-300 dark:hover:bg-neutral-700 hover:[&>span:last-of-type]:opacity-100`}
        aria-label={label}
        onClick={() => setIsOpen((v) => !v)}
        {...getReferenceProps()}
      >
        <span className="flex items-center">{icon}</span>
        <span
          className={`${isOpen ? 'ml-2 max-w-[200px] opacity-100' : 'max-w-0 opacity-0'} font-semibold text-nowrap transition-all duration-200 sm:inline-block`}
        >
          {label}
        </span>
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 w-max max-w-[calc(100vw-2rem)] rounded bg-gray-200 px-2 py-3 text-sm text-black shadow-lg sm:w-max sm:max-w-md dark:bg-neutral-600 dark:text-white"
          {...getFloatingProps()}
        >
          {children}
        </div>
      )}
    </div>
  );
};
