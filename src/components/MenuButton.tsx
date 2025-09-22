import type { RefObject, ReactNode, Dispatch, SetStateAction } from 'react';

interface MenuButtonProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export const MenuButton = ({
  buttonRef,
  menuRef,
  showMenu,
  setShowMenu,
  icon,
  label,
  children,
}: MenuButtonProps) => {
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`flex cursor-pointer items-center overflow-hidden rounded-full px-3 py-2 text-black transition-all duration-200 dark:text-white hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${showMenu ? 'bg-gray-300 dark:bg-neutral-700' : 'bg-gray-200 dark:bg-neutral-900'} hover:bg-gray-300 dark:hover:bg-neutral-700 hover:[&>span:last-of-type]:opacity-100`}
        aria-label={label}
        onClick={() => setShowMenu((v) => !v)}
      >
        <span className="flex items-center">{icon}</span>
        <span
          className={`${showMenu ? 'ml-2 max-w-[200px] opacity-100' : 'max-w-0 opacity-0'} text-nowrap transition-all duration-200 sm:inline-block`}
        >
          {label}
        </span>
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-[-50%] z-50 mt-2 w-auto rounded bg-gray-200 px-4 py-3 text-sm text-black shadow-lg sm:right-0 dark:bg-neutral-600 dark:text-white"
        >
          {children}
        </div>
      )}
    </div>
  );
};
