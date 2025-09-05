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
        className={`flex items-center overflow-hidden rounded-full px-3 py-2 text-white transition-all duration-200 hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${showMenu ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 hover:[&>span:last-of-type]:opacity-100`}
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
          className="absolute right-[-50%] z-50 mt-2 w-auto rounded bg-white/50 px-4 py-3 text-sm text-black shadow-lg sm:right-0"
        >
          {children}
        </div>
      )}
    </div>
  );
};
