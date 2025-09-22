type BackspaceKeyProps = {
  onClick: () => void;
};

export const BackspaceKey = ({ onClick }: BackspaceKeyProps) => {
  return (
    <button
      className="max-w-[4rem] min-w-[2.5rem] flex-1 cursor-pointer rounded bg-red-400 px-2 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-red-500 sm:px-4 sm:py-2 dark:bg-rose-300 dark:hover:bg-rose-400"
      onClick={onClick}
      type="button"
    >
      ⌫
    </button>
  );
};
