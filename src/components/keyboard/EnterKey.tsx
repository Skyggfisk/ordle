type EnterKeyProps = {
  onClick: () => void;
};

export const EnterKey = ({ onClick }: EnterKeyProps) => {
  return (
    <button
      className="max-w-fit min-w-[2.5rem] flex-1 cursor-pointer rounded bg-green-300 px-2 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-green-400 sm:px-4 sm:py-2"
      onClick={onClick}
      type="button"
    >
      Enter
    </button>
  );
};
