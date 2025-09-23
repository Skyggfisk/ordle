type EnterKeyProps = {
  onClick: () => void;
};

export const EnterKey = ({ onClick }: EnterKeyProps) => {
  return (
    <button
      className="max-w-fit min-w-fit flex-1 cursor-pointer rounded bg-green-400 px-1 py-2 font-mono text-base font-bold text-black shadow transition-colors duration-150 hover:bg-green-500 sm:px-4 sm:py-2 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      onClick={onClick}
      type="button"
    >
      Enter
    </button>
  );
};
